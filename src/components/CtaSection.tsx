import React, { useState } from 'react';
import { playHoverTick, playSonarPing } from '../utils/audio';

interface CtaSectionProps {
  soundEnabled: boolean;
}

export const CtaSection: React.FC<CtaSectionProps> = ({ soundEnabled }) => {
  const [showToast, setShowToast] = useState(false);

  const handleLaunch = () => {
    playSonarPing(soundEnabled);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4500);
  };

  return (
    <section
      id="cta"
      className="relative w-full py-32 sm:py-44 px-4 sm:px-8 lg:px-14 z-20 overflow-hidden flex flex-col items-center justify-center text-center"
    >
      {/* Background Animated Sonar Rings behind heading */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[540px] lg:w-[680px] h-[340px] sm:h-[540px] lg:h-[680px] pointer-events-none -z-10 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-[#3FF5E6]/25 animate-sonar" />
        <div
          className="absolute inset-0 rounded-full border border-[#3FF5E6]/15 animate-sonar"
          style={{ animationDelay: '1.2s' }}
        />
        <div
          className="absolute inset-0 rounded-full border border-[#3FF5E6]/10 animate-sonar"
          style={{ animationDelay: '2.4s' }}
        />
        <div className="w-24 h-24 rounded-full bg-[#3FF5E6]/5 blur-2xl" />
      </div>

      <div className="max-w-3xl mx-auto flex flex-col items-center relative z-10">
        {/* Mono Label */}
        <div
          className="font-mono text-xs sm:text-sm text-[#3FF5E6] tracking-widest uppercase mb-4 flex items-center gap-2"
          data-readout="STATION PREPARED FOR DESCENT"
        >
          <span className="text-[#3FF5E6] font-bold">//</span>
          <span>READY TO DESCEND</span>
        </div>

        {/* Heading */}
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#E6F1FF] tracking-tight mb-4 font-heading">
          Enter Mission Control.
        </h2>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-[#A6C0DE] max-w-xl mb-10 font-normal leading-relaxed">
          Watch six agents reason, verify and improve — live.
        </p>

        {/* Large Primary Action Button */}
        <div className="relative">
          <button
            onClick={handleLaunch}
            onMouseEnter={() => playHoverTick(soundEnabled)}
            className="px-9 py-4 bg-[#3FF5E6] text-[#02060D] font-mono font-bold text-base sm:text-lg tracking-wider uppercase transition-all duration-300 hover:bg-[#68FFF3] hover:shadow-[0_0_35px_rgba(63,245,230,0.6)] cursor-pointer flex items-center gap-3 group select-none"
            data-readout="INITIALIZE MISSION CONTROL WORKSPACE"
          >
            <span>Launch Mission Control</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1.5">
              →
            </span>
          </button>
        </div>

        {/* Context metadata */}
        <div className="mt-8 font-mono text-xs text-[#7A8CA3] tracking-widest flex items-center gap-3">
          <span>LATENCY: 12ms</span>
          <span>·</span>
          <span>CREW-AI SANDBOX: READY</span>
          <span>·</span>
          <span>RESONANCE: ACTIVE</span>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div
          role="status"
          className="fixed bottom-8 right-8 z-[1000] bracket-panel p-4 max-w-md text-left flex items-start gap-3 shadow-[0_0_30px_rgba(63,245,230,0.3)] animate-in fade-in slide-in-from-bottom-5 duration-300"
          data-readout="NOTIFICATION DISPATCHED"
        >
          <span className="bracket-corner-tr" />
          <span className="bracket-corner-bl" />
          <span className="text-xl">🛰️</span>
          <div>
            <div className="font-mono text-xs font-bold text-[#3FF5E6] tracking-wider uppercase mb-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3FF5E6] animate-pulse" />
              <span>Mission Control Coming Next</span>
            </div>
            <div className="text-xs text-[#A6C0DE] leading-relaxed">
              Mission Control simulator environment is initializing. Bathymetric datasets and live sensor nodes are pre-loaded for the next sector deployment.
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
