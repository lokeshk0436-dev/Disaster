import React, { useState } from 'react';
import { useAypo } from '../../../context/AypoContext';
import { VerificationStatus } from '../../../types';
import { ShieldCheck, ShieldAlert, CheckCircle, XCircle, AlertTriangle, FileText, Send, User } from 'lucide-react';

export const VerificationCenter: React.FC = () => {
  const { cases, verifyCase, currentUser } = useAypo();
  const [activeFilter, setActiveFilter] = useState<'PENDING' | 'UNVERIFIED' | 'VERIFIED' | 'ALL'>('PENDING');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [decisionNote, setDecisionNote] = useState('');

  const filteredCases = cases.filter(c => {
    if (activeFilter === 'PENDING') return c.verificationStatus === 'PENDING_VERIFICATION' && !c.mergedIntoId;
    if (activeFilter === 'UNVERIFIED') return c.verificationStatus === 'UNVERIFIED' && !c.mergedIntoId;
    if (activeFilter === 'VERIFIED') return c.verificationStatus === 'VERIFIED' && !c.mergedIntoId;
    return !c.mergedIntoId;
  });

  const selectedCase = cases.find(c => c.id === selectedCaseId) || filteredCases[0];

  const handleExecuteVerification = async (decision: VerificationStatus) => {
    if (!selectedCase) return;
    await verifyCase(
      selectedCase.id,
      decision,
      decisionNote.trim() || `Verified by Incident Commander ${currentUser.name}`
    );
    setDecisionNote('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-slate-900 border border-indigo-800/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" /> Government Verification Center
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Human-in-the-loop official certification desk. Cases must be officially verified here before high-confidence family notifications are dispatched.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          {[
            { id: 'PENDING', label: 'Pending Review' },
            { id: 'UNVERIFIED', label: 'Unverified' },
            { id: 'VERIFIED', label: 'Certified' },
            { id: 'ALL', label: 'All Cases' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id as any)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeFilter === f.id
                  ? 'bg-cyan-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Review Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left List of Pending Cases */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 max-h-[600px] overflow-y-auto">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Dossiers Requiring Adjudication ({filteredCases.length})
          </div>

          {filteredCases.map(c => {
            const isSelected = selectedCase?.id === c.id;
            return (
              <div
                key={c.id}
                onClick={() => setSelectedCaseId(c.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-indigo-950/60 border-cyan-400 shadow-md shadow-cyan-900/20'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-mono text-cyan-400 font-bold">{c.id}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    c.verificationStatus === 'VERIFIED' ? 'bg-emerald-500/20 text-emerald-400' :
                    c.verificationStatus === 'PENDING_VERIFICATION' ? 'bg-purple-500/20 text-purple-300' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {c.verificationStatus.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="font-bold text-white text-sm">{c.personName}</div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {c.age} yrs • {c.gender} • At {c.currentLocation}
                </div>
                <div className="text-[10px] text-slate-500 mt-1 font-mono">
                  Origin: {c.organizationName}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Detail Inspection & Decision Card */}
        {selectedCase ? (
          <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/90 border border-cyan-500/30 space-y-5 shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <span className="font-mono text-xs text-cyan-400 font-bold bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  {selectedCase.id}
                </span>
                <h3 className="text-xl font-bold text-white mt-1">{selectedCase.personName}</h3>
                <p className="text-xs text-slate-400">
                  Registered by <strong className="text-slate-300">{selectedCase.organizationName}</strong> ({selectedCase.registeredBySector})
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block">Current Status</span>
                <span className="font-bold text-cyan-300 text-sm">
                  {selectedCase.status.replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            {/* Dossier Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 font-bold">Demographics & Origin</span>
                <div className="text-slate-200">Age: <strong>{selectedCase.age}</strong> • Gender: <strong>{selectedCase.gender}</strong></div>
                <div className="text-slate-200">Last Seen: <strong>{selectedCase.lastSeenLocation}</strong></div>
                <div className="text-slate-200">Current Location: <strong>{selectedCase.currentLocation}</strong></div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 font-bold">Triage & Contact Registry</span>
                <div className="text-slate-200">Triage: <strong>{selectedCase.triageLevel || 'GREEN'}</strong></div>
                <div className="text-slate-200">Reporter: <strong>{selectedCase.reporterName}</strong> ({selectedCase.reporterRelation})</div>
                <div className="text-slate-200">Contact: <strong>{selectedCase.reporterContact}</strong></div>
              </div>
            </div>

            {/* Physical & Medical Data (Gov has cross-sector access) */}
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold block mb-1">Physical Descriptors on File:</span>
                <p className="text-slate-200 leading-relaxed">{selectedCase.physicalDescription}</p>
              </div>

              {selectedCase.medicalNotes && (
                <div className="p-3 bg-rose-950/20 rounded-xl border border-rose-900/40">
                  <span className="text-rose-400 font-bold block mb-1">Confidential Medical Chart (Restricted Clearance):</span>
                  <p className="text-slate-200 font-mono text-[11px]">{selectedCase.medicalNotes}</p>
                </div>
              )}
            </div>

            {/* Verification Decision Action Console */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <label className="block text-xs font-bold text-slate-300">
                Official Certification Memo / Audit Rationale:
              </label>
              <input
                type="text"
                placeholder="e.g. Identity confirmed against photo match and shelter intake registration..."
                value={decisionNote}
                onChange={e => setDecisionNote(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              />

              <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => handleExecuteVerification('REJECTED')}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 font-bold text-xs border border-rose-500/30"
                >
                  Reject Record
                </button>
                <button
                  onClick={() => handleExecuteVerification('CONFLICTING')}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs border border-amber-500/30"
                >
                  Flag Conflicting
                </button>
                <button
                  onClick={() => handleExecuteVerification('VERIFIED')}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Officially Certify & Notify Family</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 p-12 text-center text-slate-500 bg-slate-900/40 rounded-2xl border border-slate-800">
            No case selected for verification review
          </div>
        )}
      </div>
    </div>
  );
};
