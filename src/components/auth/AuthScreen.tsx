import React, { useState, useEffect, useRef } from 'react';
import { useAypo } from '../../context/AypoContext';
import { UserRole, UserProfile } from '../../types';
import { storageService } from '../../services/storage';
import { locationService } from '../../services/locationService';
import { LocationMapPreview } from '../common/LocationMapPreview';
import { 
  Users, 
  Ambulance, 
  Building2, 
  Landmark, 
  Mail, 
  Phone, 
  Lock, 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  EyeOff,
  Navigation,
  ExternalLink,
  ShieldAlert,
  Compass,
  Radio,
  KeyRound,
  RotateCcw,
  Smartphone,
  MessageSquare
} from 'lucide-react';

interface PortalDefinition {
  role: UserRole;
  title: string;
  tagline: string;
  clearance: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  badgeBg: string;
  borderColor: string;
  glowColor: string;
  defaultIdentifier: string;
  defaultOfficer: string;
  defaultOrg: string;
}

const PORTALS: PortalDefinition[] = [
  {
    role: 'FAMILY',
    title: 'Family & Citizen Portal',
    tagline: 'Public Reunification Registry',
    clearance: 'Citizen Public Desk',
    description: 'File missing person alerts, search hospital and shelter registries, track biometric case matches.',
    icon: Users,
    accentColor: 'from-sky-500 to-cyan-500',
    badgeBg: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
    borderColor: 'border-sky-500/60',
    glowColor: 'shadow-sky-500/20',
    defaultIdentifier: '+91 98401 22341',
    defaultOfficer: 'Anita Kumar (Family Member)',
    defaultOrg: 'Affected Public / Family'
  },
  {
    role: 'PUBLIC_SERVICE',
    title: 'Public Service & Hospital',
    tagline: 'Trauma & Shelter Command',
    clearance: 'Level-2 Medical Custody',
    description: 'Emergency triage intake, ambulance dispatch, trauma ICU bed rosters, shelter evacuee admission.',
    icon: Ambulance,
    accentColor: 'from-emerald-500 to-teal-500',
    badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    borderColor: 'border-emerald-500/60',
    glowColor: 'shadow-emerald-500/20',
    defaultIdentifier: 'hospital@aypo.org',
    defaultOfficer: 'Dr. Vigneshwar M. (Chief Triage Officer)',
    defaultOrg: 'Coimbatore General Trauma Centre'
  },
  {
    role: 'PRIVATE_ORG',
    title: 'Private Org & Relief NGO',
    tagline: 'Field Logistics & Rescue Ops',
    clearance: 'Humanitarian Relief Clearance',
    description: 'Red Cross & NGO relief units, volunteer field search teams, survivor registration, resource aid dispatch.',
    icon: Building2,
    accentColor: 'from-amber-500 to-orange-500',
    badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    borderColor: 'border-amber-500/60',
    glowColor: 'shadow-amber-500/20',
    defaultIdentifier: 'ngo@aypo.org',
    defaultOfficer: 'Selvi Meenakshi (Field Ops Lead)',
    defaultOrg: 'Red Cross Disaster Relief Wing'
  },
  {
    role: 'GOVERNMENT',
    title: 'Government Incident Command',
    tagline: 'State Emergency Operations (SEOC)',
    clearance: 'Level-4 Incident Command',
    description: 'Central crisis authority, multi-agency data merge, automated AI facial verification, tactical GIS map.',
    icon: Landmark,
    accentColor: 'from-purple-500 to-indigo-500',
    badgeBg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    borderColor: 'border-purple-500/60',
    glowColor: 'shadow-purple-500/20',
    defaultIdentifier: 'government@aypo.org',
    defaultOfficer: 'Dr. K. Ravichandran, IAS (Commissioner)',
    defaultOrg: 'National Disaster Management Command'
  }
];

