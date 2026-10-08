import React from 'react';
import { TimelineEvent } from '../../types';
import { Clock, CheckCircle2, ShieldCheck, MapPin, User, AlertCircle } from 'lucide-react';

export const CaseTimeline: React.FC<{ timeline: TimelineEvent[] }> = ({ timeline }) => {
  return (
    <div className="space-y-4">
      <div className="relative pl-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-cyan-500 before:via-blue-500 before:to-emerald-500">
        {timeline.map((event, idx) => {
          const isLatest = idx === timeline.length - 1;
          const isReunited = event.title.includes('REUNITED') || event.title.includes('Reunification');
          const isVerified = event.title.includes('Verified') || event.title.includes('VERIFIED');

          return (
            <div key={event.id || idx} className="relative pb-6 last:pb-1 group">
              {/* Timeline marker node */}
              <div
                className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all ${
                  isReunited
                    ? 'bg-emerald-500 border-white text-slate-950 shadow-md shadow-emerald-500/50 scale-110'
                    : isVerified
                    ? 'bg-cyan-500 border-white text-slate-950 shadow-md shadow-cyan-500/50'
                    : isLatest
                    ? 'bg-blue-600 border-cyan-400 text-white'
                    : 'bg-slate-800 border-slate-600 text-slate-400'
                }`}
              >
                {isReunited ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : isVerified ? (
                  <ShieldCheck className="w-3.5 h-3.5" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                )}
              </div>

              {/* Event card */}
              <div
                className={`p-3.5 rounded-xl border transition-all ${
                  isReunited
                    ? 'bg-emerald-950/40 border-emerald-500/50 shadow-lg shadow-emerald-900/20'
                    : isVerified
                    ? 'bg-cyan-950/40 border-cyan-500/40 shadow-lg shadow-cyan-900/20'
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold ${
                        isReunited ? 'text-emerald-300' : isVerified ? 'text-cyan-300' : 'text-white'
                      }`}
                    >
                      {event.title}
                    </span>
                    {event.badge && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {event.badge}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{event.timestamp}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-2">
                  {event.description}
                </p>

                <div className="flex items-center gap-2 text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
                  <span className="flex items-center gap-1 font-semibold text-slate-300">
                    <User className="w-3 h-3 text-slate-500" /> {event.actor}
                  </span>
                  <span>•</span>
                  <span className="text-cyan-400 font-mono font-medium">{event.sector}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
