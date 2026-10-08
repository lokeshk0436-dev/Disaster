import React, { useState, useEffect, useRef } from 'react';
import { useAypo } from '../../context/AypoContext';
import { UserRole } from '../../types';
import { auth } from '../../config/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, signInWithPopup, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
import { Capacitor } from '@capacitor/core';
import { 
  Users, 
  Ambulance, 
  Building2, 
  Landmark, 
  Phone, 
  ArrowRight,
  Activity,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

declare global {
  interface Window {
    recaptchaVerifier: any;
    confirmationResult: any;
  }
}

interface PortalDefinition {
  role: UserRole;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}

const PORTALS: PortalDefinition[] = [
  { role: 'FAMILY', title: 'Family Portal', icon: Users },
  { role: 'PUBLIC_SERVICE', title: 'Public Service', icon: Ambulance },
  { role: 'PRIVATE_ORG', title: 'Relief NGO', icon: Building2 },
  { role: 'GOVERNMENT', title: 'Gov Command', icon: Landmark }
];

export const AuthScreen: React.FC = () => {
  const { login } = useAypo();

  const [selectedPortal, setSelectedPortal] = useState<UserRole>('FAMILY');
  const [phoneStep, setPhoneStep] = useState<'enter_phone' | 'enter_otp'>('enter_phone');
  const [phoneNumber, setPhoneNumber] = useState('9840122341');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Step 1: Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.replace(/\D/g, '').length < 8) {
      setErrorMsg('Please enter a valid mobile number.');
      return;
    }
    setErrorMsg('');
    setIsLoading(true);
    
    try {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible'
        });
      }
      
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, window.recaptchaVerifier);
      window.confirmationResult = confirmation;
      
      setOtpDigits(['', '', '', '', '', '']);
      setPhoneStep('enter_otp');
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 150);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to send OTP. Try again.');
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP digit changes
  const handleDigitChange = (index: number, val: string) => {
    const digit = val.slice(-1);
    const updated = [...otpDigits];
    updated[index] = digit;
    setOtpDigits(updated);

    if (digit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
    
    if (digit && index === 5 && updated.every(d => d.trim() !== '')) {
      executePhoneLogin(updated.join(''));
    }
  };

  const handleDigitKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Execute Login
  const executePhoneLogin = async (code: string) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      if (!window.confirmationResult) throw new Error("No confirmation result");
      const result = await window.confirmationResult.confirm(code);
      const user = result.user;
      
      await login({
        identifier: user.phoneNumber || `+91${phoneNumber}`,
        password: code,
        role: selectedPortal,
        authProvider: 'phone'
      });
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Verification failed. Invalid OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  // Social Login
  const handleSocialLogin = async (providerName: 'google' | 'apple') => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      let provider;
      if (providerName === 'google') {
        provider = new GoogleAuthProvider();
      } else {
        provider = new OAuthProvider('apple.com');
      }
      
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      await login({
        identifier: user.email || user.uid,
        role: selectedPortal,
        authProvider: providerName
      });
    } catch (err: any) {
      console.error(err);
      setErrorMsg(`${providerName} login failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans text-gray-900 selection:bg-blue-500 selection:text-white">
      
      {/* LEFT SIDE: Immersive Media Background */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-gray-900 flex-col justify-between p-12">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-60 mix-blend-screen"
        >
          <source src="https://demo.awaikenthemes.com/assets/videos/artistic-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/80 via-gray-900/60 to-gray-950/90 z-10 pointer-events-none"></div>

        <div className="relative z-20">
          <div className="inline-flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-gray-900 shadow-xl">
               <Activity className="w-6 h-6" />
            </div>
            <span className="text-3xl font-extrabold tracking-tight text-white">AYPO</span>
          </div>
        </div>

        <div className="relative z-20 max-w-lg mb-12">
          <h1 className="text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            Innovative Solutions for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Crisis Management</span>
          </h1>
          <p className="text-lg text-gray-300 font-medium">
            A centralized, secure portal for family reunification, emergency coordination, and real-time resource tracking during critical disaster events.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: Clean Light Mode Auth */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-gray-50">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          
          {/* Mobile Logo (Visible only on small screens) */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center text-white shadow-xl">
               <Activity className="w-6 h-6" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Welcome to AYPO</h2>
            <p className="text-sm text-gray-500 font-medium mt-1">Sign in to access your designated portal</p>
          </div>

          {/* Portal Selector */}
          <div className="mb-8">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Select Portal Access</label>
            <div className="grid grid-cols-2 gap-2">
              {PORTALS.map(portal => {
                const Icon = portal.icon;
                const isSelected = selectedPortal === portal.role;
                return (
                  <button
                    key={portal.role}
                    onClick={() => setSelectedPortal(portal.role)}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 shadow-sm ring-1 ring-blue-600/20'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
                    <span className={`text-xs font-bold ${isSelected ? 'text-blue-900' : 'text-gray-600'}`}>
                      {portal.title}
                    </span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 ml-auto" />}
                  </button>
                );
              })}
            </div>
          </div>

          {errorMsg && (
            <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{errorMsg}</span>
            </div>
          )}

          {phoneStep === 'enter_phone' ? (
            <div className="space-y-6 animate-fade-in">
              {/* Social Logins - Hidden on Native Mobile to prevent WebView redirect errors */}
              {!Capacitor.isNativePlatform() && (
                <>
                  <div className="space-y-3">
                    <button
                      onClick={() => handleSocialLogin('google')}
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 rounded-xl text-sm font-bold text-gray-700 transition-all shadow-sm"
                    >
                      <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                      Continue with Google
                    </button>
                    <button
                      onClick={() => handleSocialLogin('apple')}
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gray-900 border border-gray-900 hover:bg-gray-800 rounded-xl text-sm font-bold text-white transition-all shadow-sm"
                    >
                      <img src="https://www.svgrepo.com/show/511330/apple-173.svg" alt="Apple" className="w-5 h-5 invert" />
                      Continue with Apple
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="flex-shrink-0 mx-4 text-xs font-bold text-gray-400 uppercase">Or log in with</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                  </div>
                </>
              )}

              {/* Phone Form */}
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
                    <span className="absolute left-10 top-3 text-sm font-bold text-gray-900">+91</span>
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={e => setPhoneNumber(e.target.value)}
                      placeholder="98401 22341"
                      className="w-full bg-white border border-gray-200 rounded-xl pl-17 pr-4 py-3 text-sm font-bold text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                      style={{ paddingLeft: '4.5rem' }}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-[0_0_20px_rgba(37,99,235,0.2)] transition-all flex items-center justify-center gap-2 active:scale-98"
                >
                  {isLoading ? 'Sending...' : 'Send OTP Code'}
                </button>
                <div id="recaptcha-container" className="flex justify-center mt-2"></div>
              </form>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in text-center">
              <div>
                <h3 className="text-lg font-black text-gray-900">Verify your number</h3>
                <p className="text-sm text-gray-500 mt-1">We sent a 6-digit code to <span className="font-bold text-gray-900">+91 {phoneNumber}</span></p>
                <button 
                  onClick={() => setPhoneStep('enter_phone')}
                  className="text-xs text-blue-600 font-bold hover:underline mt-2"
                >
                  Change number
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 py-4">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={el => { otpInputRefs.current[idx] = el; }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleDigitChange(idx, e.target.value)}
                    onKeyDown={e => handleDigitKeyDown(idx, e)}
                    className="w-12 h-14 text-center font-black text-2xl rounded-xl bg-white border-2 border-gray-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 text-gray-900 focus:outline-none transition-all"
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => executePhoneLogin(otpDigits.join(''))}
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                {isLoading ? 'Verifying...' : 'Verify & Continue'}
              </button>
            </div>
          )}

          <p className="text-center text-xs text-gray-400 mt-8 font-medium">
            Protected by advanced 256-bit AES encryption.
          </p>
        </div>
      </div>
    </div>
  );
};
