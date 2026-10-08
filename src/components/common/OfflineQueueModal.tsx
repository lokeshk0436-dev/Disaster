import React from 'react';
import { useAypo } from '../../context/AypoContext';
import { Database, RefreshCw, X, CheckCircle, Clock, ShieldAlert } from 'lucide-react';

export const OfflineQueueModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { syncQueue, triggerSync, connectivity } = useAypo();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-[#0B142E] border border-cyan-500/40 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/20 text-cyan-400 border border-blue-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Offline IndexedDB Synchronization Queue
              </h2>
              <p className="text-xs text-slate-400">
                Records captured in disconnected disaster zones waiting for network uplink
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Queue Items List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {syncQueue.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3 opacity-80" />
              <div className="text-sm font-bold text-slate-300">Sync Queue Clear</div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                All field captures and triage updates are synchronized with the central AYPO cloud ledger.
              </p>
            </div>
          ) : (
            syncQueue.map((item, idx) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-950 text-cyan-400 font-bold flex items-center justify-center border border-cyan-800 text-[11px]">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-2 font-bold text-slate-200">
                      <span className="text-cyan-300">{item.action}</span>
                      <span className="text-slate-500 font-mono text-[10px]">{item.id}</span>
                    </div>
                    <div className="text-slate-400 mt-1">
                      {item.payload?.personName ? (
                        <span>
                          Target: <strong className="text-white">{item.payload.personName}</strong> (
                          {item.payload.id || 'Pending ID'})
                        </span>
                      ) : (
                        <span>Target Case: {item.payload?.caseId || 'Direct Update'}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1 font-mono">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>Captured locally at {item.timestamp}</span>
                      <span>•</span>
                      <span>Retry Attempts: {item.retryCount}</span>
                    </div>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {item.status}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/40 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Network State: <strong className={connectivity === 'ONLINE' ? 'text-emerald-400' : 'text-rose-400'}>{connectivity}</strong>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
            {syncQueue.length > 0 && (
              <button
                onClick={async () => {
                  await triggerSync();
                  onClose();
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Upload & Sync All ({syncQueue.length})</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