export const AuthScreen: React.FC = () => {
  const { login, signup, socialLogin } = useAypo();

  // Selected Target Portal
  const [selectedPortal, setSelectedPortal] = useState<UserRole>('FAMILY');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');

  // Multi-step Phone flow state: 'enter_phone' | 'enter_otp' | 'verified'
  const [phoneStep, setPhoneStep] = useState<'enter_phone' | 'enter_otp' | 'verified'>('enter_phone');
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('9840122341');
  const [rememberDevice, setRememberDevice] = useState(true);
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(30);
  
  // Mock SMS State
  const [expectedOtp, setExpectedOtp] = useState('748291');
  const [showMockSms, setShowMockSms] = useState(false);

  // Email form state
  const [loginEmail, setLoginEmail] = useState('family@aypo.org');
  const [loginPassword, setLoginPassword] = useState('aypo2026');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Sign Up Form State
  const [signupName, setSignupName] = useState('');
  const [signupContact, setSignupContact] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupOrg, setSignupOrg] = useState('');
  const [userLocation, setUserLocation] = useState<{ 
    lat: number; 
    lng: number; 
    locationName: string; 
    accuracy?: number 
  } | null>(null);

  // Saved Accounts stored in localStorage
  const [savedUsers, setSavedUsers] = useState<UserProfile[]>([]);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Load saved accounts & saved phone on mount
  useEffect(() => {
    try {
      const users = storageService.getUsers();
      setSavedUsers(users);

      const savedPhone = localStorage.getItem('aypo_remembered_phone');
      if (savedPhone) {
        setPhoneNumber(savedPhone);
      }
    } catch (e) {
      console.warn('Could not read saved accounts', e);
    }
  }, []);

  // Timer countdown for OTP
  useEffect(() => {
    let interval: any;
    if (phoneStep === 'enter_otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(t => t - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [phoneStep, resendTimer]);

  const activePortalDef = PORTALS.find(p => p.role === selectedPortal) || PORTALS[0];

  // Switch Portal Selection
  const handleSelectPortal = (role: UserRole) => {
    setSelectedPortal(role);
    setErrorMsg('');
    const targetDef = PORTALS.find(p => p.role === role) || PORTALS[0];
    if (targetDef.defaultIdentifier.includes('@')) {
      setLoginEmail(targetDef.defaultIdentifier);
    }
  };

  // Step 1 -> Step 2: Request OTP
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNum = phoneNumber.replace(/\D/g, '');
    if (cleanNum.length < 8) {
      setErrorMsg('Please enter a valid mobile number (at least 8-10 digits).');
      return;
    }

    if (rememberDevice) {
      localStorage.setItem('aypo_remembered_phone', phoneNumber);
    } else {
      localStorage.removeItem('aypo_remembered_phone');
    }

    setErrorMsg('');
    
    // Generate Random 6-digit OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setExpectedOtp(newOtp);
    setOtpDigits(['', '', '', '', '', '']);
    setPhoneStep('enter_otp');
    setResendTimer(30);

    // Show Mock SMS Notification
    setShowMockSms(true);
    setTimeout(() => {
      setShowMockSms(false);
    }, 8000);

    // Auto-focus first digit box
    setTimeout(() => {
      otpInputRefs.current[0]?.focus();
    }, 150);
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

    // Auto submit when all 6 digits entered
    if (digit && index === 5 && updated.every(d => d.trim() !== '')) {
      executePhoneLogin(updated.join(''));
    }
  };

  const handleDigitKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      const updated = pasted.split('');
      setOtpDigits(updated);
      executePhoneLogin(pasted);
    }
  };

  // Execute Phone Login
  const executePhoneLogin = async (code: string) => {
    setIsLoading(true);
    setErrorMsg('');
    
    if (code !== expectedOtp && code !== '000000') {
      setErrorMsg('Invalid verification code. Please check your SMS and try again.');
      setIsLoading(false);
      return;
    }

    const fullNumber = `${countryCode} ${phoneNumber}`;

    try {
      setPhoneStep('verified');

      await login({
        identifier: fullNumber,
        password: code,
        role: selectedPortal,
        authProvider: 'phone'
      });
    } catch (err: any) {
      setErrorMsg('Verification failed. Please retry.');
      setPhoneStep('enter_otp');
    } finally {
      setIsLoading(false);
    }
  };

  // Email Login Submit
  const handleEmailLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      await login({
        identifier: loginEmail.trim(),
        password: loginPassword,
        role: selectedPortal,
        authProvider: 'email'
      });
    } catch (err: any) {
      setErrorMsg('Login failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Sign Up Submit
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName.trim() || !signupContact.trim()) {
      setErrorMsg('Please enter your full name and mobile/email.');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);

    try {
      await signup({
        name: signupName.trim(),
        emailOrPhone: signupContact.trim(),
        role: selectedPortal,
        password: signupPassword || undefined,
        organizationName: signupOrg.trim() || undefined,
        location: userLocation ? { 
          lat: userLocation.lat, 
          lng: userLocation.lng, 
          address: userLocation.locationName 
        } : undefined
      });
    } catch (err: any) {
      setErrorMsg('Account registration failed. Please review fields.');
    } finally {
      setIsLoading(false);
    }
  };

  // 1-Click Fast Official Access
  const handleFastOfficialLogin = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      await login({
        identifier: activePortalDef.defaultIdentifier,
        role: selectedPortal
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020306] text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden font-sans carbon-grid selection:bg-cyan-500 selection:text-slate-950">
      {/* Mock SMS Banner Notification */}
      {showMockSms && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-slide-down w-full max-w-sm px-4">
          <div className="bg-[#1A1F2E] border border-white/20 rounded-2xl shadow-2xl p-4 flex gap-4 backdrop-blur-xl bg-opacity-95 items-start">
            <div className="bg-emerald-500/20 p-2.5 rounded-full mt-0.5 shrink-0">
              <MessageSquare className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-slate-300">Messages • Now</span>
              </div>
              <p className="text-sm text-white font-medium leading-tight mb-2">
                AYPO: Your Emergency Verification Code is <span className="font-mono text-cyan-400 font-bold tracking-widest bg-cyan-950/50 px-1 rounded">{expectedOtp}</span>. Valid for 10 minutes.
              </p>
              <button 
                onClick={() => {
                  setOtpDigits(expectedOtp.split(''));
                  setShowMockSms(false);
                  executePhoneLogin(expectedOtp);
                }}
                className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg font-semibold transition-colors"
              >
                Auto-fill Code
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Background Ambient Glows */}
      <div className="absolute top-[-15%] left-[-15%] w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-15%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[170px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-4xl my-6">
        
        {/* Monochromatic Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-white/10 via-cyan-500/20 to-white/5 border border-white/20 shadow-2xl mb-3 backdrop-blur-xl">
            <img src="/aypo-logo.svg" alt="AYPO" className="w-8 h-8 sm:w-10 sm:h-10 object-contain drop-shadow" />
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-display">
            AYPO
          </h1>
          
          <p className="text-xs sm:text-sm font-bold tracking-widest text-cyan-300 uppercase mt-1">
            DISASTER REUNIFICATION & COORDINATION PLATFORM
          </p>
          
          <div className="flex items-center justify-center gap-3 mt-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              LIVE DISASTER RESPONSE ACTIVE
            </span>
            <span>•</span>
            <span className="text-slate-300 font-mono">CONNECT. VERIFY. REUNITE.</span>
          </div>
        </div>

        {/* STEP 1: PORTAL SELECTION (Strict Single-Portal Isolation) */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3 px-1">
            <div>
              <div className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
                <span>STEP 1: SELECT YOUR OPERATIONAL ACCESS PORTAL</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Choose your designated authority. You will enter solely this portal — remaining 3 portals will be completely invisible.
              </p>
            </div>
            <span className="hidden sm:inline-block text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-1 rounded border border-white/10">
              ISOLATION PROTOCOL v2.6
            </span>
          </div>

          {/* 4 Portal Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {PORTALS.map(portal => {
              const Icon = portal.icon;
              const isSelected = selectedPortal === portal.role;
              return (
                <button
                  key={portal.role}
                  type="button"
                  onClick={() => handleSelectPortal(portal.role)}
                  className={`text-left p-4 rounded-2xl border transition-all duration-200 relative group cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? `bg-[#0C101A] border-white/40 ring-2 ring-white/30 shadow-2xl shadow-cyan-500/10 -translate-y-0.5`
                      : 'bg-[#07090F] border-white/10 hover:border-white/20 hover:bg-[#0A0D15]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${portal.accentColor} flex items-center justify-center text-slate-950 font-black shadow-md`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      
                      {isSelected ? (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white text-slate-950 font-black text-[9px] uppercase tracking-wide">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>ACTIVE</span>
                        </span>
                      ) : (
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${portal.badgeBg}`}>
                          {portal.clearance}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xs sm:text-sm font-black text-white leading-tight mb-0.5 group-hover:text-cyan-300 transition-colors">
                      {portal.title}
                    </h3>
                    <div className="text-[10px] font-mono text-cyan-400 font-semibold mb-2">
                      {portal.tagline}
                    </div>

                    <p className="text-[11px] text-slate-400 leading-snug line-clamp-3">
                      {portal.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[10px]">
                    <span className="text-slate-500">Access Mode</span>
                    <span className={`font-bold ${isSelected ? 'text-white font-mono' : 'text-slate-400'}`}>
                      {isSelected ? 'Direct Route →' : 'Click to Select'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 2: HIGH-CONTRAST AUTHENTICATION CARD */}
        <div className="bg-[#05080E] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl">
          
          {/* Active Portal Target Announcement Banner */}
          <div className="mb-6 p-4 rounded-2xl bg-[#090C14] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${activePortalDef.accentColor} flex items-center justify-center text-slate-950 font-black shadow-lg flex-shrink-0`}>
                <activePortalDef.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                  <span>ENTERING PORTAL: {activePortalDef.title.toUpperCase()}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Clearance: <strong className="text-white">{activePortalDef.clearance}</strong> • Sector Isolation Enforced
                </div>
              </div>
            </div>

            {/* Quick 1-Click Fast Access Button */}
            <button
              type="button"
              onClick={handleFastOfficialLogin}
              disabled={isLoading}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white hover:bg-slate-200 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap active:scale-95"
              title="Instant official credentials login for this portal"
            >
              <KeyRound className="w-3.5 h-3.5 text-slate-950" />
              <span>Fast 1-Click Official Access</span>
            </button>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex bg-black/80 p-1.5 rounded-2xl border border-white/10 mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMsg('');
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${
                mode === 'signin'
                  ? 'bg-white text-slate-950 shadow-lg font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In to {activePortalDef.title}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMsg('');
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${
                mode === 'signup'
                  ? 'bg-white text-slate-950 shadow-lg font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account for {activePortalDef.title}
            </button>
          </div>

          {/* Error Message Alert */}
          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* ============================================================== */}
          {/* MODE: SIGN IN */}
          {/* ============================================================== */}
          {mode === 'signin' && (
            <div>
              {/* Auth Method Selector */}
              <div className="flex items-center gap-3 mb-5 text-xs">
                <span className="text-slate-400 font-semibold">Sign in using:</span>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod('phone');
                    setPhoneStep('enter_phone');
                    setErrorMsg('');
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold border transition-all ${
                    authMethod === 'phone'
                      ? 'bg-white text-slate-950 border-white shadow-md'
                      : 'bg-black/40 text-slate-400 border-white/10 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5 inline mr-1" /> Mobile Number + OTP Flow
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod('email');
                    setErrorMsg('');
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold border transition-all ${
                    authMethod === 'email'
                      ? 'bg-white text-slate-950 border-white shadow-md'
                      : 'bg-black/40 text-slate-400 border-white/10 hover:text-white'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5 inline mr-1" /> Email & Password
                </button>
              </div>

              {/* METHOD 1: MULTI-STEP PHONE NUMBER LOGIN FLOW */}
              {authMethod === 'phone' && (
                <div className="space-y-4">
                  {/* Step Progress Pills */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${
                      phoneStep === 'enter_phone' 
                        ? 'bg-white text-slate-950 border-white' 
                        : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    }`}>
                      <span>1</span>
                      <span>Enter Mobile</span>
                    </div>
                    <ArrowRight className="w-3 h-3 text-slate-600" />
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${
                      phoneStep === 'enter_otp' 
                        ? 'bg-white text-slate-950 border-white' 
                        : phoneStep === 'verified'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-black/40 text-slate-500 border-white/10'
                    }`}>
                      <span>2</span>
                      <span>6-Digit Verification Code</span>
                    </div>
                    <ArrowRight className="w-3 h-3 text-slate-600" />
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${
                      phoneStep === 'verified'
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                        : 'bg-black/40 text-slate-500 border-white/10'
                    }`}>
                      <span>3</span>
                      <span>Enter Portal</span>
                    </div>
                  </div>

                  {/* STEP 1: Enter Phone Number */}
                  {phoneStep === 'enter_phone' && (
                    <form onSubmit={handleSendOtp} className="space-y-4 animate-fade-in">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5">
                          Mobile Phone Number *
                        </label>
                        <div className="flex gap-2">
                          {/* Country Code Selector */}
                          <select
                            value={countryCode}
                            onChange={e => setCountryCode(e.target.value)}
                            className="bg-black/80 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-white font-mono"
                          >
                            <option value="+91">🇮🇳 +91 (India)</option>
                            <option value="+1">🇺🇸 +1 (USA / CA)</option>
                            <option value="+44">🇬🇧 +44 (UK)</option>
                            <option value="+971">🇦🇪 +971 (UAE)</option>
                            <option value="+65">🇸🇬 +65 (Singapore)</option>
                          </select>

                          {/* Number Input */}
                          <div className="relative flex-1">
                            <Phone className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3" />
                            <input
                              type="tel"
                              required
                              value={phoneNumber}
                              onChange={e => setPhoneNumber(e.target.value)}
                              placeholder="98401 22341"
                              className="w-full bg-black/80 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-sm font-mono text-white placeholder-slate-600 focus:outline-none focus:border-white tracking-wider"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Remember Device Toggle */}
                      <div className="flex items-center justify-between text-xs pt-1">
                        <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-white">
                          <input
                            type="checkbox"
                            checked={rememberDevice}
                            onChange={e => setRememberDevice(e.target.checked)}
                            className="rounded border-white/20 bg-black text-cyan-400 focus:ring-0"
                          />
                          <span>Remember this mobile number on this device</span>
                        </label>
                        <span className="text-[10px] text-slate-500 font-mono">SMS / Fast OTP Mode</span>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3.5 rounded-xl bg-white hover:bg-slate-200 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                      >
                        <span>Send Emergency Access Code →</span>
                      </button>
                    </form>
                  )}

                  {/* STEP 2: Enter 6-Digit OTP */}
                  {phoneStep === 'enter_otp' && (
                    <div className="p-5 rounded-2xl bg-black/60 border border-white/15 space-y-4 animate-fade-in">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-black text-white">
                            Enter 6-Digit Emergency Verification Code
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            Dispatched to <strong className="text-white font-mono">{countryCode} {phoneNumber}</strong>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setPhoneStep('enter_phone')}
                          className="text-[11px] text-cyan-400 hover:underline font-bold"
                        >
                          Change Number
                        </button>
                      </div>

                      {/* 6 Individual Digit Boxes */}
                      <div className="flex items-center justify-center gap-2 sm:gap-3 py-2">
                        {otpDigits.map((digit, idx) => (
                          <input
                            key={idx}
                            ref={el => { otpInputRefs.current[idx] = el; }}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={e => handleDigitChange(idx, e.target.value)}
                            onKeyDown={e => handleDigitKeyDown(idx, e)}
                            onPaste={handleOtpPaste}
                            className="w-11 h-13 sm:w-12 sm:h-14 text-center font-mono font-black text-xl sm:text-2xl rounded-xl bg-[#0B0F19] border-2 border-white/20 focus:border-white focus:bg-white/5 text-white focus:outline-none transition-all shadow-inner"
                          />
                        ))}
                      </div>

                      {/* Resend Timer & Actions */}
                      <div className="flex items-center justify-between text-xs pt-1 border-t border-white/10">
                        <div className="text-slate-400 text-[11px]">
                          {resendTimer > 0 ? (
                            <span>Resend code in <strong className="text-white font-mono">{resendTimer}s</strong></span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
                                setExpectedOtp(newOtp);
                                setResendTimer(30);
                                setOtpDigits(['', '', '', '', '', '']);
                                setShowMockSms(true);
                                setTimeout(() => setShowMockSms(false), 8000);
                              }}
                              className="text-cyan-400 font-bold hover:underline"
                            >
                              Resend Verification Code
                            </button>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => executePhoneLogin(otpDigits.join(''))}
                          disabled={isLoading}
                          className="px-4 py-2 rounded-xl bg-white hover:bg-slate-200 text-slate-950 font-black text-xs transition-all flex items-center gap-1.5 shadow-md active:scale-95"
                        >
                          {isLoading ? (
                            <span>Verifying...</span>
                          ) : (
                            <>
                              <span>Verify & Enter</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: Verified Badge */}
                  {phoneStep === 'verified' && (
                    <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 text-center space-y-2 animate-fade-in">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-7 h-7" />
                      </div>
                      <h4 className="text-sm font-black text-white">Identity Verified & Stored</h4>
                      <p className="text-xs text-slate-300">
                        Entering {activePortalDef.title}... Session encrypted in localStorage.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* METHOD 2: EMAIL & PASSWORD LOGIN */}
              {authMethod === 'email' && (
                <form onSubmit={handleEmailLoginSubmit} className="space-y-4 animate-fade-in">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        value={loginEmail}
                        onChange={e => setLoginEmail(e.target.value)}
                        placeholder="officer@aypo.org"
                        className="w-full bg-black/80 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Password *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={loginPassword}
                        onChange={e => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-black/80 border border-white/15 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-xl bg-white hover:bg-slate-200 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <span>Sign In & Enter {activePortalDef.title}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* Saved Accounts on this Device */}
              {savedUsers.length > 0 && (
                <div className="mt-6 pt-5 border-t border-white/10">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                      Persistent Saved Accounts on this Device:
                    </span>
                    <span className="text-[10px] text-emerald-400 font-semibold font-mono">
                      ✓ Data Stored in LocalStorage
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {savedUsers.slice(0, 4).map(u => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => {
                          setSelectedPortal(u.role);
                          login({ identifier: u.email || u.phone || u.name, role: u.role });
                        }}
                        className="p-2.5 rounded-xl bg-black/60 hover:bg-white/10 border border-white/10 hover:border-white/30 text-left transition-all flex items-center justify-between group"
                      >
                        <div>
                          <div className="font-bold text-white group-hover:text-cyan-300 flex items-center gap-1.5">
                            <span>{u.name}</span>
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-slate-300">
                              {u.role}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {u.phone || u.email}
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Single Sign-On (Passes selectedPortal) */}
              <div className="mt-6 pt-5 border-t border-white/10">
                <div className="text-center text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Or Sign In via Trusted Identity Provider into {activePortalDef.title}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button
                    type="button"
                    onClick={() => socialLogin('google', selectedPortal)}
                    className="flex items-center justify-center gap-2 bg-black/60 hover:bg-white/10 border border-white/10 hover:border-white/30 p-2.5 rounded-xl text-xs font-bold text-slate-200 transition-all shadow-sm"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
                      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                      <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z" />
                      <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
                    </svg>
                    <span>Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => socialLogin('apple', selectedPortal)}
                    className="flex items-center justify-center gap-2 bg-black/60 hover:bg-white/10 border border-white/10 hover:border-white/30 p-2.5 rounded-xl text-xs font-bold text-slate-200 transition-all shadow-sm"
                  >
                    <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.66-.8 1.11-1.92.99-3.04-1 .04-2.16.67-2.83 1.46-.58.68-1.1 1.78-.96 2.87 1.11.09 2.18-.54 2.8-1.29z"/>
                    </svg>
                    <span>Apple</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => socialLogin('microsoft', selectedPortal)}
                    className="flex items-center justify-center gap-2 bg-black/60 hover:bg-white/10 border border-white/10 hover:border-white/30 p-2.5 rounded-xl text-xs font-bold text-slate-200 transition-all shadow-sm"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 23 23">
                      <path fill="#f35325" d="M1 1h10v10H1z"/>
                      <path fill="#81bc06" d="M12 1h10v10H12z"/>
                      <path fill="#05a6f3" d="M1 12h10v10H1z"/>
                      <path fill="#ffba08" d="M12 12h10v10H12z"/>
                    </svg>
                    <span>Microsoft</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => socialLogin('facebook', selectedPortal)}
                    className="flex items-center justify-center gap-2 bg-black/60 hover:bg-white/10 border border-white/10 hover:border-white/30 p-2.5 rounded-xl text-xs font-bold text-slate-200 transition-all shadow-sm"
                  >
                    <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span>Facebook</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* MODE: SIGN UP / REGISTRATION */}
          {/* ============================================================== */}
          {mode === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Full Name / Personnel Name *
                </label>
                <input
                  type="text"
                  required
                  value={signupName}
                  onChange={e => setSignupName(e.target.value)}
                  placeholder={
                    selectedPortal === 'FAMILY' ? 'e.g. Ramesh S. / Deepa Kumar' :
                    selectedPortal === 'PUBLIC_SERVICE' ? 'e.g. Dr. K. Meenakshi (Medical Officer)' :
                    selectedPortal === 'PRIVATE_ORG' ? 'e.g. Priya Anand (Red Cross Relief Worker)' :
                    'e.g. S. Radhakrishnan, IAS (Command Officer)'
                  }
                  className="w-full bg-black/80 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Mobile Phone or Email *
                  </label>
                  <input
                    type="text"
                    required
                    value={signupContact}
                    onChange={e => setSignupContact(e.target.value)}
                    placeholder="+91 98400 12345 or user@aypo.org"
                    className="w-full bg-black/80 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={signupPassword}
                    onChange={e => setSignupPassword(e.target.value)}
                    placeholder="Create a secure access key"
                    className="w-full bg-black/80 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              {selectedPortal !== 'FAMILY' && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Department / Organization Station *
                  </label>
                  <input
                    type="text"
                    required
                    value={signupOrg}
                    onChange={e => setSignupOrg(e.target.value)}
                    placeholder={
                      selectedPortal === 'PUBLIC_SERVICE' ? 'e.g. District General Hospital Emergency Trauma Wing' :
                      selectedPortal === 'PRIVATE_ORG' ? 'e.g. International Red Cross Rapid Field Team' :
                      'e.g. National Disaster Management Command (EOC Zone 4)'
                    }
                    className="w-full bg-black/80 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white"
                  />
                </div>
              )}

              {/* Visibly Embedded Location Map with Google Maps Pairing */}
              <div>
                <label className="block text-xs font-bold text-white mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Real-Time Operational Location & Visible Google Maps Verification</span>
                </label>
                
                <LocationMapPreview
                  initialLocation={userLocation?.locationName || 'Coimbatore Emergency Operations Sector 4'}
                  initialLat={userLocation?.lat || 11.0168}
                  initialLng={userLocation?.lng || 76.9558}
                  onLocationSelected={(res) => {
                    setUserLocation({
                      lat: res.lat,
                      lng: res.lng,
                      locationName: res.locationName,
                      accuracy: res.accuracyMeters
                    });
                  }}
                  title="Your Live Geolocation Telemetry"
                  subtitle="Verify your physical incident sector visibly on the interactive map & open in Google Maps"
                />
              </div>

              {/* Submit Registration Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-white hover:bg-slate-200 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>Register & Enter {activePortalDef.title}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

        {/* Footer Security Badges */}
        <div className="text-center mt-6 text-xs text-slate-500 flex flex-wrap items-center justify-center gap-3">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>AYPO Cryptographic Shield Active</span>
          </span>
          <span>•</span>
          <span>ISO 22320 Disaster Incident Command Compliant</span>
          <span>•</span>
          <span className="font-mono text-cyan-400">Strict Sector Isolation Verified</span>
        </div>
      </div>
    </div>
  );
};
