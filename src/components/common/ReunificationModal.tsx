import React from 'react';
import { AYPOCase } from '../../types';
import { CheckCircle2, Heart, Award, ShieldCheck, MapPin, X, Share2, Download } from 'lucide-react';

export const ReunificationModal: React.FC<{
  isOpen: boolean;
  caseRecord: AYPOCase | null;
  onClose: () => void;
}> = ({ isOpen, caseRecord, onClose }) => {
  if (!isOpen || !caseRecord) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-gradient-to-b from-[#091E2C] via-[#0B1530] to-[#070D1E] border-2 border-emerald-400/60 rounded-3xl w-full max-w-xl shadow-2xl shadow-emerald-500/20 overflow-hidden relative">
        {/* Glow ambient background rings */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 text-center relative z-10">
          {/* Triumphal Icon Header */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 shadow-xl shadow-emerald-500/30 mb-4 animate-bounce">
            <Heart className="w-10 h-10 fill-emerald-400 text-emerald-400" />
          </div>

          <div className="inline-block px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-black uppercase tracking-wider mb-2">
            Disaster Case Resolved • Official Seal
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
            REUNIFICATION SUCCESSFUL!
          </h2>

          <p className="text-slate-300 text-sm max-w-md mx-auto mb-6">
            The separated family member has been officially verified, secured, and safely reunited through the AYPO Unified Disaster Platform.
          </p>

          {/* Person Card Badge */}
          <div className="bg-slate-900/80 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 text-left mb-6 flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-emerald-400/50 shadow-md flex-shrink-0">
              <img
                src={caseRecord.photoUrl}
                alt={caseRecord.personName}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-emerald-600/90 text-white text-[9px] font-bold text-center py-0.5">
                REUNITED
              </div>
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-cyan-400 font-bold text-xs">{caseRecord.id}</span>
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Authority Certified
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">{caseRecord.personName}</h3>
              <div className="text-xs text-slate-400">
                Age: <strong className="text-slate-200">{caseRecord.age}</strong> • Gender: <strong className="text-slate-200">{caseRecord.gender}</strong>
              </div>
              <div className="text-xs text-slate-300 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>Reunion Location: <strong>{caseRecord.currentLocation}</strong></span>
              </div>
            </div>
          </div>

          {/* Verification Protocol Metadata */}
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800 font-mono mb-6">
            <div>
              <span className="text-slate-500">Family Member: </span>
              <strong className="text-slate-200">{caseRecord.reporterName}</strong>
            </div>
            <div>
              <span className="text-slate-500">Incident Sector: </span>
              <strong className="text-cyan-400">Zone 4 (Central)</strong>
            </div>
            <div>
              <span className="text-slate-500">Security Audit: </span>
              <strong className="text-emerald-400">Biometric & ID Verified</strong>
            </div>
            <div>
              <span className="text-slate-500">Case Protocol: </span>
              <strong className="text-slate-200">AYPO Unified Protocol</strong>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/20 transition-all hover:scale-102"
            >
              Complete Case & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
