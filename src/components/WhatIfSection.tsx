import React, { useState } from 'react';
import { playHoverTick } from '../utils/audio';

interface WhatIfSectionProps {
  soundEnabled: boolean;
}

export const WhatIfSection: React.FC<WhatIfSectionProps> = ({ soundEnabled }) => {
  const [nutrientReduction, setNutrientReduction] = useState<number>(30); // 0 to 50%
  const [fishingClosure, setFishingClosure] = useState<number>(75); // 0 to 100%
  const [warmingScenario, setWarmingScenario] = useState<number>(1.2); // 0 to 2°C

  // Base no-action coral cover at 12 months (degrades with warming)
  const baseCoral = Math.max(12, Math.round(38 - warmingScenario * 12));

  // Intervened coral cover calculation
  const interventionGain = Math.round(
    (nutrientReduction / 50) * 8 + (fishingClosure / 100) * 11 - (warmingScenario - 1.0) * 4
  );
  const intervenedCoral = Math.min(85, Math.max(baseCoral + 4, baseCoral + interventionGain));

  // Generate 12-month trajectory points
  const noActionPoints = Array.from({ length: 12 }, (_, i) => {
    const t = i / 11;
    return Math.round(52 - t * (52 - baseCoral));
  });

  const intervenedPoints = Array.from({ length: 12 }, (_, i) => {
    const t = i / 11;
    // Dips first due to heat, then recovers thanks to herbivory & reduced runoff
    const dip = Math.sin(t * Math.PI) * 4;
    return Math.round(52 - t * (52 - intervenedCoral) - dip * 0.5);
  });

  // SVG coordinate builder (width 260, height 100)
  const buildSvgPath = (pts: number[]) => {
    return pts
      .map((p, idx) => {
        const x = (idx / 11) * 260 + 10;
        // Map 0-100% to y = 90 down to y = 10
        const y = 90 - (p / 70) * 75;
        return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');
  };

  return (
    <section
      id="what-if"
      className="relative w-full py-24 sm:py-32 px-4 sm:px-8 lg:px-14 z-20"
      aria-labelledby="whatif-heading"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section kicker */}
        <div
          className="font-mono text-xs sm:text-sm text-[#3FF5E6] tracking-widest uppercase mb-3 flex items-center gap-2"
          data-readout="SECTION 07 INTERVENTION SANDBOX"
        >
          <span className="text-[#3FF5E6] font-bold">//</span>
          <span>07 · COUNTERFACTUALS</span>
        </div>

        {/* Heading */}
        <h2
          id="whatif-heading"
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#E6F1FF] tracking-tight mb-4 font-heading"
        >
          Don't just predict. <br className="sm:hidden" />
          <span className="text-[#3FF5E6] drop-shadow-[0_0_20px_rgba(63,245,230,0.3)]">
            Decide.
          </span>
        </h2>
        <p className="text-base sm:text-lg text-[#A6C0DE] max-w-2xl mb-12 font-normal">
          Simulate targeted ecological policies before deploying municipal resources. Contrast baseline collapse against intervention trajectories in real time.
        </p>

        {/* Interactive Sliders Panel */}
        <div className="bracket-panel p-6 sm:p-8 mb-10 select-none">
          <span className="bracket-corner-tr" />
          <span className="bracket-corner-bl" />

          <div className="font-mono text-xs text-[#3FF5E6] uppercase tracking-wider mb-6 pb-2 border-b border-[rgba(63,245,230,0.14)] flex items-center justify-between">
            <span>// POLICY & CLIMATIC CONTROLS</span>
            <span className="text-[10px] text-[#7A8CA3]">ILLUSTRATIVE DEMO DATA</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Slider 1: Nutrient Runoff */}
            <div>
              <div className="flex justify-between font-mono text-xs mb-2">
                <span className="text-[#E6F1FF]">Reduce nutrient runoff:</span>
                <span className="text-[#3FF5E6] font-bold">{nutrientReduction}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={nutrientReduction}
                onChange={(e) => setNutrientReduction(Number(e.target.value))}
                onInput={() => playHoverTick(soundEnabled)}
                className="w-full accent-[#3FF5E6] cursor-pointer"
                aria-label="Reduce nutrient runoff"
              />
              <span className="font-mono text-[10px] text-[#7A8CA3] mt-1 block">
                Limits agricultural macroalgae fuel
              </span>
            </div>

            {/* Slider 2: Fishing Closure */}
            <div>
              <div className="flex justify-between font-mono text-xs mb-2">
                <span className="text-[#E6F1FF]">Herbivore fishing closure:</span>
                <span className="text-[#4ADE80] font-bold">{fishingClosure}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={fishingClosure}
                onChange={(e) => setFishingClosure(Number(e.target.value))}
                onInput={() => playHoverTick(soundEnabled)}
                className="w-full accent-[#4ADE80] cursor-pointer"
                aria-label="Herbivore fishing closure"
              />
              <span className="font-mono text-[10px] text-[#7A8CA3] mt-1 block">
                Preserves parrotfish grazing pressure
              </span>
            </div>

            {/* Slider 3: Warming Scenario */}
            <div>
              <div className="flex justify-between font-mono text-xs mb-2">
                <span className="text-[#E6F1FF]">Warming scenario:</span>
                <span className="text-[#FF5A5F] font-bold">+{warmingScenario.toFixed(1)}°C</span>
              </div>
              <input
                type="range"
                min="0"
                max="2.0"
                step="0.1"
                value={warmingScenario}
                onChange={(e) => setWarmingScenario(Number(e.target.value))}
                onInput={() => playHoverTick(soundEnabled)}
                className="w-full accent-[#FF5A5F] cursor-pointer"
                aria-label="Warming scenario"
              />
              <span className="font-mono text-[10px] text-[#7A8CA3] mt-1 block">
                IPCC SSP2-4.5 regional sea surface anomaly
              </span>
            </div>
          </div>
        </div>

        {/* Split Screen: No Action vs With Intervention */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
          {/* NO ACTION */}
          <div
            className="bracket-panel p-6 sm:p-8 flex flex-col justify-between border-[rgba(255,90,95,0.3)] bg-[#07121F]/80"
            data-readout="BASELINE COLLAPSE TRAJECTORY"
          >
            <span className="bracket-corner-tr" />
            <span className="bracket-corner-bl" />

            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[rgba(255,90,95,0.2)]">
                <span className="font-mono text-xs text-[#FF5A5F] font-bold tracking-widest uppercase">
                  // NO ACTION (BASELINE)
                </span>
                <span className="w-2 h-2 rounded-full bg-[#FF5A5F] pulse-dot-red" />
              </div>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="font-mono text-4xl sm:text-5xl font-bold text-[#FF5A5F]">
                  {baseCoral}%
                </span>
                <span className="font-mono text-xs text-[#7A8CA3]">CORAL COVER @ 12 MO</span>
              </div>

              <p className="text-xs text-[#A6C0DE] leading-relaxed mb-6">
                Severe bleaching triggers trophic cascade; unmanaged macroalgae smother remaining substrate within 8 months.
              </p>

              {/* Trajectory Chart */}
              <div className="w-full h-32 bg-[#02060D] border border-[rgba(255,90,95,0.2)] p-2 relative flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 280 100">
                  <path
                    d={buildSvgPath(noActionPoints)}
                    fill="none"
                    stroke="#FF5A5F"
                    strokeWidth="2.5"
                  />
                  <text x="15" y="25" fill="#7A8CA3" fontSize="8" fontFamily="JetBrains Mono">MONTH 0: 52%</text>
                  <text x="190" y="85" fill="#FF5A5F" fontSize="8" fontFamily="JetBrains Mono">M12: {baseCoral}%</text>
                </svg>
              </div>
            </div>
          </div>

          {/* WITH INTERVENTION */}
          <div
            className="bracket-panel p-6 sm:p-8 flex flex-col justify-between border-[rgba(74,222,128,0.4)] bg-[#07121F]/90 shadow-[0_0_30px_rgba(74,222,128,0.12)]"
            data-readout="MANAGED RECOVERY TRAJECTORY"
          >
            <span className="bracket-corner-tr" />
            <span className="bracket-corner-bl" />

            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[rgba(74,222,128,0.2)]">
                <span className="font-mono text-xs text-[#4ADE80] font-bold tracking-widest uppercase">
                  // WITH INTERVENTION
                </span>
                <span className="w-2 h-2 rounded-full bg-[#4ADE80] pulse-dot-green" />
              </div>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="font-mono text-4xl sm:text-5xl font-bold text-[#4ADE80] drop-shadow-[0_0_15px_rgba(74,222,128,0.4)]">
                  {intervenedCoral}%
                </span>
                <span className="font-mono text-xs text-[#3FF5E6]">
                  +{intervenedCoral - baseCoral}% SURVIVAL GAIN
                </span>
              </div>

              <p className="text-xs text-[#A6C0DE] leading-relaxed mb-6">
                Active herbivore preservation keeps algae low, allowing surviving thermal-tolerant recruits to re-seed degraded zones.
              </p>

              {/* Trajectory Chart */}
              <div className="w-full h-32 bg-[#02060D] border border-[rgba(74,222,128,0.2)] p-2 relative flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 280 100">
                  <path
                    d={buildSvgPath(intervenedPoints)}
                    fill="none"
                    stroke="#4ADE80"
                    strokeWidth="2.5"
                  />
                  <text x="15" y="25" fill="#7A8CA3" fontSize="8" fontFamily="JetBrains Mono">MONTH 0: 52%</text>
                  <text x="190" y="45" fill="#4ADE80" fontSize="8" fontFamily="JetBrains Mono">M12: {intervenedCoral}%</text>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Small Muted Note */}
        <div className="text-center font-mono text-[11px] text-[#7A8CA3]">
          Illustrative model. Real runs use the TideMind numerical hydrodynamic and ecological simulator.
        </div>
      </div>
    </section>
  );
};
