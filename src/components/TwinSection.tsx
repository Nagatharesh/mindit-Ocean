import React, { useState, useRef, useEffect } from 'react';
import { DepthLayers } from './DepthLayers';
import { playHoverTick, playSonarPing } from '../utils/audio';

interface TwinSectionProps {
  soundEnabled: boolean;
}

export const TwinSection: React.FC<TwinSectionProps> = ({ soundEnabled }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [hoveredLayer, setHoveredLayer] = useState<'surface' | 'thermocline' | 'seabed' | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const layers = [
    {
      id: 'surface' as const,
      name: 'SURFACE',
      reading: 'SST 30.4°C',
      description: 'Temperature, heat stress (DHW), forecasts',
      color: '#FF5A5F',
      metrics: '+2.4°C ANOMALY · DHW 9.2',
      details: 'Satellite infrared radiometers measure skin temperature. Ingests NOAA Coral Reef Watch 5km daily products.',
    },
    {
      id: 'thermocline' as const,
      name: 'THERMOCLINE',
      reading: 'O₂ 5.8 mg/L',
      description: 'Dissolved oxygen, hypoxia risk',
      color: '#3FF5E6',
      metrics: '35m PYCNOCLINE · STABLE',
      details: 'Vertical CTD profiles measure the density barrier. Detects dead zone upwelling before fish kills occur.',
    },
    {
      id: 'seabed' as const,
      name: 'SEABED',
      reading: 'CORAL 42%',
      description: 'Coral, herbivores, algae dynamics',
      color: '#4ADE80',
      metrics: 'ACROPORA MATRIX · STRESS 2',
      details: 'Autonomous acoustic sensors and photographic surveys track zooxanthellae density and turf algae grazing rates.',
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="twin"
      className="relative w-full py-24 sm:py-32 px-4 sm:px-8 lg:px-14 z-20"
      aria-labelledby="twin-heading"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section kicker */}
        <div
          className="font-mono text-xs sm:text-sm text-[#3FF5E6] tracking-widest uppercase mb-3 flex items-center gap-2"
          data-readout="SECTION 03 BATHYMETRIC STRATIFICATION"
        >
          <span className="text-[#3FF5E6] font-bold">//</span>
          <span>03 · SYSTEM</span>
        </div>

        {/* Heading */}
        <h2
          id="twin-heading"
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#E6F1FF] tracking-tight mb-4 font-heading"
        >
          The ocean, in <br className="sm:hidden" />
          <span className="text-[#3FF5E6] drop-shadow-[0_0_20px_rgba(63,245,230,0.3)]">
            three layers.
          </span>
        </h2>
        <p className="text-base sm:text-lg text-[#A6C0DE] max-w-2xl mb-12 font-normal">
          Ecosystem health is non-local and stratified. Heat trapped at the surface cascades down the water column, altering oxygen barriers before suffocating benthic reefs.
        </p>

        {/* Main Grid: Left 3D depth-layer stack, Right 3 bracketed rows */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: 3D Depth Layers Canvas */}
          <div className="lg:col-span-7 bracket-panel p-4 sm:p-6 overflow-hidden">
            <span className="bracket-corner-tr" />
            <span className="bracket-corner-bl" />

            <div className="flex items-center justify-between pb-3 mb-2 border-b border-[rgba(63,245,230,0.14)]">
              <span className="font-mono text-xs text-[#3FF5E6] tracking-wider uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3FF5E6] animate-pulse" />
                DIGITAL TWIN · VERTICAL CAUSAL CASCADE
              </span>
              <span className="font-mono text-[10px] text-[#7A8CA3] hidden sm:inline">
                TILT EXPLORATION
              </span>
            </div>

            <DepthLayers inView={inView} />
          </div>

          {/* Right: Three Bracketed Rows */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {layers.map((layer) => {
              const isHovered = hoveredLayer === layer.id;
              return (
                <div
                  key={layer.id}
                  onMouseEnter={() => {
                    playHoverTick(soundEnabled);
                    setHoveredLayer(layer.id);
                  }}
                  onMouseLeave={() => setHoveredLayer(null)}
                  onClick={() => playSonarPing(soundEnabled)}
                  className={`bracket-panel p-5 transition-all duration-300 cursor-pointer select-none ${
                    isHovered
                      ? 'border-[#3FF5E6] bg-[#071626]/90 shadow-[0_0_25px_rgba(63,245,230,0.2)] -translate-x-1'
                      : 'border-[rgba(63,245,230,0.14)]'
                  }`}
                  data-readout={`${layer.name} · ${layer.reading}`}
                >
                  <span className="bracket-corner-tr" />
                  <span className="bracket-corner-bl" />

                  {/* Header */}
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-[rgba(63,245,230,0.1)]">
                    <div className="flex items-center gap-2 font-mono text-xs font-bold tracking-wider text-[#E6F1FF]">
                      <span
                        className="w-2 h-2 rounded-full inline-block"
                        style={{ backgroundColor: layer.color }}
                      />
                      <span>{layer.name}</span>
                    </div>

                    <div
                      className="font-mono text-xs font-semibold px-2 py-0.5 border"
                      style={{
                        color: layer.color,
                        borderColor: `${layer.color}40`,
                        backgroundColor: `${layer.color}10`,
                      }}
                    >
                      {layer.reading}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="text-sm font-medium text-[#E6F1FF] mb-1.5">
                    {layer.description}
                  </div>

                  {/* Details */}
                  <p className="text-xs text-[#7A8CA3] leading-relaxed mb-3">
                    {layer.details}
                  </p>

                  {/* Footer telemetry */}
                  <div className="pt-2 border-t border-[rgba(63,245,230,0.08)] flex items-center justify-between font-mono text-[10px] text-[#A6C0DE]">
                    <span>METRIC:</span>
                    <span className="text-[#3FF5E6] font-semibold">{layer.metrics}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
