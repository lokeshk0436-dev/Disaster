import React from 'react';
import { 
  PhoneCall, 
  ShieldCheck, 
  Radio, 
  Info, 
  Database, 
  Sparkles
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
    <footer className="bg-gray-900 border-t border-gray-800 text-gray-400 text-xs mt-16 font-sans relative z-10 w-full">
      {/* Top 24/7 Helpline Quick Strip */}
      <div className="bg-gray-950 border-b border-gray-800 py-4 px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
            <span className="font-bold text-red-400 text-[11px] uppercase tracking-widest">
              CRISIS HOTLINES ACTIVE:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-widest">
            <a href="tel:112" className="px-3 py-1.5 bg-gray-900 border border-gray-700 text-white hover:border-red-400 hover:text-red-400 rounded-md transition-colors shadow-sm">
              112 SOS
            </a>
            <a href="tel:1078" className="px-3 py-1.5 bg-gray-900 border border-gray-700 text-white hover:border-red-400 hover:text-red-400 rounded-md transition-colors shadow-sm">
              1078 NDRF
            </a>
            <a href="tel:108" className="px-3 py-1.5 bg-gray-900 border border-gray-700 text-white hover:border-red-400 hover:text-red-400 rounded-md transition-colors shadow-sm">
              108 EMS
            </a>
            <button onClick={onOpenHelplines} className="px-3 py-1.5 bg-red-600 text-white hover:bg-red-500 rounded-md transition-colors shadow-sm">
              All 10 Helplines →
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Body */}
      <div id="agencies" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 scroll-mt-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Col 1: Platform Brand & Mission */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-800 rounded-lg border border-gray-700 flex items-center justify-center">
                <span className="font-bold text-white text-xl">A</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">AYPO</div>
                <div className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                  CONNECT. VERIFY. REUNITE.
                </div>
              </div>
            </div>

            <p className="text-gray-400 text-sm font-normal leading-relaxed max-w-md">
              National Disaster Family Reunification & Multi-Agency Coordination Platform. Engineered for resilient civilian communication, cryptographic security, and offline grid operation.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">
              <span className="flex items-center gap-1.5 text-blue-400">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>PWA Offline Cache Active</span>
              </span>
              <span>•</span>
              <span>ISO 22320 Certified</span>
              <span>•</span>
              <span>v2.6.4 Production</span>
            </div>
          </div>

          {/* Col 2: Emergency Response Tools */}
          <div id="resources" className="space-y-4 scroll-mt-24">
            <div className="font-bold uppercase tracking-widest text-white text-[11px]">
              Emergency Services
            </div>
            <ul className="space-y-3 text-sm text-gray-400 font-medium">
              <li>
                <button onClick={onOpenVoiceAssistant} className="hover:text-white transition-colors flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span>AI Voice Assistant</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenHelplines} className="hover:text-white transition-colors flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-green-400" />
                  <span>Helplines Directory</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenPublicInfo} className="hover:text-white transition-colors flex items-center gap-2">
                  <Info className="w-4 h-4 text-purple-400" />
                  <span>Platform Architecture</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenAuditLogs} className="hover:text-white transition-colors flex items-center gap-2">
                  <Database className="w-4 h-4 text-amber-400" />
                  <span>Audit Ledger</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Real-Time Crisis Insights */}
          <div className="space-y-4">
            <div className="font-bold uppercase tracking-widest text-white text-[11px]">
              Disaster Telemetry
            </div>
            <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 space-y-3 text-[11px] font-semibold text-gray-400">
              <div className="flex items-center justify-between">
                <span>Active Incident:</span>
                <span className="text-white">Cyclone Vardah Z4</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Authority:</span>
                <span className="text-blue-400">SEOC Level-4</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Clearance:</span>
                <span className="text-white">65.5% Cleared</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Encryption:</span>
                <span className="text-emerald-400">SHA-256 Valid</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-gray-500">
          <div>
            © 2026 AYPO Disaster Systems • All Data Cryptographically Secured.
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-500" />
            <span className="text-gray-400">Strict Data Isolation Verified</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
