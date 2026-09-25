import React, { useEffect, useState, useRef } from 'react';
import { playHoverTick } from '../utils/audio';

interface StatsSectionProps {
  soundEnabled: boolean;
}

export const StatsSection: React.FC<StatsSectionProps> = ({ soundEnabled }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Counter values
  const [agentsCount, setAgentsCount] = useState(0);
  const [depthLayersCount, setDepthLayersCount] = useState(0);
  const [simulatorPct, setSimulatorPct] = useState(0);
  const [hashText, setHashText] = useState('SHA-...');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          // Animate agents: 0 -> 6
          let curAgents = 0;
          const agentTimer = setInterval(() => {
            curAgents += 1;
            setAgentsCount(curAgents);
            if (curAgents >= 6) clearInterval(agentTimer);
          }, 110);

          // Animate depth layers: 0 -> 3
          let curDepth = 0;
          const depthTimer = setInterval(() => {
            curDepth += 1;
            setDepthLayersCount(curDepth);
            if (curDepth >= 3) clearInterval(depthTimer);
          }, 180);

          // Animate simulator: 0 -> 100%
          let curSim = 0;
          const simTimer = setInterval(() => {
            curSim += 4;
            setSimulatorPct(Math.min(100, curSim));
            if (curSim >= 100) clearInterval(simTimer);
          }, 32);

          // Type out SHA-256
          const hashString = 'SHA-256';
          let hashIdx = 0;
          const hashTimer = setInterval(() => {
            setHashText(hashString.slice(0, hashIdx + 1));
            hashIdx++;
            if (hashIdx >= hashString.length) clearInterval(hashTimer);
          }, 120);
        }
      },
      { threshold: 0.3 }
    );

    if (panelRef.current) {
      observer.observe(panelRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const stats = [
    {
      value: `${agentsCount}`,
      label: 'AGENTS',
      detail: 'Autonomous reasoning swarm',
      readout: '6 SPECIALIZED REASONING AGENTS',
    },
    {
      value: `${depthLayersCount}`,
      label: 'DEPTH LAYERS',
      detail: 'Surface · Thermocline · Benthic',
      readout: '3 VERTICAL OCEANIC LAYERS',
    },
    {
      value: `${simulatorPct}%`,
      label: 'SIMULATOR-CHECKED EDGES',
      detail: 'Numerical physics verification',
      readout: '100% VERIFIED GRAPH HYPOTHESES',
    },
    {
      value: hashText,
      label: 'AUDIT CHAIN',
      detail: 'Immutable decision attestation',
      readout: 'CRYPTOGRAPHIC ATTESTATION STANDARD',
    },
  ];

  return (
    <section className="relative w-full py-16 sm:py-24 px-4 sm:px-8 lg:px-14 z-20">
      <div className="max-w-7xl mx-auto">
        {/* Single Wide Bracketed Panel */}
        <div
          ref={panelRef}
          className="bracket-panel p-8 sm:p-12 lg:p-14 select-none"
          data-readout="ENGINE AUDIT & VERIFICATION BENCHMARKS"
        >
          <span className="bracket-corner-tr" />
          <span className="bracket-corner-bl" />

          {/* Panel Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-8 border-b border-[rgba(63,245,230,0.15)] gap-3">
            <div className="font-mono text-xs sm:text-sm text-[#3FF5E6] tracking-widest uppercase flex items-center gap-2">
              <span className="text-[#3FF5E6] font-bold">//</span>
              <span>04 · VERIFICATION BENCHMARKS & ARCHITECTURAL METRICS</span>
            </div>
            <div className="font-mono text-[11px] text-[#4ADE80] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-[#4ADE80] rounded-full pulse-dot-green" />
              <span>ZERO UNCHECKED HYPOTHESES</span>
            </div>
          </div>

          {/* 4 Count-up Stats in JetBrains Mono */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {stats.map((stat, i) => (
              <div
                key={i}
                onMouseEnter={() => playHoverTick(soundEnabled)}
                className="flex flex-col group cursor-default"
                data-readout={stat.readout}
              >
                {/* Large cyan number */}
                <div className="font-mono text-4xl sm:text-5xl lg:text-6xl font-bold text-[#3FF5E6] tracking-tight mb-2 drop-shadow-[0_0_20px_rgba(63,245,230,0.35)] transition-transform duration-300 group-hover:translate-x-1">
                  {stat.value}
                </div>

                {/* Small uppercase mono label */}
                <div className="font-mono text-xs sm:text-sm font-semibold text-[#E6F1FF] tracking-wider uppercase mb-1">
                  {stat.label}
                </div>

                {/* Explanatory muted text */}
                <div className="text-xs text-[#7A8CA3] leading-snug">
                  {stat.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
