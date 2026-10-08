import React from 'react';
import { useAypo } from '../../context/AypoContext';
import { 
  Menu,
  Activity
} from 'lucide-react';

interface NavbarProps {
  onOpenOfflineQueue: () => void;
  onOpenAuditLogs: () => void;
  onOpenHelplines?: () => void;
  onOpenVoiceAssistant?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenVoiceAssistant
}) => {
  const {
    logout,
    isEmergencyMode,
    toggleEmergencyMode,
  } = useAypo();

  return (
    <header className="w-full z-50 bg-transparent pt-6 pb-4 px-6 sm:px-12 flex items-center justify-between border-b border-gray-100">
      
      {/* Brand & Tagline */}
      <div className="flex items-center gap-3 flex-shrink-0 cursor-pointer">
        <div className="w-9 h-9 bg-gray-900 rounded-xl flex items-center justify-center text-white shadow-md">
           <Activity className="w-5 h-5" />
        </div>
        <span className="text-xl font-extrabold tracking-tight text-gray-900">AYPO</span>
      </div>

      {/* Center Nav Links (High Contrast) */}
      <div className="hidden md:flex items-center gap-10 text-[15px] font-bold text-black">
         <a href="#portals" className="cursor-pointer hover:text-blue-600 transition-colors">Portals</a>
         <a href="#dashboards" className="cursor-pointer hover:text-blue-600 transition-colors">Dashboards</a>
         <a href="#agencies" className="cursor-pointer hover:text-blue-600 transition-colors">Agencies</a>
         <a href="#resources" className="cursor-pointer hover:text-blue-600 transition-colors">Resources</a>
      </div>

      {/* Right Action Bar */}
      <div className="flex items-center gap-4">
        
        {/* SOS Toggle */}
        <button
          onClick={toggleEmergencyMode}
          className={`hidden sm:flex items-center px-4 py-2 text-sm font-semibold rounded-full transition-all ${
            isEmergencyMode 
              ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {isEmergencyMode ? 'SOS Active' : 'SOS Mode'}
        </button>

        {/* AI Copilot */}
        {onOpenVoiceAssistant && (
          <button
            onClick={onOpenVoiceAssistant}
            className="hidden lg:flex items-center px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-full transition-all"
          >
            AI Copilot
          </button>
        )}

        {/* Sign Out (Solid Sleek Button) */}
        <button
          onClick={logout}
          className="flex items-center px-5 py-2 text-sm font-semibold bg-gray-900 text-white rounded-full hover:bg-gray-800 shadow-md transition-all"
        >
          Sign Out
        </button>

        {/* Mobile Menu Icon */}
        <button className="md:hidden p-2 text-gray-600 hover:text-gray-900">
          <Menu className="w-5 h-5" />
        </button>

      </div>
    </header>
  );
};
