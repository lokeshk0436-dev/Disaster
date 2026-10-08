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
  Layers
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
    syncQueue 
  } = useAypo();

  return (
    <div className="space-y-6">
      {/* Subnavigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto">
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
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md font-black'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
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
            onClick={onOpenAuditLogs}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/30 font-bold text-xs transition-colors"
          >
            <Database className="w-3.5 h-3.5 text-purple-400" />
            <span>Audit Trail</span>
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
