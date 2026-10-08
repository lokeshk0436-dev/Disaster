import React, { useState } from 'react';
import { AypoProvider, useAypo } from './context/AypoContext';
import { Navbar } from './components/common/Navbar';
import { ConnectivityBar } from './components/common/ConnectivityBar';
import { OfflineQueueModal } from './components/common/OfflineQueueModal';
import { AuditLogDrawer } from './components/common/AuditLogDrawer';
import { ReunificationModal } from './components/common/ReunificationModal';
import { PublicInfoModal } from './components/common/PublicInfoModal';

// Portals
import { FamilyPortal } from './components/portals/family/FamilyPortal';
import { PublicServicePortal } from './components/portals/publicService/PublicServicePortal';
import { PrivateOrgPortal } from './components/portals/privateOrg/PrivateOrgPortal';
import { GovernmentPortal } from './components/portals/government/GovernmentPortal';

import { Shield, Info, PhoneCall, Radio, Heart } from 'lucide-react';
import { AuthScreen } from './components/auth/AuthScreen';

const AppContent: React.FC = () => {
  const { isAuthenticated, currentRole, reunionModalCase, closeReunionModal } = useAypo();

  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isAuditLogsOpen, setIsAuditLogsOpen] = useState(false);
  const [isPublicInfoOpen, setIsPublicInfoOpen] = useState(false);

  // If user is not authenticated, display the Login & Registration Gateway
  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen bg-[#070D1E] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        onOpenOfflineQueue={() => setIsQueueOpen(true)}
        onOpenAuditLogs={() => setIsAuditLogsOpen(true)}
      />

      {/* Telemetry & Connectivity Bar */}
      <ConnectivityBar onOpenQueue={() => setIsQueueOpen(true)} />

      {/* Main Role-Based Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentRole === 'FAMILY' && <FamilyPortal />}
        {currentRole === 'PUBLIC_SERVICE' && (
          <PublicServicePortal onOpenQueue={() => setIsQueueOpen(true)} />
        )}
        {currentRole === 'PRIVATE_ORG' && (
          <PrivateOrgPortal onOpenQueue={() => setIsQueueOpen(true)} />
        )}
        {currentRole === 'GOVERNMENT' && (
          <GovernmentPortal
            onOpenAuditLogs={() => setIsAuditLogsOpen(true)}
            onOpenQueue={() => setIsQueueOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#091124] border-t border-slate-800 text-xs text-slate-400 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 font-bold">
              <img src="/aypo-logo.svg" alt="AYPO" className="w-5 h-5 object-contain" />
            </div>
            <div>
              <div className="font-bold text-white flex items-center gap-2">
                <span>AYPO</span>
                <span className="text-[10px] text-cyan-400 uppercase tracking-widest font-mono">
                  DISASTER REUNIFICATION PLATFORM
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-medium">
                National Disaster Management & Civilian Reunification Network • Public Safety Deployment
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => setIsPublicInfoOpen(true)}
              className="text-slate-300 hover:text-cyan-300 font-semibold flex items-center gap-1 transition-colors"
            >
              <Info className="w-3.5 h-3.5 text-cyan-400" /> Platform Architecture
            </button>
            <span>•</span>
            <button
              onClick={() => setIsAuditLogsOpen(true)}
              className="text-slate-300 hover:text-purple-300 font-semibold transition-colors"
            >
              Security Ledger
            </button>
            <span>•</span>
            <span className="text-slate-400 flex items-center gap-1 font-mono">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Offline-First PWA Active</span>
            </span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <OfflineQueueModal
        isOpen={isQueueOpen}
        onClose={() => setIsQueueOpen(false)}
      />

      <AuditLogDrawer
        isOpen={isAuditLogsOpen}
        onClose={() => setIsAuditLogsOpen(false)}
      />

      <PublicInfoModal
        isOpen={isPublicInfoOpen}
        onClose={() => setIsPublicInfoOpen(false)}
      />

      <ReunificationModal
        isOpen={!!reunionModalCase}
        caseRecord={reunionModalCase}
        onClose={closeReunionModal}
      />
    </div>
  );
};

export default function App() {
  return (
    <AypoProvider>
      <AppContent />
    </AypoProvider>
  );
}
