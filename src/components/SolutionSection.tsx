import React, { useEffect, useState, useRef } from 'react';
import { playHoverTick, playSonarPing } from '../utils/audio';

interface SolutionSectionProps {
  soundEnabled: boolean;
}

export const SolutionSection: React.FC<SolutionSectionProps> = ({ soundEnabled }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      stepNum: '01',
      title: 'PROTECT',
      summary: 'Sentinel + autoencoder validate every reading',
      tech: 'AUTOENCODER · RANGE · CROSS-SOURCE',
      icon: '🛡️',
      detail: 'Rejects sensor drift, adversarial spoofing, and prompt injections at the boundary.',
    },
    {
      stepNum: '02',
      title: 'FORECAST',
      summary: 'LSTM predicts ocean conditions weeks ahead',
      tech: 'LSTM · ATTENTION · PROBABILISTIC',
      icon: '📈',
      detail: 'Projects degree heating weeks, oxygen stratification, and sea surface temperature anomalies.',
    },
    {
      stepNum: '03',
      title: 'PROPOSE',
      summary: 'CrewAI agents build causal hypotheses',
      tech: 'CREW-AI · DAG · PARALLEL SWARM',
      icon: '🌊',
      detail: 'Specialized domain agents generate directed acyclic causal graphs explaining anomalies.',
    },
    {
      stepNum: '04',
      title: 'VERIFY',
      summary: 'BRCV tests every claim by intervention',
      tech: 'BRCV · COUNTERFACTUAL · BOUNDED RESIDUAL',
      icon: '⚙️',
      detail: 'Tests do(X=baseline) interventions on a physics-bounded hybrid simulator.',
    },
    {
      stepNum: '05',
      title: 'IMPROVE',
      summary: 'DREAM replays history to get smarter',
      tech: 'DREAM-RSI · PREFIX REPLAY · ZERO-REGRESSION',
      icon: '🧠',
      detail: 'Replays reasoning traces over frozen historical data to upgrade orchestration without drift.',
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;

    const timers = [
      setTimeout(() => setActiveStep(1), 300),
      setTimeout(() => setActiveStep(2), 700),
      setTimeout(() => setActiveStep(3), 1100),
      setTimeout(() => setActiveStep(4), 1500),
      setTimeout(() => setActiveStep(5), 1900),
    ];

    return () => timers.forEach(clearTimeout);
  }, [inView]);

  return (
    <section
      ref={sectionRef}
      id="solution"
      className="relative w-full py-24 sm:py-32 px-4 sm:px-8 lg:px-14 z-20"
      aria-labelledby="solution-heading"
    >
      <div className="max-w-[1480px] mx-auto">
        {/* Section kicker */}
        <div
          className="font-mono text-xs sm:text-sm text-[#3FF5E6] tracking-widest uppercase mb-3 flex items-center gap-2"
          data-readout="SECTION 02 SYSTEM LOOP"
        >
          <span className="text-[#3FF5E6] font-bold">//</span>
          <span>02 · THE SOLUTION</span>
        </div>

        {/* Heading */}
        <h2
          id="solution-heading"
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#E6F1FF] tracking-tight mb-4 font-heading"
        >
          A reasoning loop <br className="sm:hidden" />
          <span className="text-[#3FF5E6] drop-shadow-[0_0_20px_rgba(63,245,230,0.3)]">
            you can audit.
          </span>
        </h2>
        <p className="text-base sm:text-lg text-[#A6C0DE] max-w-2xl mb-12 font-normal">
          Five deterministic stages link raw satellite signals to verifiable ecological interventions. Every transition is backed by physical invariants.
        </p>

        {/* 5-Step Horizontal Flow (Vertical on Mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 lg:gap-5 mb-14 relative">
          {steps.map((step, idx) => {
            const isLit = activeStep > idx;
            return (
              <div key={step.stepNum} className="relative flex flex-col">
                <div
                  onMouseEnter={() => {
                    playHoverTick(soundEnabled);
                    if (isLit) playSonarPing(soundEnabled);
                  }}
                  className={`bracket-panel p-6 flex flex-col justify-between h-full transition-all duration-500 cursor-default select-none ${
                    isLit
                      ? 'border-[#3FF5E6] shadow-[0_0_20px_rgba(63,245,230,0.18)] -translate-y-1'
                      : 'border-[rgba(63,245,230,0.12)] opacity-70'
                  }`}
                  data-readout={`STAGE ${step.stepNum}: ${step.title}`}
                >
                  <span className="bracket-corner-tr" />
                  <span className="bracket-corner-bl" />

                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-[rgba(63,245,230,0.12)]">
                      <span
                        className={`font-mono text-xs tracking-widest font-bold ${
                          isLit ? 'text-[#3FF5E6]' : 'text-[#7A8CA3]'
                        }`}
                      >
                        // STAGE {step.stepNum}
                      </span>
                      <span className="text-xl">{step.icon}</span>
                    </div>

                    {/* Title */}
                    <h3
                      className={`text-lg sm:text-xl font-bold mb-2 font-heading transition-colors ${
                        isLit ? 'text-[#3FF5E6]' : 'text-[#E6F1FF]'
                      }`}
                    >
                      {step.title}
                    </h3>

                    {/* Summary */}
                    <p className="text-xs sm:text-sm text-[#E6F1FF] font-medium leading-snug mb-3">
                      "{step.summary}"
                    </p>

                    <p className="text-xs text-[#7A8CA3] leading-relaxed mb-4">
                      {step.detail}
                    </p>
                  </div>

                  {/* Tech Tag footer */}
                  <div className="pt-3 border-t border-[rgba(63,245,230,0.1)] flex items-center justify-between font-mono text-[9px]">
                    <span className="text-[#3FF5E6] tracking-tight">{step.tech}</span>
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isLit ? 'bg-[#4ADE80] pulse-dot-green' : 'bg-gray-600'
                      }`}
                    />
                  </div>
                </div>

                {/* Connecting arrow indicator on desktop */}
                {idx < 4 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-30 pointer-events-none">
                    <div
                      className={`w-6 h-[2px] transition-colors duration-500 ${
                        activeStep > idx + 1 ? 'bg-[#3FF5E6]' : 'bg-[rgba(63,245,230,0.2)]'
                      }`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Governing Principle Banner */}
        <div
          className="bracket-panel p-6 sm:p-8 text-center bg-[#07121F]/90 border border-[#3FF5E6]/40 select-none shadow-[0_0_30px_rgba(63,245,230,0.12)]"
          data-readout="CORE SYSTEM INVARIANT"
        >
          <span className="bracket-corner-tr" />
          <span className="bracket-corner-bl" />
          <div className="font-mono text-xs text-[#3FF5E6] tracking-widest uppercase mb-2">
            // GOVERNING ARCHITECTURAL PRINCIPLE
          </div>
          <p className="text-xl sm:text-2xl md:text-3xl font-heading font-semibold text-[#E6F1FF] tracking-tight">
            LLMs propose. Physics disposes.{' '}
            <span className="text-[#3FF5E6]">
              Neural networks refine — but never overrule.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
};
