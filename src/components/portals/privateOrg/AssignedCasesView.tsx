import React from 'react';
import { useAypo } from '../../../context/AypoContext';
import { CaseCard } from '../../common/CaseCard';
import { Building2, Shield, MapPin, Users, HeartHandshake } from 'lucide-react';

export const AssignedCasesView: React.FC = () => {
  const { visibleCases, setSelectedCaseId } = useAypo();

  // Filter cases assigned to or handled by NGOs
  const ngoCases = visibleCases.filter(c => 
    c.organizationName.toLowerCase().includes('red cross') ||
    c.organizationName.toLowerCase().includes('ngo') ||
    c.registeredBySector === 'PRIVATE_ORG'
  );

  return (
    <div className="space-y-5">
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/60 to-slate-900 border border-amber-800/40 shadow-xl">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <HeartHandshake className="w-5 h-5 text-amber-400" /> Assigned NGO Humanitarian Cases
        </h2>
        <p className="text-xs text-slate-300 mt-1 max-w-xl">
          Search sectors and displaced individuals under humanitarian support by Red Cross Disaster Relief Wing and allied NGO volunteer units.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ngoCases.length === 0 ? (
          <div className="col-span-full p-8 text-center text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800">
            No specific NGO cases filtered. All open field cases are accessible for coordination.
          </div>
        ) : (
          ngoCases.map(c => (
            <CaseCard
              key={c.id}
              caseRecord={c}
              role="PRIVATE_ORG"
              onSelect={id => setSelectedCaseId(id)}
            />
          ))
        )}
      </div>
    </div>
  );
};
