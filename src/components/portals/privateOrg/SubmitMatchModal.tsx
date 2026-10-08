import React, { useState } from 'react';
import { useAypo } from '../../../context/AypoContext';
import { X, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

export const SubmitMatchModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { visibleCases, storageService, setAuditLogs, updateCaseStatus } = useAypo() as any;

  const missingCases = visibleCases.filter((c: any) => c.status === 'REPORTED_MISSING');
  const foundCases = visibleCases.filter((c: any) => c.status !== 'REPORTED_MISSING' && c.status !== 'REUNITED');

  const [selectedMissingId, setSelectedMissingId] = useState(missingCases[0]?.id || '');
  const [selectedFoundId, setSelectedFoundId] = useState(foundCases[0]?.id || '');
  const [rationale, setRationale] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMissingId || !selectedFoundId) return;

    setSubmitted(true);
    try {
      await updateCaseStatus(
        selectedMissingId, 
        'FOUND_UNVERIFIED', 
        'Field Observation Match', 
        `Match proposed with Found Case ${selectedFoundId}. Rationale: ${rationale}`
      );
    } catch (err) {
      console.error(err);
    }
    
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0B1530] border border-amber-500/40 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">Submit Field Match to Authorities</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <p className="text-slate-300">
            Field workers and volunteer teams can submit observational evidence linking a missing person report to a sheltered survivor. The Government Verification Authority will review and certify before notifying the family.
          </p>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Select Missing Person Report</label>
            <select
              value={selectedMissingId}
              onChange={e => setSelectedMissingId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
            >
              {missingCases.map((m: any) => (
                <option key={m.id} value={m.id}>
                  {m.personName} ({m.id}) • {m.age} yrs • Last seen {m.lastSeenLocation}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Select Sheltered / Found Survivor</label>
            <select
              value={selectedFoundId}
              onChange={e => setSelectedFoundId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
            >
              {foundCases.map((f: any) => (
                <option key={f.id} value={f.id}>
                  {f.personName} ({f.id}) • {f.age} yrs • At {f.currentLocation}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Field Observation & Supporting Rationale *</label>
            <textarea
              required
              rows={3}
              placeholder="e.g. Survivor identified family photograph, scar on eyebrow verified by triage nurse, responded to given name..."
              value={rationale}
              onChange={e => setRationale(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          {submitted ? (
            <div className="p-3 bg-emerald-500/20 text-emerald-300 rounded-xl border border-emerald-500/40 font-bold text-center">
              ✓ Match Proposal Transmitted to Incident Command Verification Desk
            </div>
          ) : (
            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black shadow"
              >
                Submit for Verification
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
