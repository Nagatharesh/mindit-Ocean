import React, { useEffect, useState } from 'react';
import { EcosystemCore } from './EcosystemCore';
import { playHoverTick, playSonarPing } from '../utils/audio';

interface HeroProps {
  soundEnabled: boolean;
  onDiveIn: () => void;
  onWatchDemo: () => void;
  highlightedAgentId?: string | null;
  onAgentHover?: (id: string | null) => void;
}

export const Hero: React.FC<HeroProps> = ({
  soundEnabled,
  onDiveIn,
  onWatchDemo,
  highlightedAgentId,
  onAgentHover,
}) => {
  // Typewriter effect state
  const fullSubline = 'AI agents propose. Physics verifies. History proves.';
  const [typedText, setTypedText] = useState('');
  const [isTypingDone, setIsTypingDone] = useState(false);

  // Live telemetry fluctuating state
  const [telemetry, setTelemetry] = useState({
    sst: 30.4,
    dhw: 9.2,
    oxygen: 5.8,
    salinity: 34.6,
  });
  const [flicker, setFlicker] = useState(false);

  useEffect(() => {
    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx <= fullSubline.length) {
        setTypedText(fullSubline.slice(0, currentIdx));
        currentIdx++;
      } else {
        setIsTypingDone(true);
        clearInterval(interval);
      }
    }, 42);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Sensor data fluctuation every 3.8 seconds
    const interval = setInterval(() => {
      setFlicker(true);
      setTimeout(() => {
        setTelemetry({
          sst: +(30.3 + Math.random() * 0.3).toFixed(1),
          dhw: +(9.1 + Math.random() * 0.2).toFixed(1),
          oxygen: +(5.7 + Math.random() * 0.3).toFixed(1),
          salinity: +(34.5 + Math.random() * 0.2).toFixed(1),
        });
        setFlicker(false);
      }, 140);
    }, 3800);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-between pt-24 pb-10 px-4 sm:px-8 lg:px-14 z-20 overflow-hidden">
      {/* Main Grid: Left copy, Right 3D Ecosystem Core */}
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center my-auto">
        {/* Left Column */}
        <div className="lg:col-span-7 flex flex-col items-start text-left z-20">
          {/* Section Mono Label */}
          <div
            className="font-mono text-xs sm:text-sm text-[#3FF5E6] tracking-widest uppercase mb-4 flex items-center gap-2"
            data-readout="CORE INFERENCE SYSTEM ACTIVE"
          >
            <span className="text-[#3FF5E6] font-bold">//</span>
            <span>MARINE ECOSYSTEM REASONING ENGINE · v3.0</span>
          </div>

          {/* Large Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-bold text-[#E6F1FF] tracking-tight leading-[1.08] mb-5 font-heading">
            <span>The ocean is telling a story.</span>
            <br />
            <span className="text-[#3FF5E6] drop-shadow-[0_0_24px_rgba(63,245,230,0.4)]">
              We verify it.
            </span>
          </h1>

          {/* Typewriter Sub-line */}
          <div className="font-mono text-base sm:text-lg text-[#A6C0DE] tracking-wide mb-4 min-h-[30px] flex items-center">
            <span>{typedText}</span>
            {!isTypingDone && (
              <span className="inline-block w-2 h-5 bg-[#3FF5E6] ml-1 animate-pulse" />
            )}
          </div>

          {/* Short paragraph */}
          <p className="text-sm sm:text-base text-[#7A8CA3] max-w-xl leading-relaxed mb-8 font-normal">
            TideMind is a self-improving multi-agent system that explains why marine ecosystems change — and proves every claim before you act on it.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-5 mb-8">
            {/* Primary Dive In button */}
            <button
              onClick={() => {
                playSonarPing(true);
                onDiveIn();
              }}
              onMouseEnter={() => playHoverTick(soundEnabled)}
              className="px-7 py-3.5 bg-[#3FF5E6] text-[#02060D] font-mono font-bold text-sm tracking-wider uppercase transition-all duration-300 hover:bg-[#68FFF3] hover:shadow-[0_0_25px_rgba(63,245,230,0.5)] cursor-pointer flex items-center gap-2 group"
              data-readout="BEGIN BATHYMETRIC DIVE"
            >
              <span>Dive In</span>
              <span className="transition-transform duration-300 group-hover:translate-y-1">↓</span>
            </button>

            {/* Secondary Read the Abstract button */}
            <button
              onClick={() => {
                playSonarPing(soundEnabled);
                const el = document.getElementById('research');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else onWatchDemo();
              }}
              onMouseEnter={() => playHoverTick(soundEnabled)}
              className="bracket-panel px-6 py-3.5 text-[#E6F1FF] hover:text-[#3FF5E6] font-mono text-sm tracking-wider uppercase transition-colors cursor-pointer flex items-center gap-2"
              data-readout="READ THE RESEARCH ABSTRACT"
            >
              <span className="bracket-corner-tr" />
              <span className="bracket-corner-bl" />
              <span>Read the Abstract</span>
              <span className="text-xs text-[#3FF5E6]">→</span>
            </button>
          </div>

          {/* 4 Small Mono Tags */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 font-mono text-xs text-[#7A8CA3] tracking-widest pt-2 border-t border-[rgba(63,245,230,0.12)]">
            <div className="flex items-center gap-2" data-readout="ARCHITECTURE: MULTI-AGENT SWARM">
              <span className="w-1.5 h-1.5 bg-[#3FF5E6]" />
              <span className="text-[#A6C0DE]">CrewAI MULTI-AGENT</span>
            </div>
            <div className="flex items-center gap-2" data-readout="BOUNDED-RESIDUAL COUNTERFACTUAL VERIFICATION">
              <span className="w-1.5 h-1.5 bg-[#4ADE80]" />
              <span className="text-[#A6C0DE]">BRCV-VERIFIED</span>
            </div>
            <div className="flex items-center gap-2" data-readout="DREAM-RSI RECURSIVE REPLAY">
              <span className="w-1.5 h-1.5 bg-[#F5B83F]" />
              <span className="text-[#A6C0DE]">SELF-IMPROVING</span>
            </div>
            <div className="flex items-center gap-2" data-readout="8-LAYER HARBOR SECURITY">
              <span className="w-1.5 h-1.5 bg-[#B18CFF]" />
              <span className="text-[#A6C0DE]">8-LAYER SECURE</span>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Ecosystem Core */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          <EcosystemCore
            soundEnabled={soundEnabled}
            highlightedAgentId={highlightedAgentId}
            onNodeHover={onAgentHover}
          />
        </div>
      </div>

      {/* Bottom Area: Centered Scroll Prompt + Right Telemetry Panel */}
      <div className="max-w-7xl w-full mx-auto flex flex-col md:flex-row items-center md:items-end justify-between gap-6 pt-4">
        {/* Bottom Centre: Animated Scroll Indicator */}
        <div
          onClick={onDiveIn}
          onMouseEnter={() => playHoverTick(soundEnabled)}
          className="flex flex-col items-center gap-2 cursor-pointer group select-none mx-auto md:ml-auto md:mr-auto"
          data-readout="SCROLL OR CLICK TO DESCEND"
        >
          <span className="font-mono text-[11px] tracking-widest text-[#7A8CA3] group-hover:text-[#3FF5E6] transition-colors">
            SCROLL TO DESCEND
          </span>
          <div className="w-[1px] h-9 bg-[rgba(63,245,230,0.2)] relative overflow-hidden">
            <div className="w-full h-3 bg-[#3FF5E6] absolute -top-3 animate-[scrollIndicator_2.2s_ease-in-out_infinite]" />
          </div>
        </div>

        {/* Bottom Right: Live Telemetry Panel (Bracketed) */}
        <div
          className="bracket-panel p-4 sm:p-5 w-full md:w-auto md:min-w-[340px] text-left select-none"
          data-readout="LIVE SENSOR TELEMETRY BUOY #44013"
        >
          <span className="bracket-corner-tr" />
          <span className="bracket-corner-bl" />

          <div className="flex items-center justify-between border-b border-[rgba(63,245,230,0.14)] pb-2 mb-3">
            <span className="font-mono text-[10px] text-[#7A8CA3] tracking-wider uppercase">
              BUOY #44013 · MANNAR SHALLOWS
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[10px] text-[#4ADE80]">
              <span className="w-1.5 h-1.5 bg-[#4ADE80] rounded-full pulse-dot-green" />
              LIVE TELEMETRY
            </span>
          </div>

          <div
            className={`grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-xs transition-opacity duration-150 ${
              flicker ? 'opacity-40' : 'opacity-100'
            }`}
          >
            <div
              className="flex justify-between items-center py-0.5 border-b border-white/5"
              data-readout="SEA SURFACE TEMP: 30.4°C (+2.4°C ABOVE CLIMATOLOGY)"
            >
              <span className="text-[#7A8CA3]">SST</span>
              <span className="text-[#FF5A5F] font-semibold">{telemetry.sst}°C</span>
            </div>

            <div
              className="flex justify-between items-center py-0.5 border-b border-white/5"
              data-readout="DEGREE HEATING WEEKS: 9.2 (THRESHOLD EXCEEDED)"
            >
              <span className="text-[#7A8CA3]">DHW</span>
              <span className="text-[#F5B83F] font-semibold">{telemetry.dhw} °C-wks</span>
            </div>

            <div
              className="flex justify-between items-center py-0.5 border-b border-white/5"
              data-readout="DISSOLVED OXYGEN: 5.8 mg/L (HYPOXIC ZONE AT 35m)"
            >
              <span className="text-[#7A8CA3]">O₂</span>
              <span className="text-[#3FF5E6] font-semibold">{telemetry.oxygen} mg/L</span>
            </div>

            <div
              className="flex justify-between items-center py-0.5 border-b border-white/5"
              data-readout="LSTM 3-WEEK SATELLITE FORECAST: +0.8°C"
            >
              <span className="text-[#7A8CA3]">FORECAST</span>
              <span className="text-[#F5B83F] font-semibold">+0.8°C / 3 wks</span>
            </div>
          </div>

          {/* Bleaching Risk Status Alert */}
          <div
            className="mt-3 pt-2 border-t border-[rgba(63,245,230,0.12)] flex items-center justify-between font-mono text-xs"
            data-readout="STATUS CRITICAL · CORAL MORTALITY PROJECTION: 64%"
          >
            <span className="text-[#7A8CA3] text-[10px] uppercase tracking-wider">STATUS</span>
            <div className="flex items-center gap-1.5 text-[#FF5A5F] font-bold text-[11px] tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[#FF5A5F] pulse-dot-red" />
              <span>BLEACHING RISK: SEVERE</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scrollIndicator {
          0% { top: -12px; opacity: 0; }
          40% { opacity: 1; }
          100% { top: 36px; opacity: 0; }
        }
      `}</style>
    </section>
  );
};
