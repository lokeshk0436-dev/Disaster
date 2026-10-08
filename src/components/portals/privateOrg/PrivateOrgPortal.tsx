import React, { useState } from 'react';
import { useAypo } from '../../../context/AypoContext';
import { ReportFoundModal } from './ReportFoundModal';
import { SubmitMatchModal } from './SubmitMatchModal';
import { ProvideFundsModal } from './ProvideFundsModal';
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
  Database,
  LogOut,
  Activity,
  Banknote
} from 'lucide-react';

export const PrivateOrgPortal: React.FC<{ onOpenQueue: () => void }> = ({ onOpenQueue }) => {
  const { 
    visibleCases, 
    activeTab, 
    setActiveTab, 
    setSelectedCaseId, 
    syncQueue, 
    currentUser,
    logout
  } = useAypo();

  const [isReportFoundOpen, setIsReportFoundOpen] = useState(false);
  const [isSubmitMatchOpen, setIsSubmitMatchOpen] = useState(false);
  const [isProvideFundsOpen, setIsProvideFundsOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Top Main Navigation (Replaces old Navbar) */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-gray-200 pb-4 w-full">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 flex-shrink-0 cursor-pointer pr-4">
          <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white shadow-md">
             <Activity className="w-5 h-5" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-gray-900 hidden lg:block">AYPO</span>
        </div>

        <div className="flex flex-1 items-center justify-between w-full overflow-x-auto bg-gray-50 p-1.5 rounded-2xl border border-gray-200">
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
                className={`flex-1 flex items-center justify-center gap-2 px-3 sm:px-6 py-2.5 rounded-xl text-[13px] font-bold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          {syncQueue.length > 0 && (
            <button
              onClick={onOpenQueue}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-[13px] shadow transition-all"
            >
              <Database className="w-4 h-4" />
              <span className="hidden sm:inline">Offline Queue ({syncQueue.length})</span>
            </button>
          )}

          <button
            onClick={() => setIsProvideFundsOpen(true)}
            className="flex-shrink-0 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-700 font-bold text-[13px] shadow-sm transition-all"
          >
            <Banknote className="w-4 h-4" />
            <span className="hidden sm:inline">Provide Funds</span>
          </button>

          <button
            onClick={() => setIsSubmitMatchOpen(true)}
            className="flex-shrink-0 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[13px] shadow-sm transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">Submit Sighting Match</span>
          </button>

          <button
            onClick={() => setIsReportFoundOpen(true)}
            className="flex-shrink-0 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-5 py-2.5 rounded-xl text-[13px] shadow-md transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Report Found</span>
          </button>
          <button
            onClick={logout}
            className="flex-shrink-0 flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-bold px-5 py-2.5 rounded-xl text-[13px] shadow-md transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
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
      <ProvideFundsModal
        isOpen={isProvideFundsOpen}
        onClose={() => setIsProvideFundsOpen(false)}
      />
    </div>
  );
};
