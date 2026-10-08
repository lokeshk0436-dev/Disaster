import React from 'react';
import { AYPOCase, UserRole } from '../../types';
import { 
  MapPin, 
  ShieldCheck, 
  ShieldAlert, 
  ChevronRight, 
  Sparkles,
  CheckCircle2, 
  AlertTriangle,
  Clock
} from 'lucide-react';

interface CaseCardProps {
  caseRecord: AYPOCase;
  role: UserRole;
  onSelect: (id: string) => void;
  onVerify?: (id: string) => void;
  onReunite?: (id: string) => void;
}

export const CaseCard: React.FC<CaseCardProps> = ({
  caseRecord,
  role,
  onSelect,
  onVerify,
  onReunite
}) => {
  const isMissing = caseRecord.status === 'REPORTED_MISSING';
  const isReunited = caseRecord.status === 'REUNITED';
  const isAwaitingVerification = caseRecord.status === 'AWAITING_FAMILY_VERIFICATION';
  const isVerified = caseRecord.verificationStatus === 'VERIFIED';

  const getStatusBadge = () => {
    if (isReunited) {
      return (
        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/15 backdrop-blur-md text-emerald-300 border border-emerald-400/40 shadow-sm shadow-emerald-500/10 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> REUNITED
        </span>
      );
    }
    if (isAwaitingVerification) {
      return (
        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-500/20 backdrop-blur-md text-cyan-300 border border-cyan-400/50 shadow-md shadow-cyan-500/20 animate-pulse flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-cyan-400" /> AWAITING REUNION
        </span>
      );
    }
    if (isMissing) {
      return (
        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/15 backdrop-blur-md text-amber-300 border border-amber-400/40 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3 text-amber-400" /> MISSING
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/15 backdrop-blur-md text-blue-300 border border-blue-400/40">
        {caseRecord.status.replace(/_/g, ' ')}
      </span>
    );
  };

  const getVerificationBadge = () => {
    switch (caseRecord.verificationStatus) {
      case 'VERIFIED':
        return (
          <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-500/30">
            <ShieldCheck className="w-3 h-3" /> Official Verified
          </span>
        );
      case 'PARTIALLY_VERIFIED':
        return (
          <span className="text-[10px] font-bold text-cyan-300 flex items-center gap-1 bg-cyan-950/40 px-2 py-0.5 rounded-md border border-cyan-500/30">
            <ShieldAlert className="w-3 h-3 text-cyan-400" /> Field Checked
          </span>
        );
      case 'CONFLICTING':
        return (
          <span className="text-[10px] font-bold text-rose-300 flex items-center gap-1 bg-rose-950/40 px-2 py-0.5 rounded-md border border-rose-500/30">
            <AlertTriangle className="w-3 h-3 text-rose-400" /> Conflicting
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1 bg-slate-950/40 px-2 py-0.5 rounded-md border border-slate-800">
            <ShieldAlert className="w-3 h-3 text-slate-500" /> Unverified
          </span>
        );
    }
  };

  return (
    <div 
      onClick={() => onSelect(caseRecord.id)}
      className="group relative bg-slate-900/60 backdrop-blur-xl hover:bg-slate-800/80 border border-white/10 hover:border-cyan-400/50 rounded-3xl p-5 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-cyan-950/40 flex flex-col justify-between overflow-hidden hover:-translate-y-1"
    >
      {/* Specular Ambient Glow Overlay */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-cyan-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <span className="font-mono text-cyan-400 font-bold text-xs tracking-wider group-hover:text-cyan-300 transition-colors bg-cyan-950/50 px-2 py-0.5 rounded-lg border border-cyan-500/30">
            {caseRecord.id}
          </span>
          {getStatusBadge()}
        </div>

        {/* Content Body with Realistic Portrait */}
        <div className="flex items-start gap-4 mb-3.5">
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-white/15 bg-slate-950 flex-shrink-0 shadow-lg group-hover:border-cyan-400/50 transition-colors">
            <img
              src={caseRecord.photoUrl}
              alt={caseRecord.personName}
              className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
              onError={(e) => {
                // High-fidelity fallback portrait
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
              }}
            />
            {caseRecord.syncStatus === 'QUEUED_LOCAL' && (
              <span className="absolute bottom-0 inset-x-0 bg-amber-500/90 backdrop-blur-sm text-slate-950 text-[9px] font-black text-center py-0.5 tracking-wider">
                OFFLINE PENDING
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-base font-extrabold text-white truncate group-hover:text-cyan-200 transition-colors">
              {caseRecord.personName}
            </h3>
            <div className="text-xs text-slate-300 font-medium flex items-center gap-1.5 mt-0.5">
              <span>{caseRecord.age} yrs</span>
              <span className="text-slate-600">•</span>
              <span>{caseRecord.gender}</span>
              {caseRecord.aliases.length > 0 && (
                <>
                  <span className="text-slate-600">•</span>
                  <span className="truncate text-slate-400 text-[11px]">({caseRecord.aliases[0]})</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-2 truncate bg-slate-950/40 backdrop-blur-sm px-2.5 py-1 rounded-xl border border-white/5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
              <span className="truncate text-[11px] font-medium">{caseRecord.currentLocation}</span>
            </div>
          </div>
        </div>

        {/* Physical Description Snippet (Glassmorphic) */}
        {caseRecord.physicalDescription && (
          <p className="text-xs text-slate-300 line-clamp-2 mb-3 bg-slate-950/50 backdrop-blur-md p-2.5 rounded-xl border border-white/5 leading-relaxed">
            {caseRecord.physicalDescription}
          </p>
        )}

        {/* Medical Triage Alert (Public Service & Government only) */}
        {role !== 'FAMILY' && caseRecord.triageLevel && (
          <div className="flex items-center justify-between text-[11px] mb-3 px-2.5 py-1 rounded-xl bg-slate-950/60 backdrop-blur-sm border border-white/10">
            <span className="text-slate-400 font-medium">Triage Priority:</span>
            <span className={`font-black ${
              caseRecord.triageLevel === 'RED' ? 'text-rose-400' :
              caseRecord.triageLevel === 'YELLOW' ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {caseRecord.triageLevel} SECTOR
            </span>
          </div>
        )}
      </div>

      {/* Footer Meta & Glassmorphic Actions */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
        <div>
          {getVerificationBadge()}
        </div>

        <div className="flex items-center gap-2">
          {/* Family Reunion Action */}
          {role === 'FAMILY' && isAwaitingVerification && onReunite && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onReunite(caseRecord.id);
              }}
              className="px-3 py-1 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 transition-all animate-bounce cursor-pointer"
            >
              Confirm Reunion
            </button>
          )}

          {/* Government Verify Action */}
          {role === 'GOVERNMENT' && !isVerified && onVerify && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onVerify(caseRecord.id);
              }}
              className="px-3 py-1 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-600/30 transition-all cursor-pointer"
            >
              Verify Case
            </button>
          )}

          <span className="text-slate-400 group-hover:text-cyan-300 transition-colors flex items-center text-xs font-semibold">
            Inspect <ChevronRight className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </div>
  );
};
