import React, { useState } from 'react';
import { useAypo } from '../../../context/AypoContext';
import { ReportFoundModal } from './ReportFoundModal';
import { SubmitMatchModal } from './SubmitMatchModal';
import { AssignedCasesView } from './AssignedCasesView';
import { DisasterMap } from '../../common/DisasterMap';
import { CaseCard } from '../../common/CaseCard';
import { 
  Building2, 
  UserPlus, 
  Sparkles, 
  MapPin, 
  HeartHandshake, 
  ShieldAlert, 
  ArrowRight,
  Database
} from 'lucide-react';

export const PrivateOrgPortal: React.FC<{ onOpenQueue: () => void }> = ({ onOpenQueue }) => {
  const { 
    visibleCases, 
    activeTab, 
    setActiveTab, 
    setSelectedCaseId, 
    syncQueue, 
    currentUser 
  } = useAypo();

  const [isReportFoundOpen, setIsReportFoundOpen] = useState(false);
  const [isSubmitMatchOpen, setIsSubmitMatchOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Subnavigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'dashboard', label: 'Field Operations', icon: HeartHandshake },
            { id: 'assigned', label: 'Assigned Cases', icon: Building2 },
            { id: 'all-cases', label: 'Authorized Cases', icon: Building2 },
            { id: 'map', label: 'Relief Map', icon: MapPin },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          {syncQueue.length > 0 && (
            <button
              onClick={onOpenQueue}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Offline Queue ({syncQueue.length})</span>
            </button>
          )}

          <button
            onClick={() => setIsSubmitMatchOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-bold transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Submit Sighting Match</span>
          </button>

          <button
            onClick={() => setIsReportFoundOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black px-4 py-2 rounded-xl text-xs shadow-lg shadow-orange-500/20 transition-all hover:scale-102"
          >
            <UserPlus className="w-4 h-4" />
            <span>Report Found Person</span>
          </button>
        </div>
      </div>

      {/* Permission & Data Isolation Banner */}
      <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex items-center justify-between text-xs text-amber-300">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>
            <strong>NGO Access Clearance:</strong> Logged in as <em>{currentUser.name}</em> ({currentUser.organizationName}). Government internal notes and patient charts are automatically isolated.
          </span>
        </div>
        <span className="font-mono text-[10px] text-amber-400/80 hidden sm:inline">DATA ISOLATION PROTOCOL ACTIVE</span>
      </div>

      {/* View routing */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="text-xs text-slate-400 font-semibold">Active Search Missions</div>
              <div className="text-2xl font-black text-amber-400 mt-1">4 Sectors</div>
              <div className="text-xs text-slate-400 mt-1">Peelamedu, Ramanathapuram, Singanallur</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="text-xs text-slate-400 font-semibold">Found Survivors Sheltered</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">
                {visibleCases.filter(c => c.status === 'IN_SHELTER').length}
              </div>
              <div className="text-xs text-slate-400 mt-1">Provided Relief & Bedding</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="text-xs text-slate-400 font-semibold">Volunteers Deployed</div>
              <div className="text-2xl font-black text-cyan-400 mt-1">48 Field Personnel</div>
              <div className="text-xs text-slate-400 mt-1">Red Cross & Allied Teams</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Active Disaster Registry (Field View)</h3>
              <span className="text-xs text-slate-400">Total {visibleCases.length} authorized records</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {visibleCases.map(c => (
                <CaseCard
                  key={c.id}
                  caseRecord={c}
                  role="PRIVATE_ORG"
                  onSelect={id => setSelectedCaseId(id)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'assigned' && <AssignedCasesView />}

      {activeTab === 'all-cases' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleCases.map(c => (
            <CaseCard
              key={c.id}
              caseRecord={c}
              role="PRIVATE_ORG"
              onSelect={id => setSelectedCaseId(id)}
            />
          ))}
        </div>
      )}

      {activeTab === 'map' && <DisasterMap />}

      {/* Modals */}
      <ReportFoundModal
        isOpen={isReportFoundOpen}
        onClose={() => setIsReportFoundOpen(false)}
      />
      <SubmitMatchModal
        isOpen={isSubmitMatchOpen}
        onClose={() => setIsSubmitMatchOpen(false)}
      />
    </div>
  );
};
