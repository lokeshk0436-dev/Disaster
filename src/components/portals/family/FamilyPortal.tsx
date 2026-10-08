import React, { useState } from 'react';
import { useAypo } from '../../../context/AypoContext';
import { ReportMissingModal } from './ReportMissingModal';
import { SearchFamilyView } from './SearchFamilyView';
import { FamilyCaseTracker } from './FamilyCaseTracker';
import { AssistanceCentresView } from './AssistanceCentresView';
import { DisasterMap } from '../../common/DisasterMap';
import { CaseCard } from '../../common/CaseCard';
import { HeroSection } from '../../common/HeroSection';
import { 
  Users, 
  Search, 
  UserPlus, 
  ShieldCheck, 
  MapPin, 
  Home, 
  Heart, 
  Sparkles, 
  AlertTriangle,
  Clock,
  ArrowRight
} from 'lucide-react';

interface FamilyPortalProps {
  onOpenHelplines?: () => void;
  onOpenVoiceAssistant?: () => void;
}

export const FamilyPortal: React.FC<FamilyPortalProps> = ({
  onOpenHelplines,
  onOpenVoiceAssistant
}) => {
  const { 
    visibleCases, 
    hospitals,
    activeTab, 
    setActiveTab, 
    selectedCaseId, 
    setSelectedCaseId, 
    confirmFamilyReunification 
  } = useAypo();

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Quick stats for family
  const missingCount = visibleCases.filter(c => c.status === 'REPORTED_MISSING').length;
  const foundCount = visibleCases.filter(c => c.status !== 'REPORTED_MISSING' && c.status !== 'REUNITED').length;
  const reunitedCount = visibleCases.filter(c => c.status === 'REUNITED').length;
  const openBedsCount = hospitals.reduce((acc, h) => acc + (h.triageBedsAvailable || 0) + (h.icuBedsAvailable || 0), 0) || 84;

  const awaitingReunionCases = visibleCases.filter(c => c.status === 'AWAITING_FAMILY_VERIFICATION');

  return (
    <div className="space-y-6">
      {/* Sub-navigation tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'dashboard', label: 'Family Dashboard', icon: Users },
            { id: 'search', label: 'Search Family Member', icon: Search },
            { id: 'track', label: 'Track Case File', icon: ShieldCheck },
            { id: 'map', label: 'Disaster Map', icon: MapPin },
            { id: 'centres', label: 'Relief Centres', icon: Home },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Primary Action Button */}
        <button
          onClick={() => setIsReportModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black px-4 py-2 rounded-xl text-xs shadow-lg shadow-orange-500/20 transition-all hover:scale-102"
        >
          <UserPlus className="w-4 h-4" />
          <span>Report Missing Person</span>
        </button>
      </div>

      {/* High-Priority Family Notification Banner */}
      {awaitingReunionCases.length > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/90 via-teal-950/70 to-slate-900 border-2 border-emerald-400/80 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-emerald-300">
                OFFICIAL VERIFICATION ALERT • ACTION REQUIRED
              </div>
              <div className="text-sm font-bold text-white mt-0.5">
                {awaitingReunionCases[0].personName} ({awaitingReunionCases[0].id}) has been verified at {awaitingReunionCases[0].currentLocation}!
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                setSelectedCaseId(awaitingReunionCases[0].id);
                setActiveTab('track');
              }}
              className="px-4 py-2 rounded-xl bg-slate-900 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold"
            >
              View Case Dossier
            </button>
            <button
              onClick={() => confirmFamilyReunification(awaitingReunionCases[0].id)}
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black shadow-lg shadow-emerald-500/30 transition-all"
            >
              Confirm Reunion
            </button>
          </div>
        </div>
      )}

      {/* Render Selected View */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Bold Monochromatic Titanium Tactical Hero Section */}
          <HeroSection
            onReportMissing={() => setIsReportModalOpen(true)}
            onOpenSearch={() => setActiveTab('search')}
            onOpenMap={() => setActiveTab('map')}
            onOpenHelplines={() => onOpenHelplines?.()}
            onOpenVoiceAssistant={() => onOpenVoiceAssistant?.()}
            totalMissing={missingCount}
            totalFound={foundCount}
            totalReunited={reunitedCount}
            openBeds={openBedsCount}
          />

          {/* Featured Case Cards / Recent Verified Updates */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" /> Recent Case Updates & Verified Sightings
              </h3>
              <button
                onClick={() => setActiveTab('search')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
              >
                View all cases <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex overflow-x-auto gap-4 pb-6 snap-x snap-mandatory hide-scrollbar">
              {visibleCases.slice(0, 8).map(c => (
                <div key={c.id} className="min-w-[320px] sm:min-w-[360px] max-w-[400px] snap-center flex-shrink-0">
                  <CaseCard
                    caseRecord={c}
                    role="FAMILY"
                    onSelect={id => {
                      setSelectedCaseId(id);
                      setActiveTab('track');
                    }}
                    onReunite={confirmFamilyReunification}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'search' && (
        <SearchFamilyView
          onSelectCase={id => {
            setSelectedCaseId(id);
            setActiveTab('track');
          }}
        />
      )}

      {activeTab === 'track' && (
        <FamilyCaseTracker initialCaseId={selectedCaseId} />
      )}

      {activeTab === 'map' && (
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <h3 className="text-base font-bold text-white">Disaster Sector Telemetry & Safety Map</h3>
            <p className="text-xs text-slate-400">
              Interactive map displaying verified shelter hubs, emergency hospitals, and registered assistance points.
            </p>
          </div>
          <DisasterMap />
        </div>
      )}

      {activeTab === 'centres' && <AssistanceCentresView />}

      {/* Report Modal */}
      <ReportMissingModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
};
