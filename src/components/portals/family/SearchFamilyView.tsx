import React, { useState } from 'react';
import { useAypo } from '../../../context/AypoContext';
import { CaseCard } from '../../common/CaseCard';
import { Search, Filter, AlertCircle, Users, CheckCircle2, MapPin, Navigation } from 'lucide-react';
import { locationService } from '../../../services/locationService';

export const SearchFamilyView: React.FC<{ onSelectCase: (id: string) => void }> = ({ onSelectCase }) => {
  const { visibleCases, currentRole, confirmFamilyReunification } = useAypo();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isLocating, setIsLocating] = useState(false);

  const handleFilterNearMe = async () => {
    setIsLocating(true);
    try {
      const geo = await locationService.getCurrentPosition();
      // Set search query to key area
      setSearchQuery('Coimbatore');
    } finally {
      setIsLocating(false);
    }
  };

  const filtered = visibleCases.filter(c => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery = 
      !q ||
      c.personName.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q) ||
      c.aliases.some(a => a.toLowerCase().includes(q)) ||
      c.currentLocation.toLowerCase().includes(q);

    const matchesStatus = 
      statusFilter === 'ALL' ||
      (statusFilter === 'FOUND' && c.status !== 'REPORTED_MISSING' && c.status !== 'REUNITED') ||
      (statusFilter === 'MISSING' && c.status === 'REPORTED_MISSING') ||
      (statusFilter === 'REUNITED' && c.status === 'REUNITED') ||
      (statusFilter === 'VERIFIED' && c.verificationStatus === 'VERIFIED');

    return matchesQuery && matchesStatus;
  });

  return (
    <div className="space-y-5">
      {/* Search Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-cyan-950/40 border border-cyan-800/40 shadow-xl">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <Search className="w-5 h-5 text-cyan-400" /> Search Disaster Registry
        </h2>
        <p className="text-xs text-slate-300 mt-1 max-w-xl">
          Search verified survivors, sheltered individuals, and active missing person petitions across all official relief centres and hospitals.
        </p>

        {/* Search Input Bar */}
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by full name, alias, or AYPO Case ID (e.g. AY-2026-000124)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/90 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 shadow-inner"
            />
          </div>

          <button
            onClick={handleFilterNearMe}
            disabled={isLocating}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer"
          >
            <Navigation className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isLocating ? 'Acquiring GPS...' : '📍 Near My Location'}</span>
          </button>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'ALL', label: 'All Records' },
              { id: 'FOUND', label: 'Found / Sheltered' },
              { id: 'MISSING', label: 'Missing' },
              { id: 'VERIFIED', label: 'Govt Verified' },
              { id: 'REUNITED', label: 'Reunited' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  statusFilter === f.id
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count & Data Isolation Notice */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 px-1">
        <div>
          Showing <strong>{filtered.length}</strong> public/family verified record{filtered.length === 1 ? '' : 's'}
        </div>
        <div className="text-[11px] text-cyan-400 font-semibold flex items-center gap-1">
          <span>Protected: Confidential medical & internal records redacted</span>
        </div>
      </div>

      {/* Cards Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
          <AlertCircle className="w-10 h-10 text-slate-500 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-300">No Matching Records Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Try checking spelling variations or file an official Missing Person Report to notify all field rescue teams immediately.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(c => (
            <CaseCard
              key={c.id}
              caseRecord={c}
              role={currentRole}
              onSelect={onSelectCase}
              onReunite={confirmFamilyReunification}
            />
          ))}
        </div>
      )}
    </div>
  );
};
