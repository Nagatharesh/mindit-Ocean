import React from 'react';
import { playHoverTick } from '../utils/audio';

interface FooterProps {
  soundEnabled: boolean;
}

export const Footer: React.FC<FooterProps> = ({ soundEnabled }) => {
  return (
    <footer className="relative w-full border-t border-[rgba(63,245,230,0.18)] py-10 px-4 sm:px-8 lg:px-14 z-20 bg-[#02060D]/90 backdrop-blur-sm select-none">
      <div className="max-w-[1480px] mx-auto flex flex-col gap-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Left */}
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <span className="text-xl">🐋</span>
              <span className="font-heading font-bold text-sm tracking-tight text-[#E6F1FF]">
                TIDEMIND
              </span>
            </div>
            <span className="hidden sm:inline text-[#7A8CA3]">·</span>
            <span className="text-xs text-[#A6C0DE]">
              Built for ORCA Marine Eco-System Reasoning
            </span>
          </div>

          {/* Centre */}
          <div className="font-mono text-xs text-[#3FF5E6] text-center">
            Team TideMind · Panimalar Engineering College
          </div>

          {/* Right */}
          <div className="flex items-center gap-3 font-mono text-xs text-[#A6C0DE]">
            <span
              onMouseEnter={() => playHoverTick(soundEnabled)}
              data-readout="CORE SYSTEM FRAMEWORK"
            >
              CrewAI · PyTorch · React · Three.js
            </span>
          </div>
        </div>

        {/* Small Muted Legal & Citation Line */}
        <div className="text-center font-mono text-[11px] text-[#7A8CA3] border-t border-[rgba(63,245,230,0.08)] pt-4">
          All figures are illustrative demo data. Dream-RSI © Google, 2026, cited as inspiration.
        </div>
      </div>
    </footer>
  );
};
