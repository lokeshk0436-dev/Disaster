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
  Clock,
  Activity
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
      className="group relative bg-[#090C14]/90 backdrop-blur-2xl border border-white/5 hover:border-cyan-500/40 rounded-2xl p-0 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-cyan-900/20 flex flex-col justify-between overflow-hidden hover:-translate-y-1 h-full"
    >
      {/* Top Accent Line */}
      <div className={`h-1 w-full absolute top-0 left-0 ${
        caseRecord.triageLevel === 'RED' ? 'bg-rose-500' :
        caseRecord.triageLevel === 'YELLOW' ? 'bg-amber-500' :
        isReunited ? 'bg-emerald-500' : 'bg-cyan-500'
      }`} />

      {/* Content Wrapper */}
      <div className="p-4 sm:p-5 flex flex-col h-full">
        {/* Header section */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/50 animate-pulse" />
            <span className="font-mono text-slate-400 font-semibold text-[10px] tracking-widest">
              ID: {caseRecord.id}
            </span>
          </div>
          {getStatusBadge()}
        </div>

        {/* Profile Section */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-[#030508] flex-shrink-0 border border-white/10 group-hover:border-cyan-500/30 transition-colors">
            <img
              src={caseRecord.photoUrl}
              alt={caseRecord.personName}
              className="w-full h-full object-cover filter contrast-125 saturate-50 group-hover:saturate-100 transition-all duration-500"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-black text-white truncate tracking-tight">
              {caseRecord.personName}
            </h3>
            <div className="text-xs text-slate-400 flex items-center gap-2 mt-1">
              <span>{caseRecord.age} YRS</span>
              <span className="w-1 h-1 bg-slate-600 rounded-full" />
              <span className="uppercase">{caseRecord.gender}</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-cyan-400 mt-2.5 bg-cyan-950/20 px-2 py-1 rounded border border-cyan-900/30 w-fit">
              <MapPin className="w-3 h-3" />
              <span className="truncate text-[10px] font-bold uppercase tracking-wider">{caseRecord.currentLocation}</span>
            </div>
          </div>
        </div>

        {/* Spacer to push footer down */}
        <div className="flex-grow">
          {/* Medical Triage Alert (Public Service & Government only) */}
          {role !== 'FAMILY' && caseRecord.triageLevel && (
            <div className="flex items-center gap-2 text-[10px] mb-3 px-3 py-1.5 rounded bg-[#030508] border border-white/5 w-fit">
              <Activity className="w-3 h-3 text-slate-400" />
              <span className="text-slate-400 uppercase tracking-widest">Triage:</span>
              <span className={`font-black uppercase tracking-wider ${
                caseRecord.triageLevel === 'RED' ? 'text-rose-400' :
                caseRecord.triageLevel === 'YELLOW' ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {caseRecord.triageLevel}
              </span>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs mt-auto">
          {getVerificationBadge()}

          <div className="flex items-center gap-2">
            {role === 'FAMILY' && isAwaitingVerification && onReunite && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onReunite(caseRecord.id);
                }}
                className="px-3 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[10px] uppercase tracking-wider transition-all cursor-pointer"
              >
                Confirm Reunion
              </button>
            )}

            {role === 'GOVERNMENT' && !isVerified && onVerify && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onVerify(caseRecord.id);
                }}
                className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer"
              >
                Verify
              </button>
            )}
            
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
          </div>
        </div>
      </div>
    </div>
  );
};
