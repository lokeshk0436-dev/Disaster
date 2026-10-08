import React from 'react';
import { 
  X, 
  ShieldCheck, 
  WifiOff, 
  Sparkles, 
  Radio, 
  Heart, 
  MapPin, 
  Building2, 
  PhoneCall, 
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export const PublicInfoModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0A1226] border border-cyan-500/40 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center">
              <img src="/aypo-logo.svg" alt="AYPO Logo" className="w-6 h-6 object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-white">AYPO</span>
                <span className="text-[10px] uppercase font-bold text-cyan-400 border border-cyan-500/30 px-1.5 py-0.5 rounded">
                  System Architecture
                </span>
              </div>
              <div className="text-xs font-bold text-slate-400">
                CONNECT. VERIFY. REUNITE.
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300 flex-1 leading-relaxed">
          {/* Mission Pitch */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/40 to-blue-950/40 border border-cyan-500/30">
            <h3 className="text-sm font-black text-white uppercase tracking-wider mb-1 text-cyan-300">
              The AYPO Mission
            </h3>
            <p className="text-sm text-slate-200 leading-relaxed font-medium">
              "Disasters don't just destroy infrastructure — they break communication between people. AYPO creates one trusted reunification layer connecting families, rescue teams, public services, private organizations, and authorities. Even when connectivity fails, AYPO continues collecting information offline and synchronizes it when communication returns."
            </p>
          </div>

          {/* How AYPO Works Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-white tracking-wider">
              How AYPO Solves Family Reunification in 4 Pillars:
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-cyan-300">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>1. Unified Platform, 4 Portals</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Right Data → Right Organization → Right User. Strict data isolation prevents families from seeing sensitive medical notes, while granting authorities cross-sector verification tools.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-rose-300">
                  <WifiOff className="w-4 h-4 text-rose-400" />
                  <span>2. Offline-First Operation</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  When mobile towers and power grids fail, rescue workers continue recording survivors in local IndexedDB queues with auto-assigned AYPO Case IDs. Automatic synchronization triggers upon uplink.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-purple-300">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>3. Responsible AI Matching</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Deterministic multi-attribute algorithm compares phonetic name similarity, age tolerance, gender concordance, physical markers, and sector distance to present verified match scores (e.g. 91%).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-emerald-300">
                  <Heart className="w-4 h-4 text-emerald-400" />
                  <span>4. Authority-Certified Reunification</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  AI never declares reunification automatically. Government Incident Command reviews supporting evidence, certifies identity, and only then triggers verified notifications to separated families.
                </p>
              </div>
            </div>
          </div>

          {/* Future Expansions Roadmap */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-400" /> Future Technological Expansion Roadmap:
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] font-mono text-slate-300">
              <div className="p-2 rounded bg-slate-950 border border-slate-800">✓ LoRa / LoRaWAN Mesh</div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">✓ Bluetooth D2D Sync</div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">✓ Satellite / NTN Fallback</div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">✓ Offline Facial Biometrics</div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">✓ Multi-Language Voice SOS</div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">✓ Drone GIS Heatmapping</div>
            </div>
          </div>

          {/* Emergency Hotlines */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-white">Disaster Emergency Helpline</div>
                <div className="text-slate-400 text-[11px]">National Disaster Response Force (NDRF): 1078 | Medical: 108</div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
            >
              Enter AYPO Platform
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
