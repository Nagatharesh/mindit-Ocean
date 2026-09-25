import React from 'react';

interface DepthGaugeProps {
  scrollProgress: number; // 0 to 1
}

export const DepthGauge: React.FC<DepthGaugeProps> = ({ scrollProgress }) => {
  // Map 0 to 1 scrollProgress to 0m to 200m
  const currentDepthMeters = Math.min(200, Math.max(0, Math.round(scrollProgress * 200)));
  const formattedDepth = `DEPTH ${String(currentDepthMeters).padStart(3, '0')}m`;

  const sectionTicks = [
    { label: '0m', name: 'SURFACE', pos: 0 },
    { label: '16m', name: 'PROBLEM', pos: 8 },
    { label: '32m', name: 'SOLUTION', pos: 16 },
    { label: '48m', name: 'TWIN', pos: 24 },
    { label: '64m', name: 'AGENTS', pos: 32 },
    { label: '80m', name: 'MODELS', pos: 40 },
    { label: '96m', name: 'BRCV', pos: 48 },
    { label: '112m', name: 'WHAT-IF', pos: 56 },
    { label: '128m', name: 'DREAM', pos: 64 },
    { label: '144m', name: 'SECURITY', pos: 72 },
    { label: '160m', name: 'USERS', pos: 80 },
    { label: '176m', name: 'BUSINESS', pos: 88 },
    { label: '190m', name: 'RESEARCH', pos: 95 },
    { label: '200m', name: 'BENTHIC', pos: 100 },
  ];

  return (
    <aside
      className="hidden md:flex fixed left-5 top-1/2 -translate-y-1/2 z-40 flex-col items-start pointer-events-none select-none"
      aria-label="Bathymetric Depth Gauge"
      data-readout={formattedDepth}
    >
      <div className="font-mono text-[9px] tracking-widest text-[#7A8CA3] mb-2 flex items-center gap-1">
        <span className="text-[#3FF5E6]">▼</span>
        <span>BATHYMETRY</span>
      </div>

      <div className="relative h-[340px] w-28 flex items-center">
        {/* Main vertical line */}
        <div className="absolute left-2 top-0 bottom-0 w-[1px] bg-[rgba(63,245,230,0.18)]" />

        {/* Section Depth Ticks */}
        {sectionTicks.map((tick) => (
          <div
            key={tick.name}
            className="absolute left-2 flex items-center"
            style={{ top: `${tick.pos}%` }}
          >
            <div
              className={`h-[1px] ${
                tick.pos % 24 === 0
                  ? 'w-3 bg-[rgba(63,245,230,0.5)]'
                  : 'w-1.5 bg-[rgba(63,245,230,0.22)]'
              }`}
            />
            <span className="font-mono text-[8px] text-[#7A8CA3] ml-1.5 tracking-tight whitespace-nowrap">
              {tick.label} <span className="opacity-60">{tick.name}</span>
            </span>
          </div>
        ))}

        {/* Moving Cyan Depth Marker */}
        <div
          className="absolute left-0 flex items-center transition-all duration-150 ease-out z-10"
          style={{ top: `${scrollProgress * 100}%` }}
        >
          {/* Indicator Pip */}
          <div className="w-3.5 h-[2px] bg-[#3FF5E6] shadow-[0_0_8px_#3FF5E6]" />
          <div className="w-1.5 h-1.5 rotate-45 bg-[#3FF5E6] -ml-1 shadow-[0_0_6px_#3FF5E6]" />
          
          {/* Current Depth Badge */}
          <div className="ml-1.5 font-mono text-[10px] font-bold text-[#3FF5E6] bg-[#07121F]/95 border border-[#3FF5E6] px-1.5 py-0.5 whitespace-nowrap shadow-[0_0_12px_rgba(63,245,230,0.35)]">
            {formattedDepth}
          </div>
        </div>
      </div>

      <div className="mt-2 font-mono text-[9px] text-[#7A8CA3] tracking-widest uppercase">
        09.12°N / 79.13°E
      </div>
    </aside>
  );
};
