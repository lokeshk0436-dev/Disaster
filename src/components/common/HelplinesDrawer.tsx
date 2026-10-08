import React, { useState } from 'react';
import { 
  Phone, 
  PhoneCall, 
  ShieldAlert, 
  X, 
  CheckCircle2, 
  Copy, 
  ExternalLink, 
  Ambulance, 
  Radio, 
  HeartHandshake, 
  AlertTriangle,
  Activity,
  Droplets,
  Home,
  Users
} from 'lucide-react';

interface Helpline {
  number: string;
  name: string;
  category: 'NATIONAL' | 'DISASTER' | 'MEDICAL' | 'PUBLIC';
  description: string;
  badge: string;
  available: string;
}

const HELPLINES: Helpline[] = [
  {
    number: '112',
    name: 'National Unified Emergency Response (NERS)',
    category: 'NATIONAL',
    description: 'Police, Fire, Ambulance, and Coast Guard unified emergency dispatch.',
    badge: 'CRITICAL SOS',
    available: '24/7 Toll-Free'
  },
  {
    number: '1078',
    name: 'NDRF Disaster Management Control Room',
    category: 'DISASTER',
    description: 'National Disaster Response Force tactical operations and boat/flood rescue.',
    badge: 'DISASTER RESCUE',
    available: '24/7 Priority'
  },
  {
    number: '108',
    name: 'Emergency Medical Services & Trauma Ambulance',
    category: 'MEDICAL',
    description: 'Trauma dispatch, emergency life support ambulances, and triage transport.',
    badge: 'MEDICAL EMS',
    available: '24/7 Immediate'
  },
  {
    number: '1070',
    name: 'State Disaster Management Authority (SEOC)',
    category: 'DISASTER',
    description: 'State Emergency Operations Centre central command and relief mobilization.',
    badge: 'STATE EOC',
    available: '24/7 Toll-Free'
  },
  {
    number: '1077',
    name: 'District Disaster Emergency Cell',
    category: 'DISASTER',
    description: 'District Collectorate emergency field relief and evacuation shelters desk.',
    badge: 'LOCAL SECTOR',
    available: '24/7 Dedicated'
  },
  {
    number: '104',
    name: 'Health Advice & Emergency Blood Bank Helpline',
    category: 'MEDICAL',
    description: 'Trauma blood group matching, emergency pharmaceuticals, and medical aid.',
    badge: 'BLOOD & MEDS',
    available: '24/7 Medical'
  },
  {
    number: '1098',
    name: 'Childline Emergency Protection',
    category: 'PUBLIC',
    description: 'Unaccompanied minors, separated children reunification, and emergency custody.',
    badge: 'CHILD SAFETY',
    available: '24/7 Protection'
  },
  {
    number: '1091',
    name: 'Women Disaster Safety & Crisis Line',
    category: 'PUBLIC',
    description: 'Dedicated crisis safety, trauma support, and vulnerable evacuee assistance.',
    badge: 'WOMEN CRISIS',
    available: '24/7 Dedicated'
  },
  {
    number: '+91 422 2301393',
    name: 'Coimbatore General Trauma Centre Triage Desk',
    category: 'MEDICAL',
    description: 'Direct emergency ward admission and patient identity verification desk.',
    badge: 'LOCAL HOSPITAL',
    available: 'Direct Line'
  },
  {
    number: '+91 422 2301982',
    name: 'Nehru Stadium Central Relief Hub Desk',
    category: 'DISASTER',
    description: 'On-site camp supervisor, lost person registrations, and family aid desk.',
    badge: 'SHELTER HUB',
    available: 'Field Line'
  }
];

