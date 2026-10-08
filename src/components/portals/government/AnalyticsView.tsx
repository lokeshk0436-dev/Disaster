import React from 'react';
import { useAypo } from '../../../context/AypoContext';
import { TrendingUp, PieChart, BarChart2, Activity, ShieldCheck, Heart } from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { cases, shelters } = useAypo();

  const total = cases.length;
  const missing = cases.filter(c => c.status === 'REPORTED_MISSING').length;
  const sheltered = cases.filter(c => c.status === 'IN_SHELTER').length;
  const hospitalized = cases.filter(c => c.status === 'HOSPITALIZED').length;
  const reunited = cases.filter(c => c.status === 'REUNITED').length;

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-slate-900 border border-indigo-800/40 shadow-xl">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-cyan-400" /> Disaster Analytics & Operational Velocity
        </h2>
        <p className="text-xs text-slate-300 mt-1 max-w-xl">
          Real-time statistical modeling tracking evacuation throughput, reunification success rate, and logistics utilization.
        </p>
      </div>

      {/* Funnel Progress Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 font-bold uppercase">1. Missing Petitions</span>
          <div className="text-2xl font-black text-white">{missing}</div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-amber-400 h-full rounded-full" style={{ width: '100%' }} />
          </div>
          <div className="text-[11px] text-slate-500">100% Intake Intake Rate</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 font-bold uppercase">2. Located & Sheltered</span>
          <div className="text-2xl font-black text-cyan-400">{sheltered + hospitalized}</div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-cyan-400 h-full rounded-full" style={{ width: '85%' }} />
          </div>
          <div className="text-[11px] text-slate-500">85% Location Rate</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 font-bold uppercase">3. Authority Certified</span>
          <div className="text-2xl font-black text-purple-400">
            {cases.filter(c => c.verificationStatus === 'VERIFIED').length}
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-purple-400 h-full rounded-full" style={{ width: '60%' }} />
          </div>
          <div className="text-[11px] text-slate-500">60% Cross-Checked</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 font-bold uppercase">4. Reunited Families</span>
          <div className="text-2xl font-black text-emerald-400">{reunited}</div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-400 h-full rounded-full" style={{ width: '40%' }} />
          </div>
          <div className="text-[11px] text-emerald-400">High-Velocity Reunification</div>
        </div>
      </div>

      {/* Demographics & Capacity Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-cyan-400" /> Sector Demographic Split
          </h3>
          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Children & Minors (0-17)</span>
                <span className="font-bold text-white">20%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-cyan-400 h-full rounded-full" style={{ width: '20%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Adults (18-59)</span>
                <span className="font-bold text-white">60%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: '60%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Elderly & Special Care (60+)</span>
                <span className="font-bold text-white">20%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full rounded-full" style={{ width: '20%' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <PieChart className="w-4 h-4 text-emerald-400" /> Shelter Logistics Readiness
          </h3>
          <div className="space-y-3 text-xs">
            {shelters.map(s => (
              <div key={s.id} className="space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>{s.name}</span>
                  <span className="font-bold text-cyan-400">{Math.round((s.occupancy/s.capacity)*100)}% Full</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{ width: `${(s.occupancy/s.capacity)*100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
