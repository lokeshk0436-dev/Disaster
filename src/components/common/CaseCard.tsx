import React from 'react';
import { AYPOCase, UserRole } from '../../types';

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
  const isAwaitingVerification = caseRecord.status === 'AWAITING_FAMILY_VERIFICATION';
  const isVerified = caseRecord.verificationStatus === 'VERIFIED';

  return (
    <div className="w-full max-w-[320px] border border-blue-200 rounded-2xl bg-white p-4 font-sans text-left shadow-sm">
      <div className="flex items-center gap-4">
        <span className="shrink-0 flex items-center justify-center rounded-full bg-blue-400 p-2 text-white">
          <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
            <path clipRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" fillRule="evenodd"></path>
          </svg>
        </span>
        <p className="font-semibold text-gray-500 truncate">
          {caseRecord.personName}
        </p>
      </div>

      <div className="mt-4 text-gray-500 text-sm flex gap-4 items-center">
        <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border border-gray-200">
           <img 
              src={caseRecord.photoUrl} 
              alt={caseRecord.personName} 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
              }}
            />
        </div>
        <div className="flex-1 min-w-0">
           <div className="truncate">{caseRecord.age} yrs • {caseRecord.gender.toUpperCase()}</div>
           <div className="mt-1 truncate">Loc: {caseRecord.currentLocation}</div>
           <div className="mt-1 font-bold text-blue-500 text-[10px] uppercase tracking-wider truncate">
             {caseRecord.status.replace(/_/g, ' ')}
           </div>
        </div>
      </div>

      <div className="mt-6">
        <button 
          onClick={(e) => { e.stopPropagation(); onSelect(caseRecord.id); }} 
          className="w-full block bg-blue-500 text-white rounded-lg py-3 px-5 text-center text-sm font-semibold hover:bg-blue-600 transition-all"
        >
          Take a Look
        </button>

        {role === 'FAMILY' && isAwaitingVerification && onReunite && (
          <button 
            onClick={(e) => { e.stopPropagation(); onReunite(caseRecord.id); }} 
            className="w-full block mt-2 bg-gray-50 text-emerald-600 hover:bg-gray-200 transition-all rounded-lg py-3 px-5 text-center text-sm font-semibold"
          >
            Confirm Reunion
          </button>
        )}

        {role === 'GOVERNMENT' && !isVerified && onVerify && (
          <button 
            onClick={(e) => { e.stopPropagation(); onVerify(caseRecord.id); }} 
            className="w-full block mt-2 bg-gray-50 text-gray-500 hover:bg-gray-200 transition-all rounded-lg py-3 px-5 text-center text-sm font-semibold"
          >
            Verify Case
          </button>
        )}
      </div>
    </div>
  );
};
