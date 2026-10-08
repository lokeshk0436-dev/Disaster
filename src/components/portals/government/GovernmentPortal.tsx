import React from 'react';
import { useAypo } from '../../../context/AypoContext';
import { CommandOverview } from './CommandOverview';
import { VerificationCenter } from './VerificationCenter';
import { AIMatchReview } from './AIMatchReview';
import { DuplicateDetection } from './DuplicateDetection';
import { AnalyticsView } from './AnalyticsView';
import { DisasterMap } from '../../common/DisasterMap';
import { CaseCard } from '../../common/CaseCard';
import { 
  Landmark, 
  ShieldCheck, 
  Sparkles, 
  Copy, 
  TrendingUp, 
  MapPin, 
  Database, 
  Activity,
  Layers,
  LogOut
} from 'lucide-react';

export const GovernmentPortal: React.FC<{ onOpenAuditLogs: () => void; onOpenQueue: () => void }> = ({
  onOpenAuditLogs,
  onOpenQueue
}) => {
  const { 
    visibleCases, 
    activeTab, 
    setActiveTab, 
    setSelectedCaseId, 
    verifyCase, 
    aiMatches, 
    syncQueue,
    logout
  } = useAypo();

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
            { id: 'dashboard', label: 'Command Overview', icon: Landmark },
            { id: 'verification', label: 'Verification Center', icon: ShieldCheck },
            { id: 'ai-matches', label: `AI Match Review (${aiMatches.length})`, icon: Sparkles },
            { id: 'duplicates', label: 'Duplicate Detection', icon: Copy },
            { id: 'cases', label: 'Cross-Sector Cases', icon: Layers },
            { id: 'analytics', label: 'Disaster Analytics', icon: TrendingUp },
            { id: 'map', label: 'Tactical GIS Map', icon: MapPin },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-2 sm:px-4 py-2.5 rounded-xl text-[12px] font-bold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                <span className="hidden sm:inline whitespace-nowrap">{tab.label}</span>
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
            onClick={onOpenAuditLogs}
            className="flex-shrink-0 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[13px] shadow-sm transition-all"
          >
            <Database className="w-4 h-4 text-blue-600" />
            <span className="hidden sm:inline">Audit Trail</span>
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

      {/* View routing */}
      {activeTab === 'dashboard' && <CommandOverview onNavigate={setActiveTab} />}

      {activeTab === 'verification' && <VerificationCenter />}

      {activeTab === 'ai-matches' && <AIMatchReview />}

      {activeTab === 'duplicates' && <DuplicateDetection />}

      {activeTab === 'analytics' && <AnalyticsView />}

      {activeTab === 'map' && <DisasterMap />}

      {activeTab === 'cases' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">All Authorized Cross-Sector Cases</h3>
            <span className="text-xs text-slate-400">Total {visibleCases.length} records</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleCases.map(c => (
              <CaseCard
                key={c.id}
                caseRecord={c}
                role="GOVERNMENT"
                onSelect={id => setSelectedCaseId(id)}
                onVerify={id => verifyCase(id, 'VERIFIED')}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
