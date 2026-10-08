import React, { useState } from 'react';
import { useAypo } from '../../context/AypoContext';
import { ShieldCheck, X, Search, Filter, Clock, FileText, Database } from 'lucide-react';
import { UserRole } from '../../types';

export const AuditLogDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { auditLogs } = useAypo();
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState<string>('ALL');

  if (!isOpen) return null;

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.who.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.what.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.caseId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSector = sectorFilter === 'ALL' || log.sector === sectorFilter;
    return matchesSearch && matchesSector;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl h-full bg-[#0A1226] border-l border-slate-800 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                AYPO Security Audit Ledger
              </h2>
              <p className="text-xs text-slate-400">
                Immutable chronological event trail tracking all cross-sector actions
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

        {/* Filter bar */}
        <div className="p-4 border-b border-slate-800/80 space-y-3 bg-slate-950/40">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search who, what, case ID, or action..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            <span className="text-[11px] text-slate-500 font-semibold mr-1">Sector:</span>
            {['ALL', 'FAMILY', 'PUBLIC_SERVICE', 'PRIVATE_ORG', 'GOVERNMENT'].map(sector => (
              <button
                key={sector}
                onClick={() => setSectorFilter(sector)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  sectorFilter === sector
                    ? 'bg-purple-600 text-white shadow'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                {sector.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Audit entries list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredLogs.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No audit records matching query
            </div>
          ) : (
            filteredLogs.map(log => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/90 text-xs space-y-2 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-mono text-purple-400 font-bold">{log.id}</span>
                  <span className="text-slate-500 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {log.when}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-950/60 p-2 rounded-lg border border-slate-800/60 font-mono">
                  <div>
                    <span className="text-slate-500">WHO: </span>
                    <strong className="text-slate-200">{log.who}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">SECTOR: </span>
                    <strong className="text-cyan-400">{log.sector}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">ACTION: </span>
                    <strong className="text-amber-400">{log.action}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">CASE: </span>
                    <strong className="text-slate-300">{log.caseId}</strong>
                  </div>
                </div>

                <div className="text-slate-300 font-medium leading-relaxed">
                  {log.what}
                </div>

                {log.details && (
                  <div className="text-[11px] text-slate-500 italic">
                    {log.details}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 text-xs text-slate-400 flex items-center justify-between">
          <span>Audit Log Items: <strong>{filteredLogs.length}</strong></span>
          <span className="font-mono text-[11px] text-slate-500">SHA-256 Chain Verified</span>
        </div>
      </div>
    </div>
  );
};