export const HelplinesDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'NATIONAL' | 'DISASTER' | 'MEDICAL' | 'PUBLIC'>('ALL');

  if (!isOpen) return null;

  const handleCopy = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  const filteredHelplines = selectedCategory === 'ALL'
    ? HELPLINES
    : HELPLINES.filter(h => h.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in font-sans">
      <div className="w-full max-w-3xl bg-[#07090F] border border-white/15 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-slate-100">
        
        {/* Top Header */}
        <div className="p-5 bg-[#0C101A] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center font-bold shadow-lg">
              <PhoneCall className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  Emergency Helplines & Critical Contacts
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold uppercase">
                  24/7 TOLL-FREE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Official disaster response hotlines, NDRF tactical units, medical EMS, and local shelter desks
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900 border border-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Disaster Insights Banner */}
        <div className="bg-[#0B0F19] border-b border-white/10 p-4">
          <div className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold mb-2 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" />
            <span>REAL-TIME DISASTER SITUATION INSIGHTS • SECTOR 4</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="p-2.5 rounded-xl bg-black/60 border border-white/10">
              <span className="text-slate-400 text-[10px] block">Active Cyclone Alert</span>
              <strong className="text-rose-400 font-bold">Category-3 Vardah</strong>
              <div className="text-[9px] text-slate-500 mt-0.5">Wind 85km/h • High Rain</div>
            </div>

            <div className="p-2.5 rounded-xl bg-black/60 border border-white/10">
              <span className="text-slate-400 text-[10px] block">Hospital ICU Status</span>
              <strong className="text-emerald-400 font-bold">Optimal (31 Free)</strong>
              <div className="text-[9px] text-slate-500 mt-0.5">Trauma Units Standing By</div>
            </div>

            <div className="p-2.5 rounded-xl bg-black/60 border border-white/10">
              <span className="text-slate-400 text-[10px] block">Active Shelter Hubs</span>
              <strong className="text-cyan-400 font-bold">3 Operational</strong>
              <div className="text-[9px] text-slate-500 mt-0.5">Water & Food Adequate</div>
            </div>

            <div className="p-2.5 rounded-xl bg-black/60 border border-white/10">
              <span className="text-slate-400 text-[10px] block">Avg Response Time</span>
              <strong className="text-amber-400 font-bold">&lt; 14 Minutes</strong>
              <div className="text-[9px] text-slate-500 mt-0.5">NDRF Boat Units Active</div>
            </div>
          </div>
        </div>

        {/* Filter Category Tabs */}
        <div className="px-5 pt-3 pb-2 bg-[#07090F] border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto text-xs">
          {[
            { id: 'ALL', label: 'All Helplines' },
            { id: 'NATIONAL', label: '🚨 National Emergency' },
            { id: 'DISASTER', label: '🌪️ NDRF & Disaster' },
            { id: 'MEDICAL', label: '🚑 Medical & EMS' },
            { id: 'PUBLIC', label: '🛡️ Vulnerable & Public' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === tab.id
                  ? 'bg-white text-slate-950 font-black shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Helplines List */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredHelplines.map((h, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-[#0C101A] border border-white/10 hover:border-cyan-400/50 transition-all flex flex-col justify-between group shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-300">
                      {h.badge}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-medium">
                      ● {h.available}
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-white group-hover:text-cyan-200 transition-colors">
                    {h.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                    {h.description}
                  </p>
                </div>

                {/* Call & Copy Bar */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="text-base font-black font-mono text-white tracking-wider">
                    {h.number}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleCopy(h.number)}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs border border-slate-800 transition-colors flex items-center gap-1"
                      title="Copy phone number"
                    >
                      {copiedNumber === h.number ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span className="text-[10px]">{copiedNumber === h.number ? 'Copied' : 'Copy'}</span>
                    </button>

                    <a
                      href={`tel:${h.number.replace(/\s+/g, '')}`}
                      className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs transition-all flex items-center gap-1.5 shadow-md shadow-rose-600/30 active:scale-95"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Now</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#0A0D15] border-t border-white/10 text-center text-[11px] text-slate-400 flex items-center justify-center gap-2">
          <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
          <span>If lines are busy due to cellular traffic, SMS and offline mesh peer radios remain functional.</span>
        </div>
      </div>
    </div>
  );
};
