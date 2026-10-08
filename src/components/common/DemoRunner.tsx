import React, { useState } from 'react';
import { useAypo } from '../../context/AypoContext';
import { Play, RotateCcw, CheckCircle2, ChevronRight, Sparkles, Radio, Zap } from 'lucide-react';

export const DemoRunner: React.FC = () => {
  const { demoStep, setDemoStep, advanceDemoStep, resetDemo } = useAypo();
  const [isMinimized, setIsMinimized] = useState(false);

  const steps = [
    {
      num: 1,
      title: 'Disaster Inception',
      desc: 'Cyclone & flood alert triggered in Zone 4. Incident Command initializes emergency registry.',
      portal: 'GOVERNMENT',
      actionLabel: 'Report Missing Family Member'
    },
    {
      num: 2,
      title: 'Family Report Filed',
      desc: 'Anita Kumar reports Raj Kumar (24M, scar on eyebrow) missing via Family Portal (Case AY-2026-000124).',
      portal: 'FAMILY',
      actionLabel: 'Enter No-Tower Disaster Zone'
    },
    {
      num: 3,
      title: 'No-Tower Blackout',
      desc: 'Rescue team enters disaster sector with zero internet/cellular. AYPO switches to OFFLINE MODE.',
      portal: 'PUBLIC_SERVICE',
      actionLabel: 'Register Rescued Person Offline'
    },
    {
      num: 4,
      title: 'Offline Field Registration',
      desc: 'Worker registers rescued male at Relief Centre 03. Saved locally into IndexedDB queue with Case ID.',
      portal: 'PUBLIC_SERVICE',
      actionLabel: 'Return to Connected Outpost'
    },
    {
      num: 5,
      title: 'Connectivity Restored',
      desc: 'Field team reaches satellite basecamp. AYPO detects cellular signal and restores CONNECTIVITY.',
      portal: 'PUBLIC_SERVICE',
      actionLabel: 'Auto-Synchronize Records'
    },
    {
      num: 6,
      title: 'Database Auto-Sync',
      desc: 'Local sync queue safely commits field records to central database with zero data loss.',
      portal: 'PUBLIC_SERVICE',
      actionLabel: 'Run AI Match Evaluation'
    },
    {
      num: 7,
      title: 'AI Matches 91%',
      desc: 'AI compares phonetic name, age (24 vs 25), gender, eyebrow scar, and location. Flags 91% match.',
      portal: 'GOVERNMENT',
      actionLabel: 'Authority Verify Match'
    },
    {
      num: 8,
      title: 'Government Verification',
      desc: 'Disaster Commissioner reviews evidence and signs official verification (Human-in-the-loop).',
      portal: 'GOVERNMENT',
      actionLabel: 'Transmit Family Alert'
    },
    {
      num: 9,
      title: 'Family Receives Alert',
      desc: 'Anita receives high-priority dispatch: "Your family member verified at Relief Centre 03".',
      portal: 'FAMILY',
      actionLabel: 'Confirm Family Reunification'
    },
    {
      num: 10,
      title: 'Reunification Climax',
      desc: 'Family confirms identity at shelter. Official Case Status: REUNITED! Confetti & celebratory fanfare.',
      portal: 'FAMILY',
      actionLabel: 'Restart Operational Scenario'
    }
  ];

  const current = steps[demoStep - 1];

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-4 py-2.5 rounded-full font-bold shadow-2xl border border-cyan-400/40 text-xs transition-all hover:scale-105"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Operational Simulation ({demoStep}/10)</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-lg w-full px-4 sm:px-0">
      <div className="bg-[#0B1530]/95 backdrop-blur-xl border border-cyan-500/40 rounded-2xl p-4 shadow-2xl shadow-cyan-900/40">
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-700/60">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 font-bold text-xs border border-cyan-400/30">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            </span>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                AYPO Crisis Response Lifecycle Simulation
              </div>
              <div className="text-[10px] text-slate-400">
                Step {demoStep} of 10: <strong className="text-white">{current.title}</strong>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={resetDemo}
              className="text-slate-400 hover:text-amber-400 p-1 rounded-md transition-colors text-xs flex items-center gap-1"
              title="Reset Story to Step 1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsMinimized(true)}
              className="text-slate-400 hover:text-white px-1.5 py-0.5 rounded text-xs"
              title="Minimize panel"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Step Progress Dots */}
        <div className="flex items-center justify-between gap-1 mb-3">
          {steps.map(s => {
            const isCompleted = s.num < demoStep;
            const isCurrent = s.num === demoStep;
            return (
              <button
                key={s.num}
                onClick={() => setDemoStep(s.num)}
                className={`flex-1 h-1.5 rounded-full transition-all ${
                  isCurrent
                    ? 'bg-cyan-400 shadow-md shadow-cyan-400/80'
                    : isCompleted
                    ? 'bg-emerald-500'
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
                title={`Jump to Step ${s.num}: ${s.title}`}
              />
            );
          })}
        </div>

        {/* Narrative Description */}
        <p className="text-xs text-slate-200 mb-3.5 leading-relaxed bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
          {current.desc}
        </p>

        {/* Actions & Portal Badge */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
            <span>Context:</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-800 text-cyan-300 font-bold border border-slate-700 text-[10px]">
              {current.portal} PORTAL
            </span>
          </div>

          <button
            onClick={advanceDemoStep}
            className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white px-3.5 py-1.5 rounded-xl font-bold text-xs shadow-lg shadow-blue-600/30 transition-all hover:scale-102 active:scale-98"
          >
            <span>{current.actionLabel}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
