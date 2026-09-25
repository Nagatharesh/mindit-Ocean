import React from 'react';
import { Database, AlertTriangle, ShieldAlert, Cpu } from 'lucide-react';
import { playHoverTick } from '../utils/audio';

interface ProblemSectionProps {
  soundEnabled: boolean;
}

export const ProblemSection: React.FC<ProblemSectionProps> = ({ soundEnabled }) => {
  const problems = [
    {
      num: '01',
      icon: <Database className="w-6 h-6 text-[#3FF5E6]" />,
      title: 'Scattered data',
      desc: 'Satellite, buoy and survey data live in separate portals and formats.',
      metric: '48+ ISOLATED SILOS',
      detail: 'MODIS, Copernicus, Argo floats and local bathymetry lack unified causal linking.',
    },
    {
      num: '02',
      icon: <AlertTriangle className="w-6 h-6 text-[#F5B83F]" />,
      title: 'Alerts without answers',
      desc: 'Tools say what is happening, never why or what comes next.',
      metric: '0 REASONING DEPTH',
      detail: 'Threshold alerts fire after bleaching begins, without root-cause interventions.',
    },
    {
      num: '03',
      icon: <ShieldAlert className="w-6 h-6 text-[#FF5A5F]" />,
      title: "AI you can't trust",
      desc: 'Chatbots invent causal stories and confidence numbers.',
      metric: '42% HALLUCINATION RATE',
      detail: 'Standard LLMs fabricate biological cascades that violate conservation physics.',
    },
    {
      num: '04',
      icon: <Cpu className="w-6 h-6 text-[#B18CFF]" />,
      title: 'Self-grading AI',
      desc: 'Self-improving agents judge themselves, so they learn to please, not to be right.',
      metric: 'REWARD-HACKING BIAS',
      detail: 'Unconstrained self-reflection drifts into self-confirmation rather than empirical proof.',
    },
  ];

  return (
    <section
      id="problem"
      className="relative w-full py-24 sm:py-32 px-4 sm:px-8 lg:px-14 z-20"
      aria-labelledby="problem-heading"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section kicker */}
        <div
          className="font-mono text-xs sm:text-sm text-[#3FF5E6] tracking-widest uppercase mb-3 flex items-center gap-2"
          data-readout="SECTION 01 DIAGNOSTICS"
        >
          <span className="text-[#3FF5E6] font-bold">//</span>
          <span>01 · THE PROBLEM</span>
        </div>

        {/* Heading */}
        <h2
          id="problem-heading"
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#E6F1FF] tracking-tight mb-12 max-w-3xl font-heading"
        >
          Every tool shows the ocean. <br />
          <span className="text-[#7A8CA3]">None explains it.</span>
        </h2>

        {/* 4 Bracketed Panels (2x2 desktop, stacked mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-16">
          {problems.map((item) => (
            <div
              key={item.num}
              onMouseEnter={() => playHoverTick(soundEnabled)}
              className="bracket-panel group p-7 sm:p-8 flex flex-col justify-between transition-all duration-500 hover:-translate-y-1.5 cursor-default select-none"
              data-readout={`${item.num} · ${item.title.toUpperCase()}`}
            >
              {/* Corner brackets */}
              <span className="bracket-corner-tr" />
              <span className="bracket-corner-bl" />

              <div>
                {/* Header row: Index & Icon */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-[rgba(63,245,230,0.14)]">
                  <span className="font-mono text-xs text-[#3FF5E6] tracking-widest font-semibold">
                    // {item.num}
                  </span>
                  <div className="p-2 border border-[rgba(63,245,230,0.2)] bg-[#071626]/60 transition-transform duration-300 group-hover:scale-110">
                    {item.icon}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-bold text-[#E6F1FF] mb-3 font-heading group-hover:text-[#3FF5E6] transition-colors">
                  {item.title}
                </h3>

                {/* Core quote / sentence */}
                <p className="text-sm sm:text-base text-[#A6C0DE] leading-relaxed mb-6 font-normal">
                  {item.desc}
                </p>
              </div>

              {/* Technical annotation footer */}
              <div className="pt-4 border-t border-[rgba(63,245,230,0.1)] flex flex-col gap-1 font-mono">
                <span className="text-[10px] text-[#FF5A5F] tracking-wider uppercase font-semibold">
                  {item.metric}
                </span>
                <span className="text-xs text-[#7A8CA3] leading-snug">
                  {item.detail}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Single Centered Line */}
        <div className="text-center pt-8 border-t border-[rgba(63,245,230,0.15)]">
          <p className="text-2xl sm:text-3xl md:text-4xl font-heading font-semibold text-[#E6F1FF] tracking-tight">
            The missing piece isn't more data.{' '}
            <span className="text-[#3FF5E6] drop-shadow-[0_0_20px_rgba(63,245,230,0.4)]">
              It's trust.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
};
