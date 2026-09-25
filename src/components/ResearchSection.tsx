import React from 'react';
import { playHoverTick } from '../utils/audio';

interface ResearchSectionProps {
  soundEnabled: boolean;
}

export const ResearchSection: React.FC<ResearchSectionProps> = ({ soundEnabled }) => {
  const keywords = [
    'Multi-Agent Systems',
    'CrewAI',
    'Counterfactual Verification',
    'Hybrid Neural ODE',
    'LSTM',
    'Recursive Self-Improvement',
    'AI Security',
    'Digital Twin',
  ];

  const techRows = [
    { category: 'FRONTEND', items: ['React', 'Three.js', 'R3F', 'framer-motion', 'Tailwind'] },
    { category: 'BACKEND', items: ['Python', 'FastAPI'] },
    { category: 'AGENTS', items: ['CrewAI', 'Gemini / Groq / Claude'] },
    { category: 'DEEP LEARNING', items: ['PyTorch', 'torchdiffeq', 'PyTorch Geometric'] },
    { category: 'DATA', items: ['NOAA Coral Reef Watch', 'Copernicus Marine', 'OBIS'] },
    { category: 'SECURITY', items: ['SHA-256', 'RBAC', 'API keys'] },
  ];

  return (
    <section
      id="research"
      className="relative w-full py-24 sm:py-32 px-4 sm:px-8 lg:px-14 z-20"
      aria-labelledby="research-heading"
    >
      <div className="max-w-[1480px] mx-auto">
        {/* Section kicker */}
        <div
          className="font-mono text-xs sm:text-sm text-[#3FF5E6] tracking-widest uppercase mb-3 flex items-center gap-2"
          data-readout="SECTION 12 SCIENTIFIC MANUSCRIPT ABSTRACT"
        >
          <span className="text-[#3FF5E6] font-bold">//</span>
          <span>12 · RESEARCH</span>
        </div>

        {/* Heading */}
        <h2
          id="research-heading"
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#E6F1FF] tracking-tight mb-4 font-heading"
        >
          The research behind <br className="sm:hidden" />
          <span className="text-[#3FF5E6] drop-shadow-[0_0_20px_rgba(63,245,230,0.3)]">
            TideMind.
          </span>
        </h2>
        <p className="text-base sm:text-lg text-[#A6C0DE] max-w-2xl mb-12 font-normal">
          Formalizing the boundary between generative multi-agent inference and hard numerical conservation physics in aquatic biosystems.
        </p>

        {/* Bracketed Abstract Panel with Exact Text */}
        <div
          className="bracket-panel p-8 sm:p-10 mb-10 select-none bg-[#07121F]/95"
          data-readout="SCIENTIFIC ABSTRACT TEXT"
        >
          <span className="bracket-corner-tr" />
          <span className="bracket-corner-bl" />

          <div className="flex items-center justify-between pb-4 mb-6 border-b border-[rgba(63,245,230,0.14)]">
            <span className="font-mono text-xs text-[#3FF5E6] font-bold tracking-widest uppercase">
              // PEER-REVIEW ABSTRACT
            </span>
            <span className="font-mono text-[10px] text-[#4ADE80] font-semibold">
              AUTHORS: TEAM TIDEMIND · PANIMALAR ENGINEERING COLLEGE
            </span>
          </div>

          <p className="text-base sm:text-lg text-[#E6F1FF] leading-relaxed font-normal mb-8">
            "Marine monitoring tools report isolated variables but cannot explain or verify ecosystem change. We present TideMind, a multi-agent system where CrewAI agents propose causal hypotheses over heterogeneous ocean data. Our novel algorithm, Bounded-Residual Counterfactual Verification, audits each claim through interventions on a hybrid physics-neural model that cannot override physics. An LSTM forecaster provides early warnings, while an autoencoder detects data poisoning. Replay-based self-improvement uses leakage-free backtesting. An eight-layer security framework and a Three.js digital twin deliver trustworthy, explainable marine decisions."
          </p>

          {/* Keyword Chips */}
          <div className="pt-4 border-t border-[rgba(63,245,230,0.1)] flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-[#7A8CA3] mr-2">KEYWORDS:</span>
            {keywords.map((kw) => (
              <span
                key={kw}
                onMouseEnter={() => playHoverTick(soundEnabled)}
                className="font-mono text-xs px-2.5 py-1 bg-[#02060D] border border-[rgba(63,245,230,0.2)] text-[#3FF5E6]"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>

        {/* Tech Stack Grid Grouped by Row */}
        <div
          className="bracket-panel p-6 sm:p-8 select-none bg-[#07121F]/90"
          data-readout="PRODUCTION TECHNOLOGY STACK MATRIX"
        >
          <span className="bracket-corner-tr" />
          <span className="bracket-corner-bl" />

          <div className="font-mono text-xs text-[#3FF5E6] tracking-widest uppercase mb-6 pb-2 border-b border-[rgba(63,245,230,0.14)]">
            // FULL ARCHITECTURAL STACK MATRIX
          </div>

          <div className="space-y-4">
            {techRows.map((row) => (
              <div
                key={row.category}
                className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[rgba(63,245,230,0.08)] last:border-0 gap-2"
              >
                <span className="font-mono text-xs font-bold text-[#7A8CA3] sm:w-44 tracking-wider uppercase">
                  {row.category}
                </span>
                <div className="flex-1 flex flex-wrap gap-2">
                  {row.items.map((item) => (
                    <span
                      key={item}
                      onMouseEnter={() => playHoverTick(soundEnabled)}
                      className="font-mono text-xs px-2.5 py-1 bg-[#02060D] border border-[rgba(63,245,230,0.15)] text-[#E6F1FF] hover:border-[#3FF5E6] transition-colors"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
