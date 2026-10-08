import React from 'react';
import { useAypo } from '../../../context/AypoContext';
import { HeartPulse, Activity, AlertCircle, Bed, Phone, ShieldCheck, UserCheck } from 'lucide-react';

export const HospitalBedsView: React.FC = () => {
  const { hospitals, visibleCases, updateCaseStatus } = useAypo();

  const admittedPatients = visibleCases.filter(c => c.status === 'HOSPITALIZED');

  return (
    <div className="space-y-6">
      {/* Triage summary banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hospitals.map(h => (
          <div key={h.id} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-xs text-rose-400 font-bold bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800">
                  {h.id}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">{h.name}</h3>
                <p className="text-xs text-slate-400">{h.location}</p>
              </div>
              <div className="text-right">
                <div className="text-xl font-black text-emerald-400">{h.triageBedsAvailable}</div>
                <div className="text-[10px] text-slate-400 font-medium">Beds Available of {h.triageBedsTotal}</div>
              </div>
            </div>

            {/* Bed capacity bar */}
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-rose-500 h-full rounded-full"
                style={{ width: `${((h.triageBedsTotal - h.triageBedsAvailable) / h.triageBedsTotal) * 100}%` }}
              />
            </div>

            <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
              <div>
                <span className="text-slate-500 block text-[9px]">ICU BEDS</span>
                <strong className="text-white text-xs">{h.icuBedsAvailable}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px]">BLOOD STOCK</span>
                <strong className="text-rose-400 text-xs">{h.bloodStockStatus}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px]">SURGEONS</span>
                <strong className="text-emerald-400 text-xs">{h.traumaSurgeonsOnDuty} on duty</strong>
              </div>
            </div>

            {/* Google Maps Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-800 text-xs">
              <a
                href={`https://www.google.com/maps?q=${h.lat},${h.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-center font-bold transition-colors flex items-center justify-center gap-1 text-[11px]"
              >
                <span>Google Maps</span>
                <span className="text-rose-400">↗</span>
              </a>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-1.5 px-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 rounded-lg text-center font-bold transition-colors flex items-center justify-center gap-1 text-[11px]"
              >
                <span>Ambulance Route</span>
                <span className="text-rose-400">→</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Admitted Patients List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-rose-400" /> Currently Hospitalized Patients ({admittedPatients.length})
          </h3>
          <span className="text-xs text-slate-400">Public Service Triage View</span>
        </div>

        <div className="space-y-3">
          {admittedPatients.map(p => (
            <div
              key={p.id}
              className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <img
                  src={p.photoUrl}
                  alt={p.personName}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{p.personName}</span>
                    <span className="font-mono text-[10px] text-cyan-400 font-bold">{p.id}</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                      p.triageLevel === 'RED' ? 'bg-rose-500/20 text-rose-400' :
                      p.triageLevel === 'YELLOW' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {p.triageLevel} TRIAGE
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {p.age} yrs • {p.gender} • Location: <strong className="text-slate-300">{p.currentLocation}</strong>
                  </div>
                  {p.medicalNotes && (
                    <div className="text-xs text-rose-300/90 mt-1 font-mono">
                      Medical Chart: {p.medicalNotes}
                    </div>
                  )}
                </div>
              </div>

              {/* Patient Transfer/Discharge Actions */}
              <div className="flex items-center gap-2 w-full md:w-auto">
                <button
                  onClick={() => updateCaseStatus(p.id, 'IN_SHELTER', 'Relief Centre 03', 'Discharged from hospital, relocated to Relief Centre 03')}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
                >
                  Discharge to Shelter
                </button>
                <button
                  onClick={() => updateCaseStatus(p.id, 'TRANSFERRED', 'Apollo Disaster Emergency Facility', 'Transferred to secondary surgical specialty unit')}
                  className="px-3 py-1.5 rounded-xl bg-blue-600/80 hover:bg-blue-600 text-white text-xs font-semibold"
                >
                  Transfer Facility
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
