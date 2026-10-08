import React from 'react';
import { useAypo } from '../../../context/AypoContext';
import { 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  AlertCircle,
  TrendingUp,
  Brain,
  UserCheck
} from 'lucide-react';

export const AIMatchReview: React.FC = () => {
  const { aiMatches, verifyAIMatch, cases } = useAypo();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/70 via-[#181138] to-slate-900 border border-purple-500/30 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30">
                <Brain className="w-4 h-4" />
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300">
                RESPONSIBLE AI SURVIVOR MATCHING ENGINE
              </span>
            </div>
            <h2 className="text-xl font-black text-white mt-1">AI-Assisted Candidate Match Reviews</h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Algorithmic multi-factor comparison evaluating name phonetics, age variance, gender, physical descriptors, and sector proximity. 
              <strong> Crucial Responsible AI Mandate:</strong> AI only recommends candidates; official human officer verification is mandatory before family dispatches.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/40 text-center flex-shrink-0">
            <div className="text-2xl font-black text-purple-300">{aiMatches.length}</div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">Candidates Queued</div>
          </div>
        </div>
      </div>

      {/* Match Cards List */}
      <div className="space-y-4">
        {aiMatches.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-2 opacity-80" />
            <h3 className="text-sm font-bold text-slate-200">All Candidate Matches Adjudicated</h3>
            <p className="text-xs text-slate-500 mt-1">
              The AI matching engine continuously compares new missing petitions against field survivor rosters.
            </p>
          </div>
        ) : (
          aiMatches.map(match => {
            const missingRecord = cases.find(c => c.id === match.missingCaseId);
            const foundRecord = cases.find(c => c.id === match.foundCaseId);
            const isPending = match.status === 'PENDING_HUMAN_REVIEW';

            return (
              <div
                key={match.id}
                className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-purple-500/40 shadow-2xl space-y-5"
              >
                {/* Confidence Bar Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-black text-lg shadow-lg shadow-purple-500/20">
                      {match.overallConfidence}%
                    </div>
                    <div>
                      <div className="text-xs font-bold text-purple-300 uppercase tracking-wide flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" /> High-Confidence Potential Match
                      </div>
                      <div className="text-sm font-black text-white">
                        {match.missingCaseName} ({match.missingCaseId}) ↔ {match.foundCaseName} ({match.foundCaseId})
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      match.status === 'VERIFIED_BY_AUTHORITY' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                      match.status === 'REJECTED' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                      'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                    }`}>
                      {match.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                {/* Side-by-side Record Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Record A: Missing Report */}
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                      <span className="font-bold text-amber-400">RECORD A: Missing Report</span>
                      <span className="font-mono text-slate-400">{match.missingCaseId}</span>
                    </div>

                    <div className="flex items-start gap-3">
                      <img
                        src={missingRecord?.photoUrl}
                        alt="Missing person"
                        className="w-16 h-16 rounded-xl object-cover border border-slate-700"
                      />
                      <div className="space-y-1 text-xs">
                        <div className="text-base font-bold text-white">{missingRecord?.personName}</div>
                        <div className="text-slate-400">Age: <strong>{missingRecord?.age}</strong> • {missingRecord?.gender}</div>
                        <div className="text-slate-400 truncate">Last Seen: {missingRecord?.lastSeenLocation}</div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                      {missingRecord?.physicalDescription}
                    </p>
                  </div>

                  {/* Record B: Found Survivor */}
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                      <span className="font-bold text-emerald-400">RECORD B: Field Survivor Roster</span>
                      <span className="font-mono text-slate-400">{match.foundCaseId}</span>
                    </div>

                    <div className="flex items-start gap-3">
                      <img
                        src={foundRecord?.photoUrl}
                        alt="Found person"
                        className="w-16 h-16 rounded-xl object-cover border border-slate-700"
                      />
                      <div className="space-y-1 text-xs">
                        <div className="text-base font-bold text-white">{foundRecord?.personName}</div>
                        <div className="text-slate-400">Age: <strong>{foundRecord?.age}</strong> • {foundRecord?.gender}</div>
                        <div className="text-slate-400 truncate">Location: {foundRecord?.currentLocation}</div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                      {foundRecord?.physicalDescription}
                    </p>
                  </div>
                </div>

                {/* Multi-Factor AI Breakdown Matrix */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-purple-500/20 space-y-3">
                  <div className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                    Multi-Attribute Evaluation Scoring Breakdown
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase block">Name Phonetics</span>
                      <strong className="text-cyan-400 text-sm">{match.breakdown.nameSimilarity}%</strong>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase block">Age Proximity</span>
                      <strong className="text-emerald-400 text-sm">{match.breakdown.ageScore}%</strong>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase block">Gender Concordance</span>
                      <strong className="text-white text-sm">{match.breakdown.genderMatch ? '100%' : '0%'}</strong>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase block">Sector Radius</span>
                      <strong className="text-purple-400 text-sm">{match.breakdown.locationProximityScore}%</strong>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase block">Physical Overlap</span>
                      <strong className="text-amber-400 text-sm">{match.breakdown.physicalFeaturesScore}%</strong>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 font-mono italic">
                    AI Rationale: {match.rationale}
                  </p>
                </div>

                {/* Human Verification Action Bar */}
                {isPending && (
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="text-xs text-slate-400 flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-cyan-400" />
                      <span>Officer Decision Required (Authorizes instant SMS & in-app family notification)</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => verifyAIMatch(match.id, false)}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 font-bold text-xs border border-rose-500/30 transition-colors"
                      >
                        Reject Candidate
                      </button>
                      <button
                        onClick={() => verifyAIMatch(match.id, true)}
                        className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-purple-500/30 transition-all hover:scale-102 flex items-center gap-2"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Approve Match & Notify Family</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
