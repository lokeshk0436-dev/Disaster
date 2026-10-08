import React from 'react';
import { useAypo } from '../../../context/AypoContext';
import { Home, Users, MapPin, UserPlus, FileSpreadsheet, CheckCircle } from 'lucide-react';

export const ShelterRosterView: React.FC<{ onOpenIntake: () => void }> = ({ onOpenIntake }) => {
  const { shelters, visibleCases, updateCaseStatus } = useAypo();

  const shelteredCases = visibleCases.filter(c => c.status === 'IN_SHELTER');

  return (
    <div className="space-y-6">
      {/* Shelter Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {shelters.map(s => (
          <div key={s.id} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-[10px] text-cyan-400 font-bold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                  {s.id}
                </span>
                <h3 className="text-base font-bold text-white mt-1">{s.name}</h3>
                <p className="text-xs text-slate-400">{s.sector}</p>
              </div>
              <span className="text-xs font-bold text-cyan-300">
                {s.occupancy} / {s.capacity}
              </span>
            </div>

            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-cyan-500 h-full rounded-full"
                style={{ width: `${(s.occupancy / s.capacity) * 100}%` }}
              />
            </div>

            <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
              <span>Water: <strong className="text-emerald-400">{s.waterStatus}</strong></span>
              <span>Food: <strong className="text-emerald-400">{s.foodStatus}</strong></span>
            </div>

            {/* Google Maps Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-800 text-xs">
              <a
                href={`https://www.google.com/maps?q=${s.lat},${s.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-center font-bold transition-colors flex items-center justify-center gap-1 text-[11px]"
              >
                <span>Google Maps</span>
                <span className="text-cyan-400">↗</span>
              </a>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-1.5 px-2 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 rounded-lg text-center font-bold transition-colors flex items-center justify-center gap-1 text-[11px]"
              >
                <span>Directions</span>
                <span className="text-cyan-400">→</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Roster Table */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" /> Active Shelter Evacuee Roster ({shelteredCases.length})
            </h3>
            <p className="text-xs text-slate-400">
              Field shelter residents registered with official AYPO identification
            </p>
          </div>
          <button
            onClick={onOpenIntake}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register Intake</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="p-3 rounded-l-xl">Person / ID</th>
                <th className="p-3">Age & Gender</th>
                <th className="p-3">Assigned Location</th>
                <th className="p-3">Triage Tag</th>
                <th className="p-3">Verification</th>
                <th className="p-3 rounded-r-xl text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {shelteredCases.map(person => (
                <tr key={person.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={person.photoUrl}
                        alt={person.personName}
                        className="w-8 h-8 rounded-lg object-cover"
                      />
                      <div>
                        <div className="font-bold text-white">{person.personName}</div>
                        <div className="font-mono text-[10px] text-cyan-400">{person.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-slate-300">
                    {person.age} yrs • {person.gender}
                  </td>
                  <td className="p-3 text-slate-300">
                    {person.currentLocation}
                  </td>
                  <td className="p-3">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-950 text-emerald-400 border border-slate-800">
                      {person.triageLevel || 'GREEN'}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="text-[10px] font-bold text-emerald-400">
                      {person.verificationStatus.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => updateCaseStatus(person.id, 'HOSPITALIZED', 'Coimbatore General Trauma Centre', 'Transferred for medical treatment')}
                      className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-[11px] font-bold border border-rose-500/40"
                    >
                      Transfer to Hospital
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
