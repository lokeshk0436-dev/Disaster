import React from 'react';
import { useAypo } from '../../../context/AypoContext';
import { 
  Users, 
  Home, 
  HeartPulse, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  Copy, 
  Activity, 
  Clock, 
  TrendingUp,
  MapPin,
  CheckCircle2
} from 'lucide-react';

export const CommandOverview: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const { cases, shelters, hospitals, aiMatches } = useAypo();

  const totalMissing = cases.filter(c => c.status === 'REPORTED_MISSING' && !c.mergedIntoId).length;
  const totalFound = cases.filter(c => c.status !== 'REPORTED_MISSING' && c.status !== 'REUNITED' && !c.mergedIntoId).length;
  const totalReunited = cases.filter(c => c.status === 'REUNITED').length;
  const pendingVerification = cases.filter(c => c.verificationStatus === 'PENDING_VERIFICATION' && !c.mergedIntoId).length;
  const duplicateCandidates = cases.filter(c => c.duplicateCandidates.length > 0 && !c.mergedIntoId).length;

  return (
    <div className="space-y-6">
      {/* Top Incident Command Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/80 via-[#0D1B3E] to-slate-900 border border-indigo-500/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300">
              NATIONAL DISASTER MANAGEMENT COMMAND (NDMC) • EOC COIMBATORE
            </span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">Disaster Incident Command Dashboard</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Unified cross-sector situational awareness connecting police, disaster rescue squads, medical triage, and NGO relief operations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('verification')}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg transition-all"
          >
            Verification Center ({pendingVerification})
          </button>
          <button
            onClick={() => onNavigate('ai-matches')}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Matches ({aiMatches.length})</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">Total Missing</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-white mt-2">{totalMissing}</div>
          <div className="text-[11px] text-amber-400 mt-1">Active broadcast petitions</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">Sheltered / Rescued</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black text-cyan-400 mt-2">{totalFound}</div>
          <div className="text-[11px] text-slate-400 mt-1">In camps and medical wards</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">Reunited Families</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400 mt-2">{totalReunited}</div>
          <div className="text-[11px] text-emerald-400/90 mt-1">Confirmed & Verified</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">Pending Verification</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-black text-purple-400 mt-2">{pendingVerification}</div>
          <div className="text-[11px] text-slate-400 mt-1">Awaiting authority review</div>
        </div>
      </div>

      {/* Facilities & Operations Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Shelters & Logistics */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Home className="w-4 h-4 text-cyan-400" /> Active Relief Hubs ({shelters.length})
            </h3>
            <button onClick={() => onNavigate('map')} className="text-xs text-cyan-400 font-semibold">
              GIS Map
            </button>
          </div>

          <div className="space-y-3">
            {shelters.map(s => (
              <div key={s.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                <div className="flex items-center justify-between font-bold text-white">
                  <span>{s.name}</span>
                  <span className="text-cyan-400 font-mono">{s.occupancy}/{s.capacity}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${(s.occupancy/s.capacity)*100}%` }} />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                  <span>Water: <strong className="text-emerald-400">{s.waterStatus}</strong></span>
                  <span>Food: <strong className="text-emerald-400">{s.foodStatus}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center Column: Hospitals & Critical Beds */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-rose-400" /> Trauma Hospital Readiness
            </h3>
            <span className="text-xs text-slate-400">Triage Status</span>
          </div>

          <div className="space-y-3">
            {hospitals.map(h => (
              <div key={h.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                <div className="flex items-center justify-between font-bold text-white">
                  <span>{h.name}</span>
                  <span className="text-emerald-400">{h.triageBedsAvailable} Open Beds</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>ICU: <strong className="text-white">{h.icuBedsAvailable} available</strong></span>
                  <span>Blood Stock: <strong className="text-rose-400">{h.bloodStockStatus}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: AI & Duplicate Alerts */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" /> Intelligence Actions
            </h3>
            <span className="text-[10px] font-mono text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded">
              AUTOMATED
            </span>
          </div>

          <div className="space-y-2.5">
            <div
              onClick={() => onNavigate('ai-matches')}
              className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/40 cursor-pointer hover:bg-purple-950/50 transition-colors"
            >
              <div className="flex items-center justify-between font-bold text-xs text-purple-300">
                <span>AI Candidate Matches</span>
                <span>{aiMatches.length} Pending Review</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1">
                Raj Kumar matched with Rajkumar (Relief Centre 03) at 91% multi-factor confidence.
              </p>
            </div>

            <div
              onClick={() => onNavigate('duplicates')}
              className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/40 cursor-pointer hover:bg-amber-950/50 transition-colors"
            >
              <div className="flex items-center justify-between font-bold text-xs text-amber-300">
                <span>Duplicate Records Detected</span>
                <span>{duplicateCandidates} Potential Merges</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1">
                Cross-registry candidates detected across hospital & shelter intakes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
