import React, { useState } from 'react';
import { useAypo } from '../../context/AypoContext';
import { UserRole } from '../../types';
import { 
  Shield, 
  Users, 
  Ambulance, 
  Building2, 
  Landmark, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  AlertTriangle, 
  Bell, 
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  Layers,
  PhoneCall,
  Sparkles,
  Database,
  LogOut
} from 'lucide-react';

interface NavbarProps {
  onOpenOfflineQueue: () => void;
  onOpenAuditLogs: () => void;
  onOpenHelplines?: () => void;
  onOpenVoiceAssistant?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenOfflineQueue,
  onOpenAuditLogs,
  onOpenHelplines,
  onOpenVoiceAssistant
}) => {
  const {
    currentRole,
    currentUser,
    setRole,
    logout,
    connectivity,
    setConnectivity,
    syncQueue,
    triggerSync,
    isEmergencyMode,
    toggleEmergencyMode,
    notifications,
    unreadNotifCount,
    markNotificationRead,
    resetDemo
  } = useAypo();

  const [showNotifMenu, setShowNotifMenu] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#0A1226]/95 backdrop-blur-md border-b border-slate-800/80 shadow-xl">
      {/* Top Emergency Ticker */}
      <div className="bg-gradient-to-r from-cyan-950/60 via-blue-950/40 to-slate-950/60 border-b border-cyan-800/30 px-4 py-1 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <span className="text-cyan-400 font-bold uppercase tracking-wider text-[11px]">Active Emergency Directive:</span>
          <span className="text-slate-300 hidden sm:inline">Cyclone Vardah Response — Zone 4 Incident Command Active</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-400 font-mono text-[11px]">AYPO CORE PROTOCOL v2.6.4</span>
          <button
            onClick={onOpenAuditLogs}
            className="text-slate-400 hover:text-cyan-300 text-[11px] font-semibold transition-colors flex items-center gap-1"
          >
            <Database className="w-3 h-3 text-cyan-400" /> Audit Ledger
          </button>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-400/40 shadow-lg shadow-cyan-500/10">
            <img src="/aypo-logo.svg" alt="AYPO" className="w-6 h-6 object-contain" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
                AYPO
              </span>
              <span className="hidden md:inline text-[10px] uppercase font-bold tracking-widest text-cyan-400/90 border border-cyan-500/30 px-1.5 py-0.5 rounded">
                Unified Platform
              </span>
            </div>
            <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              CONNECT. VERIFY. REUNITE.
            </div>
          </div>
        </div>

        {/* Active Dedicated Portal Badge (Strict Single Portal View - Remaining Portals Hidden) */}
        <div className="flex items-center gap-2.5">
          {currentRole === 'FAMILY' && (
            <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-sky-950/70 border border-sky-400/40 text-sky-200 shadow-md shadow-sky-950/50">
              <div className="w-7 h-7 rounded-lg bg-sky-500/20 border border-sky-400/50 flex items-center justify-center text-sky-300">
                <Users className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-black tracking-wide text-white flex items-center gap-1.5">
                  <span>Family Reunification Portal</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                </div>
                <div className="text-[10px] text-sky-400/90 font-mono font-semibold">
                  CITIZEN DESK • UNCLASSIFIED PUBLIC CLEARANCE
                </div>
              </div>
            </div>
          )}

          {currentRole === 'PUBLIC_SERVICE' && (
            <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-emerald-950/70 border border-emerald-400/40 text-emerald-200 shadow-md shadow-emerald-950/50">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-300">
                <Ambulance className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-black tracking-wide text-white flex items-center gap-1.5">
                  <span>Public Service & Hospital Command</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="text-[10px] text-emerald-400/90 font-mono font-semibold">
                  LEVEL-2 MEDICAL & SHELTER INTAKE CUSTODY
                </div>
              </div>
            </div>
          )}

          {currentRole === 'PRIVATE_ORG' && (
            <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-amber-950/70 border border-amber-400/40 text-amber-200 shadow-md shadow-amber-950/50">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-black tracking-wide text-white flex items-center gap-1.5">
                  <span>Private Org & NGO Relief Operations</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                </div>
                <div className="text-[10px] text-amber-400/90 font-mono font-semibold">
                  HUMANITARIAN RELIEF CLEARANCE • FIELD LOGISTICS
                </div>
              </div>
            </div>
          )}

          {currentRole === 'GOVERNMENT' && (
            <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-purple-950/70 border border-purple-400/40 text-purple-200 shadow-md shadow-purple-950/50">
              <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-400/50 flex items-center justify-center text-purple-300">
                <Landmark className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-black tracking-wide text-white flex items-center gap-1.5">
                  <span>State Emergency Incident Command (SEOC)</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                </div>
                <div className="text-[10px] text-purple-400/90 font-mono font-semibold">
                  LEVEL-4 CENTRAL VERIFICATION & MERGE AUTHORITY
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-3">
          {/* Offline Sync & Connectivity Pill */}
          <div className="flex items-center">
            {connectivity === 'ONLINE' ? (
              <button
                onClick={() => setConnectivity('OFFLINE')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all"
                title="Click to toggle simulated No-Tower Offline mode"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="hidden sm:inline">ONLINE</span>
              </button>
            ) : connectivity === 'OFFLINE' ? (
              <button
                onClick={() => setConnectivity('ONLINE')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 transition-all animate-pulse"
                title="Simulating No-Tower blackout. Click to restore online connectivity"
              >
                <WifiOff className="w-3.5 h-3.5 text-rose-400" />
                <span>OFFLINE MODE</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                <span>SYNCING...</span>
              </div>
            )}
          </div>

          {/* Offline Queue Badge (if items queued) */}
          {syncQueue.length > 0 && (
            <button
              onClick={onOpenOfflineQueue}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold bg-blue-500 text-white shadow-md hover:bg-blue-600 transition-all animate-bounce"
              title="View queued records waiting for uplink"
            >
              <Database className="w-3 h-3" />
              <span>{syncQueue.length} Queued</span>
            </button>
          )}

          {/* Emergency 24/7 Helplines Quick Trigger */}
          {onOpenHelplines && (
            <button
              onClick={onOpenHelplines}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/40 hover:border-rose-400 transition-all cursor-pointer shadow-sm active:scale-95"
              title="Open 24/7 Emergency Helplines Directory (112, 1078, 108)"
            >
              <PhoneCall className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span className="font-mono text-[11px]">112 SOS</span>
            </button>
          )}

          {/* AI Voice Copilot Trigger */}
          {onOpenVoiceAssistant && (
            <button
              onClick={onOpenVoiceAssistant}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 hover:border-cyan-400 transition-all cursor-pointer shadow-sm active:scale-95"
              title="Launch AI Voice Assistant (Siri / Gemini audio copilot)"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-mono text-[11px]">AI Copilot</span>
            </button>
          )}

          {/* Emergency Mode Toggle */}
          <button
            onClick={toggleEmergencyMode}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              isEmergencyMode
                ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
            }`}
            title="High contrast simplified emergency user interface"
          >
            <AlertTriangle className={`w-3.5 h-3.5 ${isEmergencyMode ? 'text-slate-950' : 'text-amber-400'}`} />
            <span className="hidden md:inline">{isEmergencyMode ? 'SOS MODE ON' : 'SOS Mode'}</span>
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="relative p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-3 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                  <div className="text-xs font-bold text-slate-200">Emergency Dispatches</div>
                  <span className="text-[10px] text-cyan-400 font-semibold">{notifications.length} alerts</span>
                </div>
                <div className="max-h-72 overflow-y-auto space-y-2">
                  {notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                        !n.read
                          ? 'bg-cyan-950/40 border-cyan-500/40 text-slate-200'
                          : 'bg-slate-800/40 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold mb-1">
                        <span className={!n.read ? 'text-cyan-300' : 'text-slate-300'}>{n.title}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{n.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Active User Avatar & Role */}
          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-800 text-xs">
            <div className="w-7 h-7 rounded-full bg-cyan-600/30 border border-cyan-400/40 flex items-center justify-center text-cyan-300 font-bold text-xs">
              {currentUser.name.charAt(0)}
            </div>
            <div className="text-left hidden xl:block">
              <div className="font-semibold text-slate-200 text-xs leading-none">{currentUser.name}</div>
              <div className="text-[10px] text-slate-400 truncate max-w-[130px]">{currentUser.organizationName}</div>
            </div>
            <button
              onClick={logout}
              className="ml-2 px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 border border-rose-500/30 hover:border-rose-400/50 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer shadow-sm active:scale-95"
              title="Sign Out of this portal and return to Portal Selection Gateway"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span className="font-semibold text-[11px]">Sign Out / Switch Portal</span>
            </button>
          </div>

          {/* Quick Demo Reset Button */}
          <button
            onClick={resetDemo}
            className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors"
            title="Reset system to default emergency operations state"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
