import React from 'react';
import { useAypo } from '../../../context/AypoContext';
import { Copy, GitMerge, AlertTriangle, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export const DuplicateDetection: React.FC = () => {
  const { cases, mergeDuplicateCases } = useAypo();

  // Find cases with duplicate candidates
  const casesWithDuplicates = cases.filter(c => c.duplicateCandidates.length > 0 && !c.mergedIntoId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/60 to-slate-900 border border-amber-500/30 shadow-xl">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <Copy className="w-5 h-5 text-amber-400" /> Cross-Registry Duplicate Detection Console
        </h2>
        <p className="text-xs text-slate-300 mt-1 max-w-xl">
          Disasters frequently create redundant entries as victims are registered by hospitals, shelters, and volunteer squads under slight name variations.
        </p>
      </div>

      <div className="space-y-4">
        {casesWithDuplicates.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-2 opacity-80" />
            <h3 className="text-sm font-bold text-slate-200">No Unresolved Duplicates</h3>
            <p className="text-xs text-slate-500 mt-1">
              All records have been merged into canonical AYPO Case IDs.
            </p>
          </div>
        ) : (
          casesWithDuplicates.map(primary => (
            <div
              key={primary.id}
              className="p-5 rounded-3xl bg-slate-900/90 border border-amber-500/40 shadow-xl space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-amber-400 font-bold bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                    CANONICAL: {primary.id}
                  </span>
                  <span className="font-bold text-white text-sm">{primary.personName}</span>
                </div>
                <span className="text-xs font-bold text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/40">
                  {primary.duplicateCandidates.length} Duplicate Candidate(s)
                </span>
              </div>

              {/* Comparison pairs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Canonical record card */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Primary Master Record</span>
                  <div className="text-sm font-bold text-white">{primary.personName}</div>
                  <div className="text-slate-400">Age: <strong>{primary.age}</strong> • {primary.gender}</div>
                  <div className="text-slate-400">Registered at: <strong className="text-slate-300">{primary.currentLocation}</strong></div>
                  <div className="text-slate-500 font-mono text-[11px]">Agency: {primary.organizationName}</div>
                </div>

                {/* Candidate record(s) */}
                {primary.duplicateCandidates.map(dupId => {
                  const dupCase = cases.find(c => c.id === dupId);
                  if (!dupCase) return null;

                  return (
                    <div key={dupId} className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase text-amber-400">Candidate to Merge</span>
                        <span className="font-mono text-[10px] text-amber-300">{dupCase.id}</span>
                      </div>
                      <div className="text-sm font-bold text-white">{dupCase.personName}</div>
                      <div className="text-slate-400">Age: <strong>{dupCase.age}</strong> • {dupCase.gender}</div>
                      <div className="text-slate-400">Registered at: <strong className="text-slate-300">{dupCase.currentLocation}</strong></div>
                      <div className="text-slate-500 font-mono text-[11px]">Agency: {dupCase.organizationName}</div>

                      <div className="pt-2">
                        <button
                          onClick={() => mergeDuplicateCases(primary.id, dupCase.id)}
                          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow transition-all"
                        >
                          <GitMerge className="w-3.5 h-3.5" />
                          <span>Merge {dupCase.id} into Master {primary.id}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
