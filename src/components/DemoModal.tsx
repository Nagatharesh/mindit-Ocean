import React, { useState, useEffect } from 'react';
import { X, Play, RotateCcw, CheckCircle2, ShieldCheck, ChevronRight } from 'lucide-react';
import { playHoverTick, playSonarPing } from '../utils/audio';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  soundEnabled: boolean;
}

interface SimStep {
  agent: string;
  icon: string;
  role: string;
  timestamp: string;
  action: string;
  output: string;
  verified: boolean;
  hash: string;
}

export const DemoModal: React.FC<DemoModalProps> = ({ isOpen, onClose, soundEnabled }) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const simulationSteps: SimStep[] = [
    {
      agent: 'SENTINEL',
      icon: '🛡️',
      role: 'Sensor Ingestion & Defense',
      timestamp: '00:00.124',
      action: 'INGEST_BUOY_TELEMETRY',
      output: 'Buoy #44013 payload signature valid. SST: 30.42°C, DHW: 9.21 °C-weeks. 0 adversarial anomalies detected.',
      verified: true,
      hash: '0x9a8f...3e12',
    },
    {
      agent: 'OCEANOGRAPHER',
      icon: '🌊',
      role: 'Hydrodynamic Analysis',
      timestamp: '00:00.342',
      action: 'CALCULATE_ISOTHERM_COLLAPSE',
      output: 'Thermocline suppressed from 28m to 42m. Vertical mixing velocity reduced by 64% due to slack winds.',
      verified: true,
      hash: '0xb214...8c90',
    },
    {
      agent: 'ECOLOGIST',
      icon: '🐠',
      role: 'Trophic Web Evaluation',
      timestamp: '00:00.618',
      action: 'MODEL_ZOOXANTHELLAE_LOSS',
      output: 'Thermal stress exceeds Acropora palmata bleaching threshold. Projected mortality without intervention: 68%.',
      verified: true,
      hash: '0x4f77...11aa',
    },
    {
      agent: 'SKEPTIC',
      icon: '🧐',
      role: 'Adversarial Falsification',
      timestamp: '00:00.890',
      action: 'CHALLENGE_HYPOTHESIS_EDGES',
      output: 'Counter-tested against 2016 historical El Niño backtest. Correlation p-value: 0.00041. Hypothesis sustained.',
      verified: true,
      hash: '0x77c2...5b34',
    },
    {
      agent: 'STRATEGIST',
      icon: '🧭',
      role: 'Intervention Sandbox',
      timestamp: '00:01.205',
      action: 'SIMULATE_MICRO_UPWELLING',
      output: 'Tested artificial mist shade curtain + solar bubble upwelling. Predicted thermal reduction: -1.3°C. Survival improves +41%.',
      verified: true,
      hash: '0x10ee...982a',
    },
    {
      agent: 'SYNTHESIZER',
      icon: '📡',
      role: 'Cryptographic Audit & Cascade',
      timestamp: '00:01.512',
      action: 'ATTEST_FINAL_DIRECTED_GRAPH',
      output: 'Audit chain compiled. Directed acyclic graph sealed with 6/6 agent signatures. Action recommendation dispatches.',
      verified: true,
      hash: '0xae31...ff49',
    },
  ];

  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const timer = setInterval(() => {
      setCurrentStepIdx((prev) => {
        if (prev < simulationSteps.length - 1) {
          playHoverTick(soundEnabled);
          return prev + 1;
        } else {
          setIsPlaying(false);
          return prev;
        }
      });
    }, 1400);

    return () => clearInterval(timer);
  }, [isOpen, isPlaying, simulationSteps.length, soundEnabled]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="demo-modal-title"
      className="fixed inset-0 z-[9000] flex items-center justify-center p-4 sm:p-6 bg-[#02060D]/85 backdrop-blur-md"
    >
      <div
        className="bracket-panel w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden bg-[#07121F]/95 shadow-[0_0_50px_rgba(63,245,230,0.2)] animate-in fade-in zoom-in-95 duration-300"
        data-readout="INTERACTIVE REASONING SIMULATOR"
      >
        <span className="bracket-corner-tr" />
        <span className="bracket-corner-bl" />

        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(63,245,230,0.18)] bg-[#02060D]/60 select-none">
          <div className="flex items-center gap-3">
            <span className="text-xl">🛰️</span>
            <div>
              <h2 id="demo-modal-title" className="text-base sm:text-lg font-bold text-[#E6F1FF] font-heading flex items-center gap-2">
                <span>SIMULATION RUN · GULF OF MANNAR</span>
                <span className="text-xs font-mono font-normal text-[#3FF5E6] border border-[#3FF5E6]/30 px-1.5 py-0.5">
                  EVENT #MHW-2026-09
                </span>
              </h2>
              <div className="font-mono text-[10px] text-[#7A8CA3] tracking-wider uppercase">
                LAT: 09.12°N · LON: 79.13°E · PHYSICS ENGINE ACTIVE
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setCurrentStepIdx(0);
                setIsPlaying(true);
                playSonarPing(soundEnabled);
              }}
              onMouseEnter={() => playHoverTick(soundEnabled)}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-[#A6C0DE] hover:text-[#3FF5E6] border border-[rgba(63,245,230,0.2)] hover:border-[#3FF5E6] cursor-pointer transition-colors"
              title="Restart Simulation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">REPLAY</span>
            </button>

            <button
              onClick={() => {
                playHoverTick(soundEnabled);
                onClose();
              }}
              className="p-1.5 text-[#7A8CA3] hover:text-[#FF5A5F] border border-transparent hover:border-[#FF5A5F]/40 cursor-pointer transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Agent Timeline & Log Output */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Progress bar across 6 agents */}
          <div className="grid grid-cols-6 gap-2 pb-2">
            {simulationSteps.map((s, idx) => (
              <button
                key={s.agent}
                onClick={() => {
                  setCurrentStepIdx(idx);
                  setIsPlaying(false);
                  playHoverTick(soundEnabled);
                }}
                className={`flex flex-col items-center py-2 px-1 border transition-all text-center cursor-pointer ${
                  idx <= currentStepIdx
                    ? 'border-[#3FF5E6] bg-[#3FF5E6]/10 text-[#3FF5E6]'
                    : 'border-[rgba(63,245,230,0.12)] text-[#7A8CA3] bg-[#02060D]/40'
                }`}
              >
                <span className="text-base sm:text-lg mb-1">{s.icon}</span>
                <span className="font-mono text-[9px] font-bold tracking-tighter truncate w-full">
                  {s.agent}
                </span>
              </button>
            ))}
          </div>

          {/* Active Step Detailed Inspector */}
          <div className="bracket-panel p-5 bg-[#02060D]/70 border border-[#3FF5E6]/40">
            <span className="bracket-corner-tr" />
            <span className="bracket-corner-bl" />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 mb-3 border-b border-[rgba(63,245,230,0.15)] gap-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{simulationSteps[currentStepIdx].icon}</span>
                <div>
                  <div className="font-mono text-sm font-bold text-[#3FF5E6] tracking-wide flex items-center gap-2">
                    <span>AGENT: {simulationSteps[currentStepIdx].agent}</span>
                    <span className="text-[10px] text-[#4ADE80] font-normal flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[#4ADE80]" />
                      SIMULATOR ATTESTED
                    </span>
                  </div>
                  <div className="text-xs text-[#A6C0DE]">
                    {simulationSteps[currentStepIdx].role}
                  </div>
                </div>
              </div>

              <div className="font-mono text-xs text-[#7A8CA3] flex items-center gap-3">
                <span>TIME: {simulationSteps[currentStepIdx].timestamp}</span>
                <span className="text-[#3FF5E6]">
                  HASH: {simulationSteps[currentStepIdx].hash}
                </span>
              </div>
            </div>

            {/* Terminal log output */}
            <div className="font-mono text-xs text-[#E6F1FF] leading-relaxed bg-[#02060D] p-3.5 border border-[rgba(63,245,230,0.15)] mb-3">
              <div className="text-[#7A8CA3] text-[10px] mb-1">
                // ACTION: {simulationSteps[currentStepIdx].action}
              </div>
              <p className="text-[#3FF5E6]">{simulationSteps[currentStepIdx].output}</p>
            </div>

            {/* Physics Validation Rule Citation */}
            <div className="flex items-center justify-between font-mono text-[11px] text-[#7A8CA3] pt-1">
              <span className="flex items-center gap-1.5 text-[#4ADE80]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#4ADE80]" />
                Thermodynamic Law Conservation: Validated (ΔE = 0)
              </span>
              <span className="text-xs text-[#A6C0DE]">
                Step {currentStepIdx + 1} of {simulationSteps.length}
              </span>
            </div>
          </div>

          {/* Historical Log Stream */}
          <div className="space-y-2">
            <div className="font-mono text-[10px] text-[#7A8CA3] tracking-widest uppercase">
              AGENT EXECUTION LOGS
            </div>
            {simulationSteps.slice(0, currentStepIdx + 1).map((s, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 bg-[#02060D]/40 border border-[rgba(63,245,230,0.1)] text-xs font-mono"
              >
                <div className="flex items-center gap-2">
                  <span>{s.icon}</span>
                  <span className="text-[#3FF5E6] font-semibold">{s.agent}</span>
                  <span className="text-[#7A8CA3]">·</span>
                  <span className="text-[#A6C0DE] truncate max-w-[280px] sm:max-w-md">
                    {s.action}
                  </span>
                </div>
                <div className="text-[10px] text-[#4ADE80] flex items-center gap-1 shrink-0">
                  <span>VERIFIED</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-[rgba(63,245,230,0.18)] bg-[#02060D]/80 flex items-center justify-between select-none">
          <button
            onClick={() => {
              setIsPlaying(!isPlaying);
              playHoverTick(soundEnabled);
            }}
            className="flex items-center gap-2 px-4 py-2 border border-[#3FF5E6] text-[#3FF5E6] font-mono text-xs tracking-wider uppercase hover:bg-[#3FF5E6]/10 cursor-pointer transition-colors"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{isPlaying ? 'PAUSE RUN' : 'RESUME RUN'}</span>
          </button>

          <button
            onClick={() => {
              playHoverTick(soundEnabled);
              onClose();
            }}
            className="px-5 py-2 bg-[#3FF5E6] text-[#02060D] font-mono font-bold text-xs tracking-wider uppercase hover:bg-[#68FFF3] cursor-pointer transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
