import React, { useState } from 'react';
import { Play, Fish, GitBranch } from 'lucide-react';
import { ReplayTree3D } from './ReplayTree3D';
import { DreamFishSimulator } from './DreamFishSimulator';
import { playHoverTick, playSonarPing, playVerifyChime } from '../utils/audio';

interface DreamSectionProps {
  soundEnabled: boolean;
}

export const DreamSection: React.FC<DreamSectionProps> = ({ soundEnabled }) => {
  const [isDreaming, setIsDreaming] = useState<boolean>(false);
  const [activeTimelineStep, setActiveTimelineStep] = useState<number>(6); // all visible by default
  const [dreamRunCount, setDreamRunCount] = useState<number>(1);
  const [selectedBranch, setSelectedBranch] = useState<number>(1);
  const [dreamViewMode, setDreamViewMode] = useState<'ecosystem' | 'tree'>('ecosystem');

  const steps = [
    { num: '1', title: 'ANALYSE', desc: 'Live run stores a reasoning tree' },
    { num: '2', title: 'POOL', desc: 'Tree joins the replay pool' },
    { num: '3', title: 'DREAM', desc: 'Candidate policies replayed on history — zero new LLM calls' },
    { num: '4', title: 'SCORE', desc: 'V = verified accuracy − β₁·calls + β₂·parallelism' },
    { num: '5', title: 'SELECT', desc: 'Current policy always competes → never worse' },
    { num: '6', title: 'REDEPLOY', desc: 'Improved policy runs the next analysis' },
  ];

  const handleRunDream = () => {
    setIsDreaming(true);
    setActiveTimelineStep(0);
    playSonarPing(soundEnabled);

    // Sequential step trigger
    steps.forEach((_, idx) => {
      setTimeout(() => {
        setActiveTimelineStep(idx + 1);
        playHoverTick(soundEnabled);
      }, (idx + 1) * 350);
    });

    setTimeout(() => {
      setIsDreaming(false);
      setSelectedBranch(1);
      setDreamRunCount((prev) => prev + 1);
      playVerifyChime(soundEnabled);
    }, 2400);
  };

  return (
    <section
      id="dream"
      className="relative w-full py-24 sm:py-32 px-4 sm:px-8 lg:px-14 z-20"
      aria-labelledby="dream-heading"
    >
      <div className="max-w-[1480px] mx-auto">
        {/* Section kicker */}
        <div
          className="font-mono text-xs sm:text-sm text-[#3FF5E6] tracking-widest uppercase mb-3 flex items-center gap-2"
          data-readout="SECTION 08 REPLAY-BASED RECURSIVE SELF-IMPROVEMENT"
        >
          <span className="text-[#3FF5E6] font-bold">//</span>
          <span>08 · RECURSIVE SELF-IMPROVEMENT</span>
        </div>

        {/* Heading */}
        <h2
          id="dream-heading"
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#E6F1FF] tracking-tight mb-4 font-heading"
        >
          It gets smarter. <br className="sm:hidden" />
          <span className="text-[#3FF5E6] drop-shadow-[0_0_20px_rgba(63,245,230,0.3)]">
            Only when it's proven.
          </span>
        </h2>
        <p className="text-base sm:text-lg text-[#A6C0DE] max-w-2xl mb-12 font-normal">
          DREAM searches for optimal multi-agent coordination policies through counterfactual replay over frozen historical data, preventing reward-hacking and capability regressions.
        </p>

        {/* Main Grid: Left 3D Tree / Living Fish Ecosystem, Right Timeline Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
          {/* Left: 3D Living Fish Simulator / Replay Tree Canvas */}
          <div className="lg:col-span-6 bracket-panel p-3 sm:p-5 overflow-hidden flex flex-col">
            <span className="bracket-corner-tr" />
            <span className="bracket-corner-bl" />

            {/* Mode Switcher Tabs */}
            <div className="flex items-center gap-2 mb-3 border-b border-[rgba(63,245,230,0.18)] pb-2.5">
              <button
                onClick={() => {
                  playHoverTick(soundEnabled);
                  setDreamViewMode('ecosystem');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs font-bold transition-all ${
                  dreamViewMode === 'ecosystem'
                    ? 'bg-[#3FF5E6] text-[#02060D] shadow-[0_0_12px_rgba(63,245,230,0.3)]'
                    : 'bg-[#07121F] text-[#7A8CA3] hover:text-[#E6F1FF] border border-[rgba(63,245,230,0.2)]'
                }`}
              >
                <Fish className="w-3.5 h-3.5" />
                <span>3D LIVING FISH (TIMING ENGINE)</span>
              </button>
              <button
                onClick={() => {
                  playHoverTick(soundEnabled);
                  setDreamViewMode('tree');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs font-bold transition-all ${
                  dreamViewMode === 'tree'
                    ? 'bg-[#3FF5E6] text-[#02060D] shadow-[0_0_12px_rgba(63,245,230,0.3)]'
                    : 'bg-[#07121F] text-[#7A8CA3] hover:text-[#E6F1FF] border border-[rgba(63,245,230,0.2)]'
                }`}
              >
                <GitBranch className="w-3.5 h-3.5" />
                <span>REPLAY-RSI TREE</span>
              </button>
            </div>

            {dreamViewMode === 'ecosystem' ? (
              <DreamFishSimulator soundEnabled={soundEnabled} />
            ) : (
              <ReplayTree3D isDreaming={isDreaming} selectedBranch={selectedBranch} />
            )}
          </div>

          {/* Right: 6 Compact Timeline Steps & Trigger */}
          <div
            className="lg:col-span-6 bracket-panel p-6 sm:p-8 flex flex-col justify-between"
            data-readout="DREAM-RSI EXECUTION PIPELINE"
          >
            <span className="bracket-corner-tr" />
            <span className="bracket-corner-bl" />

            <div>
              <div className="flex items-center justify-between pb-3 mb-6 border-b border-[rgba(63,245,230,0.14)]">
                <span className="font-mono text-xs text-[#3FF5E6] font-bold tracking-widest uppercase">
                  // RECURSIVE REPLAY CYCLE
                </span>
                <span className="font-mono text-[10px] text-[#4ADE80]">DREAM-RSI PROVED</span>
              </div>

              {/* 6 Steps */}
              <div className="space-y-3.5 mb-8">
                {steps.map((st, i) => {
                  const isReached = activeTimelineStep >= i + 1;
                  return (
                    <div
                      key={st.num}
                      className={`flex items-start gap-3 p-2.5 transition-all duration-300 ${
                        isReached
                          ? 'bg-[#071626]/80 border-l-2 border-[#3FF5E6]'
                          : 'opacity-40 border-l-2 border-transparent'
                      }`}
                    >
                      <span
                        className={`font-mono text-xs font-bold px-1.5 py-0.5 ${
                          isReached ? 'text-[#3FF5E6] bg-[#3FF5E6]/10' : 'text-[#7A8CA3]'
                        }`}
                      >
                        {st.num}
                      </span>
                      <div>
                        <span
                          className={`font-mono text-xs font-bold mr-2 ${
                            isReached ? 'text-[#E6F1FF]' : 'text-[#7A8CA3]'
                          }`}
                        >
                          {st.title}
                        </span>
                        <span className="text-xs text-[#A6C0DE]">{st.desc}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Run DREAM Cycle Button */}
            <div>
              <button
                onClick={handleRunDream}
                onMouseEnter={() => playHoverTick(soundEnabled)}
                disabled={isDreaming}
                className="w-full py-3.5 px-6 bg-[#3FF5E6] text-[#02060D] hover:bg-[#68FFF3] font-mono text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(63,245,230,0.4)]"
                data-readout="TRIGGER DENSE COUNTERFACTUAL REPLAY"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{isDreaming ? 'REPLAYING HISTORICAL TREES...' : '▶ Run DREAM Cycle'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Count-up Results Strip */}
        <div className="bracket-panel p-6 mb-6 select-none bg-[#07121F]/90">
          <span className="bracket-corner-tr" />
          <span className="bracket-corner-bl" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center font-mono">
            <div className="p-3 border-b md:border-b-0 md:border-r border-[rgba(63,245,230,0.12)]">
              <span className="text-2xl sm:text-3xl font-bold text-[#3FF5E6] block mb-1">
                V-SCORE {dreamRunCount > 1 ? '0.71 → 0.79' : '0.71'}
              </span>
              <span className="text-[11px] text-[#7A8CA3] tracking-widest uppercase">
                VERIFIED ACCURACY GAIN
              </span>
            </div>
            <div className="p-3 border-b md:border-b-0 md:border-r border-[rgba(63,245,230,0.12)]">
              <span className="text-2xl sm:text-3xl font-bold text-[#4ADE80] block mb-1">
                LLM CALLS −38%
              </span>
              <span className="text-[11px] text-[#7A8CA3] tracking-widest uppercase">
                PRUNED TOKEN CONSUMPTION
              </span>
            </div>
            <div className="p-3">
              <span className="text-2xl sm:text-3xl font-bold text-[#E6F1FF] block mb-1">
                REGRESSIONS 0
              </span>
              <span className="text-[11px] text-[#7A8CA3] tracking-widest uppercase">
                GUARANTEED MONOTONIC SAFETY
              </span>
            </div>
          </div>
        </div>

        {/* Mono Footnote */}
        <div className="font-mono text-xs text-[#7A8CA3] text-center">
          Inspired by Dream-RSI (Google, 2026). Leakage-free: prefix-only replay, time-bounded backtests.
        </div>
      </div>
    </section>
  );
};
