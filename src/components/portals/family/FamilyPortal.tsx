import React, { useState } from 'react';
import { useAypo } from '../../../context/AypoContext';
import { AypoLogo } from '../../common/AypoLogo';
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
  ArrowRight,
  LogOut,
  Activity
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
    confirmFamilyReunification,
    logout,
    currentUser
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
      {/* Top Main Navigation (Replaces old Navbar) */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-gray-200 pb-4 w-full">
        {/* Brand Logo */}
        <AypoLogo hideTextOnMobile className="pr-4" />

        <div className="flex flex-1 items-center justify-start xl:justify-center overflow-x-auto hide-scrollbar w-full bg-gray-50 p-1.5 rounded-2xl border border-gray-200 gap-1">
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
                className={`flex-1 flex items-center justify-center gap-2 px-3 lg:px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all min-w-[140px] whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-white'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                <span className="inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Primary Action Button & Sign Out */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="flex-shrink-0 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-5 py-2.5 rounded-xl text-[13px] shadow-md transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Report Missing</span>
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

          {/* SECURE PERSONAL DETAILS WIDGET */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-emerald-600" />
                  Secure Personal Identity
                </h2>
                <p className="text-sm text-gray-500 mt-1">Your data is cryptographically secured and strictly visible only to you and authorized rescue authorities.</p>
              </div>
              <div className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                VERIFIED CITIZEN
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="text-xs font-bold text-gray-500 uppercase mb-1">Primary Name</div>
                <div className="text-base font-bold text-gray-900">Kavitha Ramesh</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="text-xs font-bold text-gray-500 uppercase mb-1">Age & Gender</div>
                <div className="text-base font-bold text-gray-900">34 Yrs • Female</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="text-xs font-bold text-gray-500 uppercase mb-1">Govt ID (Aadhaar)</div>
                <div className="text-base font-mono font-bold text-gray-900 flex items-center gap-2">
                  5942 8192 4912
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="text-xs font-bold text-gray-500 uppercase mb-1">Marital Status</div>
                <div className="text-base font-bold text-gray-900">Married</div>
              </div>
            </div>
          </div>

          {/* FAMILY MEMBERS LOCATIONS WIDGET */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8 mt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Registered Family Members
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-gray-900">Ramesh Kumar (Husband)</div>
                  <div className="text-xs text-gray-500 mt-0.5">Location: <span className="text-green-600 font-semibold">Safe at Home</span></div>
                </div>
                <a href="https://www.google.com/maps/search/?api=1&query=RS+Puram+Coimbatore" target="_blank" rel="noopener noreferrer" title="Get Directions" className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors">
                  <MapPin className="w-4 h-4" />
                </a>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-gray-900">Lakshmi (Mother)</div>
                  <div className="text-xs text-gray-500 mt-0.5">Location: <span className="text-orange-600 font-semibold">Relief Camp 01</span></div>
                </div>
                <a href="https://www.google.com/maps/search/?api=1&query=PSG+Tech+Convention+Ground+Coimbatore" target="_blank" rel="noopener noreferrer" title="Get Directions" className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors">
                  <MapPin className="w-4 h-4" />
                </a>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-gray-900">Aarav (Son)</div>
                  <div className="text-xs text-gray-500 mt-0.5">Location: <span className="text-blue-600 font-semibold">With You</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Case Cards / Recent Verified Updates */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" /> My Reported Cases
              </h3>
              <button
                onClick={() => setActiveTab('search')}
                className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1"
              >
                Search all cases <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex overflow-x-auto gap-4 pb-6 snap-x snap-mandatory hide-scrollbar">
              {visibleCases.filter(c => c.reporterName === currentUser?.name || c.reporterContact === currentUser?.phone).slice(0, 8).map(c => (
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
