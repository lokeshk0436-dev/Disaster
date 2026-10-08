import React from 'react';
import { useAypo } from '../../context/AypoContext';
import { Wifi, WifiOff, RefreshCw, Database, Radio, ArrowRight } from 'lucide-react';

export const ConnectivityBar: React.FC<{ onOpenQueue: () => void }> = ({ onOpenQueue }) => {
  const { connectivity, setConnectivity, syncQueue, triggerSync } = useAypo();

  return (
    <div className="w-full bg-slate-900/90 border-b border-slate-800 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3">
      {/* Status telemetry */}
      <div className="flex items-center gap-3">
        {connectivity === 'ONLINE' && (
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400 animate-pulse"></span>
            <span>🟢 ONLINE — CENTRAL UPLINK ACTIVE</span>
          </div>
        )}

        {connectivity === 'OFFLINE' && (
          <div className="flex items-center gap-2 text-rose-400 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500 animate-ping"></span>
            <span>🔴 OFFLINE MODE — NO-TOWER BLACKOUT (INDEXEDDB ACTIVE)</span>
          </div>
        )}

        {connectivity === 'SYNCING' && (
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
            <span>🟡 SYNCING... UPLOADING PENDING RECORDS TO REUNIFICATION DATABASE</span>
          </div>
        )}

        {syncQueue.length > 0 && (
          <button
            onClick={onOpenQueue}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 font-semibold hover:bg-blue-500/30 transition-colors"
          >
            <Database className="w-3 h-3 text-cyan-400" />
            <span>🔵 {syncQueue.length} record{syncQueue.length > 1 ? 's' : ''} waiting in local sync queue</span>
            <ArrowRight className="w-3 h-3 text-cyan-300" />
          </button>
        )}
      </div>

      {/* Field Network Telemetry Controls */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-slate-400 font-mono uppercase tracking-wider hidden sm:inline">Telemetry Environment:</span>
        <button
          onClick={() => setConnectivity('ONLINE')}
          disabled={connectivity === 'ONLINE'}
          className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all ${
            connectivity === 'ONLINE'
              ? 'bg-emerald-600 text-white shadow'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          Online
        </button>
        <button
          onClick={() => setConnectivity('OFFLINE')}
          disabled={connectivity === 'OFFLINE'}
          className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all ${
            connectivity === 'OFFLINE'
              ? 'bg-rose-600 text-white shadow'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          No-Tower Offline
        </button>
        {syncQueue.length > 0 && (
          <button
            onClick={triggerSync}
            className="px-2 py-1 rounded-md text-[11px] font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" /> Sync Queue Now
          </button>
        )}
      </div>
    </div>
  );
};
