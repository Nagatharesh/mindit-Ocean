import React from 'react';
import { playHoverTick, playSonarPing } from '../utils/audio';

interface ProgressRailProps {
  activeSection: string;
  soundEnabled: boolean;
}

const SECTIONS = [
  { id: 'hero', name: 'HERO', label: '00 · ECOSYSTEM CORE' },
  { id: 'problem', name: 'PROBLEM', label: '01 · THE PROBLEM' },
  { id: 'solution', name: 'SOLUTION', label: '02 · THE SOLUTION' },
  { id: 'twin', name: 'TWIN', label: '03 · DIGITAL TWIN' },
  { id: 'sites', name: 'SITES', label: '03B · LIVE SITES' },
  { id: 'crew', name: 'AGENTS', label: '04 · MEET THE CREW' },
  { id: 'models', name: 'MODELS', label: '05 · NEURAL MODELS' },
  { id: 'brcv', name: 'BRCV', label: '06 · BRCV ALGORITHM' },
  { id: 'what-if', name: 'WHAT-IF', label: '07 · WHAT-IF LAB' },
  { id: 'dream', name: 'DREAM', label: '08 · DREAM RSI' },
  { id: 'security', name: 'SECURITY', label: '09 · 8-LAYER SECURITY' },
  { id: 'users', name: 'USERS', label: '10 · TARGET USERS' },
  { id: 'business', name: 'BUSINESS', label: '11 · BUSINESS & NOVELTY' },
  { id: 'research', name: 'RESEARCH', label: '12 · ABSTRACT & TECH' },
  { id: 'cta', name: 'MISSION', label: '13 · MISSION CONTROL' },
];

export const ProgressRail: React.FC<ProgressRailProps> = ({ activeSection, soundEnabled }) => {
  const scrollTo = (id: string) => {
    if (id === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <aside
      className="hidden md:flex fixed right-5 top-1/2 -translate-y-1/2 z-40 flex-col items-center select-none"
      aria-label="Page Section Progress Rail"
    >
      {/* Background connecting rail line */}
      <div className="absolute top-2 bottom-2 w-[1px] bg-[rgba(63,245,230,0.18)]" />

      {/* 13 Section Dots */}
      <div className="flex flex-col gap-3.5 relative z-10">
        {SECTIONS.map((sec) => {
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => {
                playSonarPing(soundEnabled);
                scrollTo(sec.id);
              }}
              onMouseEnter={() => playHoverTick(soundEnabled)}
              className="group relative flex items-center justify-center p-1 cursor-pointer focus:outline-none"
              aria-label={`Scroll to ${sec.label}`}
              data-readout={sec.label}
            >
              {/* Dot */}
              <span
                className={`block rounded-full transition-all duration-300 ${
                  isActive
                    ? 'w-2.5 h-2.5 bg-[#3FF5E6] shadow-[0_0_12px_#3FF5E6] scale-125'
                    : 'w-1.5 h-1.5 bg-[#7A8CA3]/60 group-hover:bg-[#E6F1FF] group-hover:scale-110'
                }`}
              />

              {/* Tooltip on hover */}
              <span className="absolute right-6 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 font-mono text-[10px] text-[#3FF5E6] bg-[#07121F]/95 border border-[#3FF5E6]/40 px-2 py-0.5 whitespace-nowrap shadow-[0_0_10px_rgba(63,245,230,0.3)]">
                {sec.label}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
