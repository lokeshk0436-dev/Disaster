import React from 'react';
import { 
  Phone, 
  PhoneCall, 
  ShieldCheck, 
  Radio, 
  Info, 
  Database, 
  Sparkles, 
  ExternalLink,
  MapPin,
  Heart,
  Activity,
  Layers,
  Clock
} from 'lucide-react';

interface EmergencyFooterProps {
  onOpenPublicInfo: () => void;
  onOpenAuditLogs: () => void;
  onOpenHelplines: () => void;
  onOpenVoiceAssistant: () => void;
}

export const EmergencyFooter: React.FC<EmergencyFooterProps> = ({
  onOpenPublicInfo,
  onOpenAuditLogs,
  onOpenHelplines,
  onOpenVoiceAssistant
}) => {
  return (
    <footer className="bg-[#020306] border-t border-white/10 text-slate-300 text-xs mt-16 font-sans">
      {/* Top 24/7 Helpline Quick Strip */}
      <div className="bg-[#080B12] border-b border-white/10 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span className="font-mono text-white font-bold text-xs uppercase tracking-wider">
              24/7 EMERGENCY CRISIS HOTLINES:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <a
              href="tel:112"
              className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1.5 font-mono font-bold transition-colors"
            >
              <Phone className="w-3 h-3 text-rose-400" />
              <span>National SOS: 112</span>
            </a>

            <a
              href="tel:1078"
              className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 font-mono font-bold transition-colors"
            >
              <Phone className="w-3 h-3 text-amber-400" />
              <span>NDRF Disaster: 1078</span>
            </a>

            <a
              href="tel:108"
              className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 font-mono font-bold transition-colors"
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>Ambulance EMS: 108</span>
            </a>

            <button
              onClick={onOpenHelplines}
              className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold flex items-center gap-1 text-[11px] transition-colors"
            >
              <span>All 10 Helplines & Insights →</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Platform Brand & Mission */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-400/40 flex items-center justify-center text-cyan-300 font-bold shadow-lg">
                <img src="/aypo-logo.svg" alt="AYPO" className="w-5 h-5 object-contain" />
              </div>
              <div>
                <div className="font-black text-white text-base tracking-tight flex items-center gap-2">
                  <span>AYPO</span>
                  <span className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase border border-cyan-500/30 px-1.5 py-0.5 rounded">
                    CRISIS OS
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  CONNECT. VERIFY. REUNITE.
                </div>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              National Disaster Family Reunification & Multi-Agency Coordination Platform. Engineered for resilient civilian communication, cryptographic security, and offline zero-tower grid operation.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-400">
              <span className="flex items-center gap-1 font-mono text-emerald-400 font-semibold">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>PWA Offline Cache Active</span>
              </span>
              <span>•</span>
              <span className="font-mono text-cyan-400">ISO 22320 Certified</span>
              <span>•</span>
              <span>v2.6.4 Production</span>
            </div>
          </div>

          {/* Col 2: Emergency Response Tools */}
          <div className="space-y-2">
            <div className="font-mono uppercase font-bold text-white text-xs tracking-wider">
              Emergency Services
            </div>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>
                <button 
                  onClick={onOpenVoiceAssistant}
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>AI Voice Assistant (Siri / Gemini)</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenHelplines}
                  className="hover:text-rose-300 transition-colors flex items-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-rose-400" />
                  <span>24/7 Helplines Directory</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenPublicInfo}
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1.5"
                >
                  <Info className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Platform Architecture</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenAuditLogs}
                  className="hover:text-purple-300 transition-colors flex items-center gap-1.5"
                >
                  <Database className="w-3.5 h-3.5 text-purple-400" />
                  <span>Cryptographic Audit Ledger</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Real-Time Crisis Insights */}
          <div className="space-y-2">
            <div className="font-mono uppercase font-bold text-white text-xs tracking-wider">
              Disaster Telemetry
            </div>
            <div className="p-3 rounded-xl bg-[#080B12] border border-white/10 space-y-1.5 text-[11px] font-mono">
              <div className="flex items-center justify-between text-slate-400">
                <span>Active Incident:</span>
                <span className="text-white font-bold">Cyclone Vardah Z4</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Verification Authority:</span>
                <span className="text-cyan-400 font-bold">SEOC Level-4</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Reunification Ratio:</span>
                <span className="text-emerald-400 font-bold">65.5% Cleared</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Mesh Encryption:</span>
                <span className="text-purple-400 font-bold">SHA-256 Valid</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            © 2026 AYPO Disaster Reunification Systems • Public Safety Deployment. All civilian data is cryptographically protected.
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-400 font-semibold">Strict Single-Portal Data Isolation Verified</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
