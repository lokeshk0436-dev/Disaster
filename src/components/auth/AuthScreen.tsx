import React, { useState } from 'react';
import { useAypo } from '../../context/AypoContext';
import { UserRole } from '../../types';
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
  KeyRound
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

  // Selected Target Portal (Default to Family)
  const [selectedPortal, setSelectedPortal] = useState<UserRole>('FAMILY');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');

  // Sign In Form State
  const activePortalDef = PORTALS.find(p => p.role === selectedPortal) || PORTALS[0];
  const [loginIdentifier, setLoginIdentifier] = useState(activePortalDef.defaultIdentifier);
  const [loginPassword, setLoginPassword] = useState('aypo2026');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('748291');
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

  // Switch Portal Selection
  const handleSelectPortal = (role: UserRole) => {
    setSelectedPortal(role);
    setErrorMsg('');
    const targetDef = PORTALS.find(p => p.role === role) || PORTALS[0];
    setLoginIdentifier(targetDef.defaultIdentifier);
    setOtpSent(false);
  };

  // Sign In Handler
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      if (authMethod === 'phone' && !otpSent) {
        setOtpSent(true);
        setIsLoading(false);
        return;
      }

      await login({
        identifier: loginIdentifier.trim(),
        password: loginPassword,
        role: selectedPortal,
        authProvider: authMethod
      });
    } catch (err: any) {
      setErrorMsg('Authentication failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Sign Up Handler
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName.trim() || !signupContact.trim()) {
      setErrorMsg('Please provide your name and contact details.');
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
      setErrorMsg('Registration failed. Please check your details.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fast One-Click Official Login
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
    <div className="min-h-screen bg-[#070D1E] text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Background Decorative Blur Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-900/5 rounded-full blur-[180px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-4xl my-6">
        
        {/* Institutional Platform Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-blue-600/30 to-indigo-600/20 border border-cyan-400/40 shadow-xl shadow-cyan-500/20 mb-3 backdrop-blur-md">
            <img src="/aypo-logo.svg" alt="AYPO" className="w-8 h-8 sm:w-10 sm:h-10 object-contain drop-shadow" />
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
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
              <div className="text-xs font-black text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
                <span>STEP 1: SELECT YOUR OPERATIONAL PORTAL</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Choose your designated authority. You will enter solely this portal — remaining 3 portals will be completely hidden.
              </p>
            </div>
            <span className="hidden sm:inline-block text-[10px] font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800">
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
                      ? `bg-slate-900/90 ${portal.borderColor} ring-2 ring-cyan-400/50 shadow-xl ${portal.glowColor} -translate-y-0.5`
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/50'
                  }`}
                >
                  {/* Top Bar with Icon and Badge */}
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${portal.accentColor} flex items-center justify-center text-slate-950 font-black shadow-md`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      
                      {isSelected ? (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500 text-slate-950 font-black text-[9px] uppercase tracking-wide">
                          <CheckCircle2 className="w-3 h-3" />
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

                  {/* Footnote */}
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                    <span className="text-slate-500">Access Mode</span>
                    <span className={`font-bold ${isSelected ? 'text-cyan-300 font-mono' : 'text-slate-400'}`}>
                      {isSelected ? 'Direct Route →' : 'Click to Select'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 2: AUTHENTICATION GATEWAY CARD */}
        <div className="bg-slate-900/70 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/50">
          
          {/* Active Portal Target Announcement Banner */}
          <div className="mb-6 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${activePortalDef.accentColor} flex items-center justify-center text-slate-950 font-black shadow-lg flex-shrink-0`}>
                <activePortalDef.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                  <span>ENTERING PORTAL: {activePortalDef.title.toUpperCase()}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                </div>
                <div className="text-xs text-slate-300 mt-0.5">
                  Clearance Protocol: <strong className="text-white">{activePortalDef.clearance}</strong> • Sector Isolation Enforced
                </div>
              </div>
            </div>

            {/* Quick Fast-Access Button */}
            <button
              type="button"
              onClick={handleFastOfficialLogin}
              disabled={isLoading}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap active:scale-95"
              title="Instant official credentials login for this portal"
            >
              <KeyRound className="w-3.5 h-3.5 text-slate-950" />
              <span>Fast 1-Click Official Access</span>
            </button>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex bg-slate-950/90 p-1.5 rounded-2xl border border-slate-800 mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMsg('');
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${
                mode === 'signin'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
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
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account for {activePortalDef.title}
            </button>
          </div>

          {/* Error Message Alert */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
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
              <div className="flex items-center gap-3 mb-4 text-xs">
                <span className="text-slate-400 font-semibold">Sign in using:</span>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod('phone');
                    setLoginIdentifier(activePortalDef.defaultIdentifier.startsWith('+') ? activePortalDef.defaultIdentifier : '+91 98401 22341');
                    setOtpSent(false);
                  }}
                  className={`px-3 py-1 rounded-lg font-bold border transition-all ${
                    authMethod === 'phone'
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                      : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  <Phone className="w-3 h-3 inline mr-1" /> Mobile Number + OTP
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod('email');
                    setLoginIdentifier(activePortalDef.defaultIdentifier.includes('@') ? activePortalDef.defaultIdentifier : 'officer@aypo.org');
                  }}
                  className={`px-3 py-1 rounded-lg font-bold border transition-all ${
                    authMethod === 'email'
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                      : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  <Mail className="w-3 h-3 inline mr-1" /> Email & Password
                </button>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {authMethod === 'phone' ? (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Mobile Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3" />
                        <input
                          type="tel"
                          required
                          value={loginIdentifier}
                          onChange={e => setLoginIdentifier(e.target.value)}
                          placeholder="+91 98401 22341"
                          className="w-full bg-slate-950/80 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                        />
                      </div>
                    </div>

                    {otpSent && (
                      <div className="p-3 bg-cyan-950/40 border border-cyan-500/30 rounded-xl animate-fade-in">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-bold text-cyan-300">Enter 6-digit Emergency OTP</span>
                          <span className="text-[10px] text-emerald-400 font-mono">Dispatched to mobile</span>
                        </div>
                        <input
                          type="text"
                          maxLength={6}
                          value={otpCode}
                          onChange={e => setOtpCode(e.target.value)}
                          className="w-full tracking-[0.5em] text-center font-mono font-bold text-lg bg-slate-950 border border-cyan-500/60 rounded-lg py-2 text-white focus:outline-none focus:border-cyan-300"
                        />
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                    >
                      {otpSent ? (
                        <>
                          <span>Verify OTP & Enter {activePortalDef.title}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          <span>Send Emergency Access OTP</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Authorized Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3" />
                        <input
                          type="email"
                          required
                          value={loginIdentifier}
                          onChange={e => setLoginIdentifier(e.target.value)}
                          placeholder="officer@aypo.org"
                          className="w-full bg-slate-950/80 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
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
                          className="w-full bg-slate-950/80 border border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
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
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                    >
                      <span>Sign In & Enter {activePortalDef.title}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </form>

              {/* Social Single Sign-On (Explicitly routes to selected portal) */}
              <div className="mt-6 pt-5 border-t border-slate-800">
                <div className="text-center text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Or Sign In via Trusted Identity Provider into {activePortalDef.title}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {/* Google */}
                  <button
                    type="button"
                    onClick={() => socialLogin('google', selectedPortal)}
                    className="flex items-center justify-center gap-2 bg-slate-950/70 hover:bg-slate-800 border border-slate-800 hover:border-slate-600 p-2.5 rounded-xl text-xs font-bold text-slate-200 transition-all shadow-sm"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
                      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                      <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z" />
                      <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
                    </svg>
                    <span>Google</span>
                  </button>

                  {/* Apple */}
                  <button
                    type="button"
                    onClick={() => socialLogin('apple', selectedPortal)}
                    className="flex items-center justify-center gap-2 bg-slate-950/70 hover:bg-slate-800 border border-slate-800 hover:border-slate-600 p-2.5 rounded-xl text-xs font-bold text-slate-200 transition-all shadow-sm"
                  >
                    <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.66-.8 1.11-1.92.99-3.04-1 .04-2.16.67-2.83 1.46-.58.68-1.1 1.78-.96 2.87 1.11.09 2.18-.54 2.8-1.29z"/>
                    </svg>
                    <span>Apple</span>
                  </button>

                  {/* Microsoft */}
                  <button
                    type="button"
                    onClick={() => socialLogin('microsoft', selectedPortal)}
                    className="flex items-center justify-center gap-2 bg-slate-950/70 hover:bg-slate-800 border border-slate-800 hover:border-slate-600 p-2.5 rounded-xl text-xs font-bold text-slate-200 transition-all shadow-sm"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 23 23">
                      <path fill="#f35325" d="M1 1h10v10H1z"/>
                      <path fill="#81bc06" d="M12 1h10v10H12z"/>
                      <path fill="#05a6f3" d="M1 12h10v10H1z"/>
                      <path fill="#ffba08" d="M12 12h10v10H12z"/>
                    </svg>
                    <span>Microsoft</span>
                  </button>

                  {/* Facebook */}
                  <button
                    type="button"
                    onClick={() => socialLogin('facebook', selectedPortal)}
                    className="flex items-center justify-center gap-2 bg-slate-950/70 hover:bg-slate-800 border border-slate-800 hover:border-slate-600 p-2.5 rounded-xl text-xs font-bold text-slate-200 transition-all shadow-sm"
                  >
                    <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span>Facebook</span>
                  </button>
                </div>
              </div>

              {/* Pre-configured Official Profile Shortcut */}
              <div className="mt-5 p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400">Designated Test Officer: </span>
                  <strong className="text-white font-semibold">{activePortalDef.defaultOfficer}</strong>
                  <div className="text-[10px] text-slate-500">{activePortalDef.defaultOrg}</div>
                </div>
                <button
                  type="button"
                  onClick={handleFastOfficialLogin}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-[11px] border border-slate-700 transition-colors"
                >
                  Quick Enter →
                </button>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* MODE: SIGN UP / REGISTRATION */}
          {/* ============================================================== */}
          {mode === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
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
                  className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
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
                    className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
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
                    className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
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
                    className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              )}

              {/* Visibly Embedded Location Map with Google Maps Pairing */}
              <div>
                <label className="block text-xs font-bold text-cyan-300 mb-1.5 flex items-center gap-1.5">
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
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>Register & Enter {activePortalDef.title}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Social Registration */}
              <div className="pt-4 border-t border-slate-800 text-center">
                <span className="text-[11px] text-slate-400 font-semibold">Or quickly register with trusted identity:</span>
                <div className="flex items-center justify-center gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => socialLogin('google', selectedPortal)}
                    className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-600 text-xs font-bold flex items-center gap-1.5 text-slate-300"
                  >
                    Google
                  </button>
                  <button
                    type="button"
                    onClick={() => socialLogin('apple', selectedPortal)}
                    className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-600 text-xs font-bold flex items-center gap-1.5 text-slate-300"
                  >
                    Apple
                  </button>
                  <button
                    type="button"
                    onClick={() => socialLogin('microsoft', selectedPortal)}
                    className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-600 text-xs font-bold flex items-center gap-1.5 text-slate-300"
                  >
                    Microsoft
                  </button>
                  <button
                    type="button"
                    onClick={() => socialLogin('facebook', selectedPortal)}
                    className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-600 text-xs font-bold flex items-center gap-1.5 text-slate-300"
                  >
                    Facebook
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer Security Badges */}
        <div className="text-center mt-6 text-xs text-slate-500 flex flex-wrap items-center justify-center gap-3">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
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
