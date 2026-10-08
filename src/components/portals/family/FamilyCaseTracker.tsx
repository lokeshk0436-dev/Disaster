import React, { useState } from 'react';
import { useAypo } from '../../../context/AypoContext';
import { CaseTimeline } from '../../common/CaseTimeline';
import { 
  ShieldCheck, 
  MapPin, 
  Clock, 
  User, 
  Phone, 
  Send, 
  Heart, 
  Search, 
  AlertTriangle,
  Building,
  CheckCircle2,
  Share2,
  FileText
} from 'lucide-react';

export const FamilyCaseTracker: React.FC<{ initialCaseId?: string | null }> = ({ initialCaseId }) => {
  const { visibleCases, selectedCaseId, setSelectedCaseId, confirmFamilyReunification } = useAypo();
  const [inputCaseId, setInputCaseId] = useState(initialCaseId || selectedCaseId || 'AY-2026-000124');
  const [additionalNote, setAdditionalNote] = useState('');
  const [submittedNoteSuccess, setSubmittedNoteSuccess] = useState(false);

  const activeCaseId = selectedCaseId || inputCaseId;
  const currentCase = visibleCases.find(c => c.id.toLowerCase() === activeCaseId.toLowerCase().trim()) || visibleCases[0];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCaseId.trim()) {
      setSelectedCaseId(inputCaseId.trim());
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!additionalNote.trim() || !currentCase) return;
    currentCase.timeline.push({
      id: `tl-note-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: 'Family Submitted Additional Information',
      description: additionalNote.trim(),
      actor: 'Family Member',
      sector: 'FAMILY',
      badge: 'FAMILY UPDATE'
    });
    setAdditionalNote('');
    setSubmittedNoteSuccess(true);
    setTimeout(() => setSubmittedNoteSuccess(false), 3000);
  };

  if (!currentCase) {
    return (
      <div className="p-8 text-center bg-slate-900/60 rounded-2xl border border-slate-800">
        <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-2" />
        <h3 className="text-sm font-bold text-slate-200">No Case Selected</h3>
        <p className="text-xs text-slate-400 mt-1">
          Please enter an AYPO Case ID (e.g. AY-2026-000124) to track verified updates.
        </p>
      </div>
    );
  }

  const isReunited = currentCase.status === 'REUNITED';
  const isAwaitingReunion = currentCase.status === 'AWAITING_FAMILY_VERIFICATION';
  const isVerified = currentCase.verificationStatus === 'VERIFIED';

  return (
    <div className="space-y-6">
      {/* Search Header Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
            <Search className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Track Unique AYPO Case ID</div>
            <div className="text-[10px] text-slate-400">Official cross-sector disaster identifier</div>
          </div>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="e.g. AY-2026-000124"
            value={inputCaseId}
            onChange={e => setInputCaseId(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white uppercase font-mono tracking-wider focus:outline-none focus:border-cyan-400"
          />
          <button
            type="submit"
            className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow transition-colors"
          >
            Track Case
          </button>
        </form>
      </div>

      {/* Main Case Dossier Card */}
      <div className="bg-[#0B132B]/90 border border-cyan-500/30 rounded-3xl p-6 shadow-2xl space-y-6">
        {/* Verification Alert Banner if Verified & Waiting */}
        {isAwaitingReunion && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-teal-950/60 to-cyan-950/80 border-2 border-emerald-400/60 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400 text-emerald-400 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-sm font-black text-emerald-300 uppercase tracking-wide">
                  FOUND — OFFICIAL GOVERNMENT VERIFICATION COMPLETE!
                </h4>
                <p className="text-xs text-slate-200 mt-0.5">
                  Your family member has been verified at <strong>{currentCase.currentLocation}</strong>. Please confirm your identity to complete reunification.
                </p>
              </div>
            </div>

            <button
              onClick={() => confirmFamilyReunification(currentCase.id)}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/30 transition-all hover:scale-105 whitespace-nowrap"
            >
              Confirm & Reunite Now
            </button>
          </div>
        )}

        {isReunited && (
          <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/60 shadow-lg flex items-center gap-3 text-emerald-300">
            <Heart className="w-6 h-6 fill-emerald-400 text-emerald-400 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-black uppercase">REUNIFICATION SUCCESSFUL</h4>
              <p className="text-xs text-emerald-200/90">
                Case officially resolved. Both parties have verified identities at {currentCase.currentLocation}.
              </p>
            </div>
          </div>
        )}

        {/* Profile Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Column: Photo & Key Identifiers */}
          <div className="space-y-4">
            <div className="relative w-full aspect-square max-w-[280px] mx-auto rounded-3xl overflow-hidden border-2 border-slate-700 bg-slate-800 shadow-xl">
              <img
                src={currentCase.photoUrl}
                alt={currentCase.personName}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono font-bold text-cyan-400 border border-slate-700">
                {currentCase.id}
              </div>
              <div className="absolute bottom-3 inset-x-3 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl text-center border border-slate-700">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                  {currentCase.verificationStatus.replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Support & Shelter Hotline
              </div>
              <div className="text-white font-bold flex items-center gap-2">
                <Building className="w-4 h-4 text-cyan-400" />
                <span>{currentCase.currentLocation}</span>
              </div>
              <div className="text-slate-400 flex items-center gap-2 text-[11px]">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span>Emergency Helpdesk: +91 422 2301982</span>
              </div>
            </div>
          </div>

          {/* Center Column: Verified Dossier Information */}
          <div className="lg:col-span-2 space-y-5">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-black text-white">{currentCase.personName}</h1>
                <span className="font-mono text-xs px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                  {currentCase.id}
                </span>
              </div>

              <div className="text-xs text-slate-400 flex flex-wrap items-center gap-3">
                <span>Age: <strong className="text-slate-200">{currentCase.age} years</strong></span>
                <span>•</span>
                <span>Gender: <strong className="text-slate-200">{currentCase.gender}</strong></span>
                {currentCase.aliases.length > 0 && (
                  <>
                    <span>•</span>
                    <span>Aliases: <strong className="text-slate-300">{currentCase.aliases.join(', ')}</strong></span>
                  </>
                )}
              </div>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-[10px] text-slate-500 font-semibold uppercase">Current Status</div>
                <div className="text-xs font-bold text-cyan-300 mt-0.5">
                  {currentCase.status.replace(/_/g, ' ')}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-[10px] text-slate-500 font-semibold uppercase">Verification</div>
                <div className="text-xs font-bold text-emerald-400 mt-0.5 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{currentCase.verificationStatus.replace(/_/g, ' ')}</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 col-span-2 sm:col-span-1">
                <div className="text-[10px] text-slate-500 font-semibold uppercase">Last Registered</div>
                <div className="text-xs font-bold text-slate-200 mt-0.5 truncate">
                  {currentCase.currentLocation}
                </div>
              </div>
            </div>

            {/* Physical Identifiers */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5 text-xs">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Physical Identifiers on Record
              </div>
              <p className="text-slate-200 leading-relaxed">
                {currentCase.physicalDescription || 'Standard field identification recorded.'}
              </p>
            </div>

            {/* Chronological Milestone Timeline */}
            <div className="space-y-2 pt-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" /> Chronological Case Timeline
              </h3>
              <CaseTimeline timeline={currentCase.timeline} />
            </div>

            {/* Submit Additional Information to Case File */}
            <div className="pt-4 border-t border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-cyan-400" /> Submit Additional Information to Case File
              </h4>
              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Additional contact number, medical history or recent clothing info..."
                  value={additionalNote}
                  onChange={e => setAdditionalNote(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs border border-slate-700 transition-colors"
                >
                  Submit
                </button>
              </form>
              {submittedNoteSuccess && (
                <p className="text-xs text-emerald-400 mt-1 font-semibold">
                  ✓ Note appended to verified case file successfully.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
