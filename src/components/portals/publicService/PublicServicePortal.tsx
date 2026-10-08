import React, { useState } from 'react';
import { useAypo } from '../../../context/AypoContext';
import { RegisterPersonModal } from './RegisterPersonModal';
import { HospitalBedsView } from './HospitalBedsView';
import { ShelterRosterView } from './ShelterRosterView';
import { DisasterMap } from '../../common/DisasterMap';
import { CaseCard } from '../../common/CaseCard';
import { 
  Ambulance, 
  UserPlus, 
  Bed, 
  Home, 
  MapPin, 
  Activity, 
  RefreshCw, 
  Database, 
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  LogOut
} from 'lucide-react';

export const PublicServicePortal: React.FC<{ onOpenQueue: () => void }> = ({ onOpenQueue }) => {
  const { 
    visibleCases, 
    activeTab, 
    setActiveTab, 
    setSelectedCaseId, 
    updateCaseStatus, 
    syncQueue, 
    connectivity,
    logout
  } = useAypo();

  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const workflowSteps = [
    { label: 'RESCUED', color: 'from-amber-500 to-orange-500' },
    { label: 'SHELTER', color: 'from-blue-500 to-cyan-500' },
    { label: 'HOSPITAL', color: 'from-rose-500 to-pink-500' },
    { label: 'TRANSFERRED', color: 'from-purple-500 to-indigo-500' },
    { label: 'VERIFIED', color: 'from-teal-500 to-emerald-500' },
    { label: 'FAMILY NOTIFIED', color: 'from-cyan-400 to-blue-600' },
    { label: 'REUNITED', color: 'from-emerald-400 to-green-600' }
  ];

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
            { id: 'dashboard', label: 'Triage Overview', icon: Activity },
            { id: 'cases', label: 'All Authorized Cases', icon: Ambulance },
            { id: 'shelters', label: 'Shelter Hubs', icon: Home },
            { id: 'hospitals', label: 'Hospital Beds', icon: Bed },
            { id: 'map', label: 'Operational Map', icon: MapPin },
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
            onClick={() => setIsRegisterModalOpen(true)}
            className="flex-shrink-0 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-5 py-2.5 rounded-xl text-[13px] shadow-md transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Register Person</span>
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

      {/* Official Workflow Pipeline Banner */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-x-auto">
        <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-2">
          Official Emergency Response Workflow Lifecycle:
        </div>
        <div className="flex items-center gap-2 min-w-max">
          {workflowSteps.map((step, idx) => (
            <React.Fragment key={step.label}>
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-white shadow">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                <span>{step.label}</span>
              </div>
              {idx < workflowSteps.length - 1 && (
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Render Selected View */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="text-xs text-slate-400 font-semibold">Triage Patients Monitored</div>
              <div className="text-2xl font-black text-white mt-1">
                {visibleCases.filter(c => c.status === 'HOSPITALIZED').length}
              </div>
              <div className="text-xs text-emerald-400 mt-1">Under Active Emergency Care</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="text-xs text-slate-400 font-semibold">Evacuees in Shelter Hubs</div>
              <div className="text-2xl font-black text-cyan-400 mt-1">
                {visibleCases.filter(c => c.status === 'IN_SHELTER').length}
              </div>
              <div className="text-xs text-slate-400 mt-1">Across 3 Operating Relocation Hubs</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="text-xs text-slate-400 font-semibold">Field Network State</div>
              <div className="text-2xl font-black mt-1">
                <span className={connectivity === 'ONLINE' ? 'text-emerald-400' : 'text-rose-400'}>
                  {connectivity}
                </span>
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {syncQueue.length} Pending Local Records
              </div>
            </div>
          </div>

          {/* Quick Registry Cards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Public Service Patient & Shelter Registry</h3>
              <span className="text-xs text-slate-400">Total {visibleCases.length} records</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {visibleCases.map(c => (
                <CaseCard
                  key={c.id}
                  caseRecord={c}
                  role="PUBLIC_SERVICE"
                  onSelect={id => setSelectedCaseId(id)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'cases' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleCases.map(c => (
            <CaseCard
              key={c.id}
              caseRecord={c}
              role="PUBLIC_SERVICE"
              onSelect={id => setSelectedCaseId(id)}
            />
          ))}
        </div>
      )}

      {activeTab === 'shelters' && (
        <ShelterRosterView onOpenIntake={() => setIsRegisterModalOpen(true)} />
      )}

      {activeTab === 'hospitals' && <HospitalBedsView />}

      {activeTab === 'map' && <DisasterMap />}

      {/* Modal */}
      <RegisterPersonModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </div>
  );
};
