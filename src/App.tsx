import React, { useState } from 'react';
import { AypoProvider, useAypo } from './context/AypoContext';
import { Navbar } from './components/common/Navbar';
import { ConnectivityBar } from './components/common/ConnectivityBar';
import { OfflineQueueModal } from './components/common/OfflineQueueModal';
import { AuditLogDrawer } from './components/common/AuditLogDrawer';
import { ReunificationModal } from './components/common/ReunificationModal';
import { PublicInfoModal } from './components/common/PublicInfoModal';
import { EmergencyFooter } from './components/common/EmergencyFooter';
import { HelplinesDrawer } from './components/common/HelplinesDrawer';
import { AypoVoiceAssistant } from './components/common/AypoVoiceAssistant';
import { LanguageSelector } from './components/common/LanguageSelector';

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
  const [isHelplinesOpen, setIsHelplinesOpen] = useState(false);
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);

  // If user is not authenticated, display the Login & Registration Gateway
  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen bg-dot-grid text-gray-900 flex flex-col font-sans selection:bg-blue-500 selection:text-white">


      {/* Telemetry & Connectivity Bar */}
      <ConnectivityBar onOpenQueue={() => setIsQueueOpen(true)} />

      {/* Main Role-Based Content Area */}
      <main id="portals" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 scroll-mt-24">
        {currentRole === 'FAMILY' && (
          <FamilyPortal
            onOpenHelplines={() => setIsHelplinesOpen(true)}
            onOpenVoiceAssistant={() => setIsVoiceAssistantOpen(true)}
          />
        )}
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

      {/* High-Contrast Tactical Emergency Footer */}
      <EmergencyFooter
        onOpenPublicInfo={() => setIsPublicInfoOpen(true)}
        onOpenAuditLogs={() => setIsAuditLogsOpen(true)}
        onOpenHelplines={() => setIsHelplinesOpen(true)}
        onOpenVoiceAssistant={() => setIsVoiceAssistantOpen(true)}
      />

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

      {/* 24/7 Helplines & Disaster Insights Drawer */}
      <HelplinesDrawer
        isOpen={isHelplinesOpen}
        onClose={() => setIsHelplinesOpen(false)}
      />

      {/* Siri / Gemini AI Voice Assistant */}
      <AypoVoiceAssistant
        isOpen={isVoiceAssistantOpen}
        onOpen={() => setIsVoiceAssistantOpen(true)}
        onClose={() => setIsVoiceAssistantOpen(false)}
        onOpenHelplines={() => setIsHelplinesOpen(true)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AypoProvider>
      <LanguageSelector />
      <AppContent />
    </AypoProvider>
  );
}
