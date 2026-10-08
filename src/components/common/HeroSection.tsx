import React from 'react';
import { 
  Users, 
  Search, 
  UserPlus, 
  ShieldCheck, 
  PhoneCall, 
  Sparkles, 
  MapPin, 
  Radio, 
  Activity, 
  AlertTriangle,
  ArrowRight,
  Heart,
  Home,
  Bed,
  CheckCircle2,
  Compass
} from 'lucide-react';

interface HeroSectionProps {
  onReportMissing: () => void;
  onOpenSearch: () => void;
  onOpenMap: () => void;
  onOpenHelplines: () => void;
  onOpenVoiceAssistant: () => void;
  totalMissing: number;
  totalFound: number;
  totalReunited: number;
  openBeds: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onReportMissing,
  onOpenSearch,
  onOpenMap,
  onOpenHelplines,
  onOpenVoiceAssistant,
  totalMissing,
  totalFound,
  totalReunited,
  openBeds
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#030508] border border-white/10 p-6 sm:p-8 lg:p-10 mb-8 shadow-2xl bg-animated-grid">
      {/* Ambient Radial Spotlight */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Directive Ticker */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10 text-xs">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
          </span>
          <span className="font-mono text-cyan-400 font-bold uppercase tracking-widest text-[11px]">
            INCIDENT COMMAND SECTOR 4 • ACTIVE CYCLONE RESPONSE
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="text-slate-300">Central Verification Ledger Live</span>
          </span>
          <span>•</span>
          <span className="text-cyan-300">Telemetry Fix: 11.0168°N, 76.9558°E</span>
        </div>
      </div>

      {/* Hero Headline & Mission */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/50 text-xs text-slate-300 backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold tracking-wide uppercase">Public Safety Infrastructure • Level-4 Certified</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] font-display">
            COORDINATE. <br />
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-300 to-white bg-clip-text text-transparent">
              SECURE. REUNITE.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-xl font-normal">
            Production-grade emergency coordination infrastructure engineered for state-level public safety, multi-agency intelligence fusion, and rapid civilian reunification.
          </p>

          {/* Core Emergency Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onReportMissing}
              className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl shadow-orange-500/25 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <UserPlus className="w-4 h-4 text-slate-950" />
              <span>Report Missing Person</span>
            </button>

            <button
              onClick={onOpenSearch}
              className="px-5 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Search className="w-4 h-4 text-slate-950" />
              <span>Search Registry</span>
            </button>

            <button
              onClick={onOpenVoiceAssistant}
              className="px-4 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 hover:border-slate-500 font-bold text-xs transition-all flex items-center gap-2 cursor-pointer active:scale-95 shadow-md"
              title="Speak with automated dispatch"
            >
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Voice Dispatch Terminal</span>
            </button>

            <button
              onClick={onOpenHelplines}
              className="px-4 py-3 rounded-2xl bg-rose-950/60 hover:bg-rose-900/60 text-rose-200 border border-rose-500/40 hover:border-rose-400 font-bold text-xs transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <PhoneCall className="w-4 h-4 text-rose-400 animate-pulse" />
              <span>Emergency 24/7 Helplines</span>
            </button>
          </div>
        </div>

        {/* Live Crisis Real-Time Metrics Grid */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-3">
          {/* Metric 1 */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0A0D15] border border-white/10 hover:border-cyan-400/40 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold">MISSING ALERTS</span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                {totalMissing}
              </div>
              <div className="text-[11px] text-amber-300 font-medium mt-0.5">
                Active search broadcasted
              </div>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0A0D15] border border-white/10 hover:border-emerald-400/40 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold">REUNIFIED</span>
              <Heart className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                {totalReunited}
              </div>
              <div className="text-[11px] text-emerald-300/90 font-medium mt-0.5">
                Families reunited safely
              </div>
            </div>
          </div>

          {/* Metric 3 */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0A0D15] border border-white/10 hover:border-blue-400/40 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold">FOUND / SHELTERED</span>
              <Home className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                {totalFound}
              </div>
              <div className="text-[11px] text-cyan-300 font-medium mt-0.5">
                Under care in shelters
              </div>
            </div>
          </div>

          {/* Metric 4 */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0A0D15] border border-white/10 hover:border-rose-400/40 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold">TRAUMA BEDS OPEN</span>
              <Bed className="w-4 h-4 text-rose-400" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-rose-400 font-mono">
                {openBeds}
              </div>
              <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                ICU & Triage units ready
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
