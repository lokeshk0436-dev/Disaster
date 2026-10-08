import React, { useState } from 'react';
import { useAypo } from '../../../context/AypoContext';
import { ReportMissingModal } from './ReportMissingModal';
import { SearchFamilyView } from './SearchFamilyView';
import { FamilyCaseTracker } from './FamilyCaseTracker';
import { AssistanceCentresView } from './AssistanceCentresView';
import { DisasterMap } from '../../common/DisasterMap';
import { CaseCard } from '../../common/CaseCard';
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

export const FamilyPortal: React.FC = () => {
  const { 
    visibleCases, 
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
          {/* Hero Welcome / Action Banner */}
          <div className="relative rounded-3xl overflow-hidden p-6 sm:p-8 bg-slate-900/60 backdrop-blur-2xl border border-white/10 shadow-2xl relative">
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent pointer-events-none" />
            <div className="max-w-2xl space-y-3 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 text-[11px] font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> National Civilian Disaster Reunification Registry
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Emergency Civilian Search & Family Reunification Desk
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Official public safety intake protocol connecting disaster-affected families with verified field rescue units, medical trauma centers, and temporary shelter rosters. All records are cross-checked by government incident commanders before family notifications are transmitted.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setIsReportModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-lg shadow-orange-500/25 transition-all flex items-center gap-2 cursor-pointer hover:scale-102"
                >
                  <UserPlus className="w-4 h-4" /> File Official Missing Person Report
                </button>
                <button
                  onClick={() => setActiveTab('search')}
                  className="px-5 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-xs border border-white/10 hover:border-cyan-400/40 transition-all flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Search className="w-4 h-4 text-cyan-400" /> Search Verified Survivors
                </button>
              </div>
            </div>
          </div>

          {/* Quick Metrics with Glassmorphism */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-xl flex items-center gap-4 hover:border-amber-400/40 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/15 text-amber-300 border border-amber-400/40 flex items-center justify-center font-black text-2xl shadow-inner">
                {missingCount}
              </div>
              <div>
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active Missing Petitions</div>
                <div className="text-sm font-black text-white mt-0.5">Broadcasted to Rescue Units</div>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-xl flex items-center gap-4 hover:border-cyan-400/40 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 text-cyan-300 border border-cyan-400/40 flex items-center justify-center font-black text-2xl shadow-inner">
                {foundCount}
              </div>
              <div>
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Sheltered & Admitted</div>
                <div className="text-sm font-black text-white mt-0.5">Under Care in Relief Hubs</div>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-xl flex items-center gap-4 hover:border-emerald-400/40 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 text-emerald-300 border border-emerald-400/40 flex items-center justify-center font-black text-2xl shadow-inner">
                {reunitedCount}
              </div>
              <div>
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Verified Reunifications</div>
                <div className="text-sm font-black text-emerald-300 mt-0.5">Families Successfully Rejoined</div>
              </div>
            </div>
          </div>

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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {visibleCases.slice(0, 6).map(c => (
                <CaseCard
                  key={c.id}
                  caseRecord={c}
                  role="FAMILY"
                  onSelect={id => {
                    setSelectedCaseId(id);
                    setActiveTab('track');
                  }}
                  onReunite={confirmFamilyReunification}
                />
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
