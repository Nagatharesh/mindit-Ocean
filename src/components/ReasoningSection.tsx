import React, { useEffect, useState, useRef } from 'react';
import { DepthLayers } from './DepthLayers';
import { playHoverTick, playSonarPing } from '../utils/audio';

interface ReasoningSectionProps {
  soundEnabled: boolean;
}

export const ReasoningSection: React.FC<ReasoningSectionProps> = ({ soundEnabled }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: 'ingest',
      stepNum: '01',
      title: 'INGEST',
      subtitle: 'Sentinel validates every reading',
      description: 'Blocks sensor drift, spoofed telemetry, and adversarial injection before parsing.',
      icon: '🛡️',
      spec: '99.98% FILTER RIGOR',
    },
    {
      id: 'propose',
      stepNum: '02',
      title: 'PROPOSE',
      subtitle: 'Agents build causal hypotheses',
      description: 'Oceanographer, Ecologist, and Strategist draft directed acyclic graphs of ecological stress.',
      icon: '🌊',
      spec: 'CREW-AI PARALLEL DAG',
    },
    {
      id: 'verify',
      stepNum: '03',
      title: 'VERIFY',
      subtitle: 'Simulator + historical backtest',
      description: 'Numerical physics engine runs hydrodynamics & degree-heating-week conservation laws.',
      icon: '⚙️',
      spec: 'PHYSICS SIMULATOR RIGIDITY',
    },
    {
      id: 'improve',
      stepNum: '04',
      title: 'IMPROVE',
      subtitle: 'DREAM keeps only proven lessons',
      description: 'Episodic memory distills validated causal edges; discards unverified hallucinations.',
      icon: '🧠',
      spec: 'SELF-CORRECTING WEIGHTS',
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

    // Sequential step illumination
    const timers = [
      setTimeout(() => setActiveStep(1), 400),
      setTimeout(() => setActiveStep(2), 1100),
      setTimeout(() => setActiveStep(3), 1800),
      setTimeout(() => setActiveStep(4), 2500),
    ];

    return () => timers.forEach(clearTimeout);
  }, [inView]);

  return (
    <section
      ref={sectionRef}
      id="reasoning"
      className="relative w-full py-24 sm:py-32 px-4 sm:px-8 lg:px-14 z-20"
      aria-labelledby="reasoning-heading"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section kicker */}
        <div
          className="font-mono text-xs sm:text-sm text-[#3FF5E6] tracking-widest uppercase mb-3 flex items-center gap-2"
          data-readout="SECTION 02 VERIFICATION LOOP"
        >
          <span className="text-[#3FF5E6] font-bold">//</span>
          <span>02 · REASONING LOOP</span>
        </div>

        {/* Heading */}
        <h2
          id="reasoning-heading"
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#E6F1FF] tracking-tight mb-4 font-heading"
        >
          LLMs propose. <br className="sm:hidden" />
          <span className="text-[#3FF5E6] drop-shadow-[0_0_20px_rgba(63,245,230,0.3)]">
            Physics disposes.
          </span>
        </h2>
        <p className="text-base sm:text-lg text-[#A6C0DE] max-w-2xl mb-10 font-normal">
          Generative AI creates hypotheses across depth layers. Our numerical marine simulator checks every causal link against thermodynamic laws before any action is approved.
        </p>

        {/* 3D Depth Layers Canvas */}
        <div className="bracket-panel p-4 sm:p-6 mb-16 overflow-hidden">
          <span className="bracket-corner-tr" />
          <span className="bracket-corner-bl" />
          
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-[rgba(63,245,230,0.14)]">
            <span className="font-mono text-xs text-[#3FF5E6] tracking-wider uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3FF5E6] animate-pulse" />
              SPATIAL BATHYMETRIC STRATIFICATION · VERTICAL CAUSAL CASCADE
            </span>
            <span className="font-mono text-[10px] text-[#7A8CA3] hidden sm:inline">
              MOUSE INTERACTIVE · TILT EXPLORATION
            </span>
          </div>

          <DepthLayers inView={inView} />
        </div>

        {/* Horizontal 4-step Flow Connected by Sequence Lines */}
        <div className="relative">
          <div className="font-mono text-xs text-[#7A8CA3] tracking-widest uppercase mb-6 flex items-center gap-2">
            <span className="text-[#3FF5E6]">▸</span>
            <span>END-TO-END VERIFICATION PIPELINE</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {steps.map((step, idx) => {
              const isLit = activeStep > idx;
              return (
                <div key={step.id} className="relative flex flex-col">
                  {/* Step Card */}
                  <div
                    onMouseEnter={() => {
                      playHoverTick(soundEnabled);
                      if (isLit) playSonarPing(soundEnabled);
                    }}
                    className={`bracket-panel p-6 flex flex-col justify-between h-full transition-all duration-500 cursor-default select-none ${
                      isLit
                        ? 'border-[#3FF5E6] shadow-[0_0_25px_rgba(63,245,230,0.22)] -translate-y-1'
                        : 'border-[rgba(63,245,230,0.14)] opacity-70'
                    }`}
                    data-readout={`PIPELINE STEP ${step.stepNum}: ${step.title}`}
                  >
                    <span className="bracket-corner-tr" />
                    <span className="bracket-corner-bl" />

                    <div>
                      {/* Step Header */}
                      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[rgba(63,245,230,0.12)]">
                        <span
                          className={`font-mono text-xs tracking-widest font-bold ${
                            isLit ? 'text-[#3FF5E6]' : 'text-[#7A8CA3]'
                          }`}
                        >
                          // STEP {step.stepNum}
                        </span>
                        <span className="text-xl">{step.icon}</span>
                      </div>

                      {/* Step Title */}
                      <h3
                        className={`text-xl font-bold mb-1 font-heading transition-colors ${
                          isLit ? 'text-[#3FF5E6]' : 'text-[#E6F1FF]'
                        }`}
                      >
                        {step.title}
                      </h3>

                      {/* Subtitle */}
                      <div className="text-xs font-mono text-[#E6F1FF] font-medium mb-3">
                        {step.subtitle}
                      </div>

                      {/* Description */}
                      <p className="text-xs text-[#A6C0DE] leading-relaxed mb-4">
                        {step.description}
                      </p>
                    </div>

                    {/* Spec footer */}
                    <div className="pt-3 border-t border-[rgba(63,245,230,0.1)] flex items-center justify-between font-mono text-[10px]">
                      <span className="text-[#7A8CA3]">{step.spec}</span>
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isLit ? 'bg-[#4ADE80] pulse-dot-green' : 'bg-gray-600'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Horizontal Arrow between cards on desktop */}
                  {idx < 3 && (
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
        </div>
      </div>
    </section>
  );
};
