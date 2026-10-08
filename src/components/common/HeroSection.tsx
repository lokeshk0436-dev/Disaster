import React from 'react';
import { ShieldCheck, Search, PhoneCall, AlertTriangle, Sparkles, Activity } from 'lucide-react';

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
  totalMissing,
  totalFound,
  totalReunited,
  openBeds,
  onReportMissing,
  onOpenSearch,
  onOpenMap,
  onOpenHelplines,
  onOpenVoiceAssistant
}) => {
  return (
    <div id="dashboards" className="w-screen -ml-[50vw] left-1/2 relative flex flex-col items-center justify-center min-h-[85vh] mb-12 scroll-mt-24 bg-gray-900 overflow-hidden">
      
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-60 mix-blend-screen"
      >
        <source src="https://demo.awaikenthemes.com/assets/videos/artistic-video.mp4" type="video/mp4" />
      </video>

      {/* Gradient Overlay for Text Visibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950/80 via-gray-900/60 to-gray-50 z-10 pointer-events-none"></div>

      {/* Hero Content */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-6 flex flex-col items-center">
        
        {/* Emergency Broadcast Banner */}
        <div className="w-full max-w-3xl mb-8 bg-rose-500/10 border border-rose-500/30 rounded-2xl p-1 shadow-[0_0_25px_rgba(225,29,72,0.15)] animate-pulse">
          <div className="bg-rose-500/20 rounded-xl px-4 py-3 flex flex-col sm:flex-row items-center gap-3 backdrop-blur-md">
            <div className="bg-rose-500 text-white rounded-lg p-2 shadow-lg shadow-rose-500/30 flex-shrink-0">
              <AlertTriangle className="w-5 h-5 animate-bounce" />
            </div>
            <div className="text-left flex-1">
              <h3 className="text-rose-100 font-black text-sm uppercase tracking-wider">Priority Emergency Broadcast</h3>
              <p className="text-rose-200 text-sm font-medium">SEVERE CATEGORY 5 HURRICANE APPROACHING. Mandatory evacuation orders in effect for coastal zones. Please report all missing persons immediately.</p>
            </div>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-200 text-xs font-bold uppercase tracking-widest mb-6">
          <Activity className="w-4 h-4 animate-pulse" />
          Live Disaster Telemetry Active
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white mb-6 tracking-tight" style={{ textShadow: '0 4px 30px rgba(0,0,0,0.5)' }}>
          Innovative Solutions for <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Crisis Management</span>
        </h1>
        
        <p className="max-w-2xl text-lg sm:text-xl text-gray-200 mb-10 font-medium drop-shadow-md">
          A centralized, secure portal for family reunification, emergency coordination, and real-time resource tracking during critical disaster events.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-16 w-full">
          <button onClick={onReportMissing} className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Report Missing Person
          </button>
          <button onClick={onOpenSearch} className="px-8 py-3.5 bg-gray-900/50 hover:bg-gray-800/80 backdrop-blur-md border border-gray-600 text-white rounded-xl font-bold text-sm shadow-xl transition-all flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search Database
          </button>
          <button onClick={onOpenVoiceAssistant} className="px-6 py-3.5 bg-gray-900/50 hover:bg-gray-800/80 backdrop-blur-md border border-gray-600 text-white rounded-xl font-bold text-sm shadow-xl transition-all flex items-center gap-2 group">
            <Sparkles className="w-5 h-5 text-amber-400 group-hover:animate-pulse" />
            AI Voice Help
          </button>
        </div>

        {/* Live Stats Glass Bar */}
        <div className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl">
          <div className="flex flex-col items-center justify-center p-2">
            <div className="text-4xl font-black text-amber-400 mb-1 drop-shadow-md">{totalMissing}</div>
            <div className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Reported Missing</div>
          </div>
          <div className="flex flex-col items-center justify-center p-2 border-l border-white/10">
            <div className="text-4xl font-black text-blue-400 mb-1 drop-shadow-md">{totalFound}</div>
            <div className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Safely Located</div>
          </div>
          <div className="flex flex-col items-center justify-center p-2 border-l border-white/10">
            <div className="text-4xl font-black text-emerald-400 mb-1 drop-shadow-md">{totalReunited}</div>
            <div className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Reunited</div>
          </div>
          <div className="flex flex-col items-center justify-center p-2 border-l border-white/10">
            <div className="text-4xl font-black text-white mb-1 drop-shadow-md">{openBeds}</div>
            <div className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Open Beds</div>
          </div>
        </div>

      </div>
    </div>
  );
};
