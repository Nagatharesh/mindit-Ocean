import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Play } from 'lucide-react';
import { CascadeGraph3D, CAUSAL_EDGES, CausalEdge } from './CascadeGraph3D';
import { playHoverTick, playSonarPing, playVerifyChime } from '../utils/audio';

interface BRCVSectionProps {
  soundEnabled: boolean;
}

export const BRCVSection: React.FC<BRCVSectionProps> = ({ soundEnabled }) => {
  const [selectedEdgeId, setSelectedEdgeId] = useState<string>('dhw-bleaching');
  const [hasRunCounterfactual, setHasRunCounterfactual] = useState<boolean>(true);
  const [isCounterfactualRunning, setIsCounterfactualRunning] = useState<boolean>(false);
  const [showPseudocode, setShowPseudocode] = useState<boolean>(false);

  const selectedEdge: CausalEdge =
    CAUSAL_EDGES.find((e) => e.id === selectedEdgeId) || CAUSAL_EDGES[1];

  const handleSelectEdge = (id: string) => {
    playHoverTick(soundEnabled);
    setSelectedEdgeId(id);
    setHasRunCounterfactual(false);
  };

  const handleRunCounterfactual = () => {
    setIsCounterfactualRunning(true);
    playSonarPing(soundEnabled);
    setTimeout(() => {
      setIsCounterfactualRunning(false);
      setHasRunCounterfactual(true);
      playVerifyChime(soundEnabled);
    }, 700);
  };

  const verdictColor =
    selectedEdge.verdict === 'VERIFIED'
      ? '#4ADE80'
      : selectedEdge.verdict === 'PHYSICS-GAP'
      ? '#B18CFF'
      : '#FF5A5F';

  return (
    <section
      id="brcv"
      className="relative w-full py-24 sm:py-32 px-4 sm:px-8 lg:px-14 z-20"
      aria-labelledby="brcv-heading"
    >
      <div className="max-w-[1480px] mx-auto">
        {/* Section kicker */}
        <div
          className="font-mono text-xs sm:text-sm text-[#3FF5E6] tracking-widest uppercase mb-3 flex items-center gap-2"
          data-readout="SECTION 06 NOVEL VERIFICATION ALGORITHM"
        >
          <span className="text-[#3FF5E6] font-bold">//</span>
          <span>06 · NOVEL ALGORITHM</span>
        </div>

        {/* Heading & Sub-line */}
        <h2
          id="brcv-heading"
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#E6F1FF] tracking-tight mb-2 font-heading"
        >
          Bounded-Residual <br className="sm:hidden" />
          <span className="text-[#3FF5E6] drop-shadow-[0_0_20px_rgba(63,245,230,0.3)]">
            Counterfactual Verification.
          </span>
        </h2>
        <p className="text-sm sm:text-base text-[#A6C0DE] font-mono mb-12">
          Every agent claim is tested by intervention. Neural networks may refine physics — never reverse it.
        </p>

        {/* Main Grid: Left 3D Causal Cascade Graph, Right Interactive Verification Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          {/* Left: 3D Causal Cascade Graph */}
          <div className="lg:col-span-7 bracket-panel p-4 sm:p-6 overflow-hidden">
            <span className="bracket-corner-tr" />
            <span className="bracket-corner-bl" />

            <div className="flex items-center justify-between pb-3 mb-2 border-b border-[rgba(63,245,230,0.14)]">
              <span className="font-mono text-xs text-[#3FF5E6] tracking-wider uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3FF5E6] animate-pulse" />
                3D CAUSAL CASCADE GRAPH · SELECT EDGE TO AUDIT
              </span>
              <span className="font-mono text-[10px] text-[#7A8CA3] hidden sm:inline">
                INTERACTIVE ORBIT
              </span>
            </div>

            <CascadeGraph3D
              selectedEdgeId={selectedEdgeId}
              onSelectEdge={handleSelectEdge}
            />

            {/* Quick Edge Switcher Buttons */}
            <div className="flex flex-wrap gap-2 pt-3 border-t border-[rgba(63,245,230,0.1)]">
              {CAUSAL_EDGES.map((edge) => (
                <button
                  key={edge.id}
                  onClick={() => handleSelectEdge(edge.id)}
                  onMouseEnter={() => playHoverTick(soundEnabled)}
                  className={`px-2.5 py-1 text-xs font-mono transition-colors cursor-pointer border ${
                    edge.id === selectedEdgeId
                      ? 'border-[#3FF5E6] text-[#3FF5E6] bg-[#3FF5E6]/10'
                      : 'border-[rgba(63,245,230,0.15)] text-[#7A8CA3] hover:text-[#E6F1FF]'
                  }`}
                >
                  {edge.claim}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Interactive Verification Panel */}
          <div
            className="lg:col-span-5 bracket-panel p-6 sm:p-7 select-none"
            data-readout={`AUDIT PANEL: ${selectedEdge.claim}`}
          >
            <span className="bracket-corner-tr" />
            <span className="bracket-corner-bl" />

            {/* Claim Header */}
            <div className="pb-4 mb-5 border-b border-[rgba(63,245,230,0.14)]">
              <span className="font-mono text-[10px] text-[#7A8CA3] tracking-widest uppercase block mb-1">
                AUDITED CAUSAL HYPOTHESIS
              </span>
              <div className="text-xl sm:text-2xl font-heading font-bold text-[#E6F1FF] flex items-center gap-2">
                <span>{selectedEdge.claim}</span>
              </div>
              <p className="text-xs text-[#A6C0DE] mt-1.5 leading-relaxed">
                {selectedEdge.note}
              </p>
            </div>

            {/* Counterfactual Intervention Trigger Button */}
            <div className="mb-6">
              <button
                onClick={handleRunCounterfactual}
                onMouseEnter={() => playHoverTick(soundEnabled)}
                disabled={isCounterfactualRunning}
                className="w-full py-3 px-4 bg-[#071626] border border-[#3FF5E6] text-[#3FF5E6] hover:bg-[#3FF5E6]/10 font-mono text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(63,245,230,0.15)]"
                data-readout="EXECUTE DO-CALCULUS COUNTERFACTUAL"
              >
                <Play className="w-3.5 h-3.5" />
                <span>
                  {isCounterfactualRunning
                    ? 'SIMULATING INTERVENTION...'
                    : `Run Counterfactual: do(${selectedEdge.source} = baseline)`}
                </span>
              </button>
            </div>

            {/* Animated Factual vs Counterfactual Bars */}
            <div className="mb-6 bg-[#02060D] p-4 border border-[rgba(63,245,230,0.15)]">
              <div className="flex items-center justify-between text-xs font-mono text-[#7A8CA3] mb-2">
                <span>DO-CALCULUS PROJECTION</span>
                <span className="text-[#3FF5E6] font-semibold">{selectedEdge.effect}</span>
              </div>

              {/* Factual Bar */}
              <div className="mb-2">
                <div className="flex justify-between text-[11px] font-mono text-[#A6C0DE] mb-1">
                  <span>FACTUAL (OBSERVED EVENT)</span>
                  <span className="text-[#FF5A5F]">HIGH STRESS</span>
                </div>
                <div className="w-full h-3 bg-[#071626] relative">
                  <div
                    className="h-full bg-[#FF5A5F] transition-all duration-700 ease-out"
                    style={{ width: hasRunCounterfactual ? '88%' : '75%' }}
                  />
                </div>
              </div>

              {/* Counterfactual Bar */}
              <div>
                <div className="flex justify-between text-[11px] font-mono text-[#A6C0DE] mb-1">
                  <span>COUNTERFACTUAL do(X = baseline)</span>
                  <span className="text-[#4ADE80]">MITIGATED</span>
                </div>
                <div className="w-full h-3 bg-[#071626] relative">
                  <div
                    className="h-full bg-[#4ADE80] transition-all duration-700 ease-out"
                    style={{ width: hasRunCounterfactual ? '28%' : '50%' }}
                  />
                </div>
              </div>
            </div>

            {/* Physics Share Circular Progress & Bound Display */}
            <div className="grid grid-cols-2 gap-4 pb-5 mb-5 border-b border-[rgba(63,245,230,0.12)]">
              {/* Physics Share Ring Gauge */}
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                    <circle
                      cx="24"
                      cy="24"
                      r="19"
                      fill="none"
                      stroke="rgba(63,245,230,0.15)"
                      strokeWidth="3"
                    />
                    <circle
                      cx="24"
                      cy="24"
                      r="19"
                      fill="none"
                      stroke="#3FF5E6"
                      strokeWidth="3.5"
                      strokeDasharray="119.38"
                      strokeDashoffset={119.38 * (1 - selectedEdge.physicsShare)}
                      className="transition-all duration-700"
                    />
                  </svg>
                  <span className="absolute font-mono text-[10px] font-bold text-[#E6F1FF]">
                    {Math.round(selectedEdge.physicsShare * 100)}%
                  </span>
                </div>
                <div>
                  <span className="font-mono text-[9px] text-[#7A8CA3] tracking-widest uppercase block">
                    PHYSICS SHARE
                  </span>
                  <span className="font-mono text-xs text-[#3FF5E6] font-semibold">
                    {Math.round(selectedEdge.physicsShare * 100)}% physics ·{' '}
                    {100 - Math.round(selectedEdge.physicsShare * 100)}% neural
                  </span>
                </div>
              </div>

              {/* Bound Display */}
              <div className="border-l border-[rgba(63,245,230,0.12)] pl-4 flex flex-col justify-center">
                <span className="font-mono text-[9px] text-[#7A8CA3] tracking-widest uppercase mb-1">
                  BOUND CONSTRAINT
                </span>
                <span className="font-mono text-xs text-[#E6F1FF] font-semibold">
                  |g_θ| ≤ λ·|f_physics|
                </span>
                <span className="font-mono text-[10px] text-[#3FF5E6]">λ = 0.3</span>
              </div>
            </div>

            {/* Verdict Stamp */}
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[#7A8CA3] uppercase tracking-wider">
                FINAL VERDICT:
              </span>
              <div
                className="px-4 py-2 font-mono text-sm font-bold tracking-widest uppercase border transition-all duration-500 shadow-[0_0_20px_rgba(63,245,230,0.15)] animate-in zoom-in-95 duration-200"
                style={{
                  color: verdictColor,
                  borderColor: verdictColor,
                  backgroundColor: `${verdictColor}18`,
                }}
              >
                {selectedEdge.verdict === 'VERIFIED' && '✓ VERIFIED'}
                {selectedEdge.verdict === 'PHYSICS-GAP' && '◆ PHYSICS-GAP'}
                {selectedEdge.verdict === 'UNSUPPORTED' && '✕ UNSUPPORTED'}
              </div>
            </div>
          </div>
        </div>

        {/* Verdict Legend Chips */}
        <div className="flex flex-wrap items-center justify-center gap-6 font-mono text-xs mb-8">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#4ADE80] rounded-sm shadow-[0_0_8px_#4ADE80]" />
            <span className="text-[#E6F1FF]">
              <strong>✓ VERIFIED</strong>: Causal effect proven with physics_share ≥ 1−λ
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#B18CFF] rounded-sm shadow-[0_0_8px_#B18CFF]" />
            <span className="text-[#E6F1FF]">
              <strong>◆ PHYSICS-GAP</strong>: Neural-only evidence; equations lack terms (flagged)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#FF5A5F] rounded-sm shadow-[0_0_8px_#FF5A5F]" />
            <span className="text-[#E6F1FF]">
              <strong>✕ UNSUPPORTED</strong>: Counterfactual fails significance or violates invariants
            </span>
          </div>
        </div>

        {/* Collapsible View Algorithm Pseudocode Panel */}
        <div className="bracket-panel overflow-hidden">
          <span className="bracket-corner-tr" />
          <span className="bracket-corner-bl" />
          <button
            onClick={() => {
              playHoverTick(soundEnabled);
              setShowPseudocode(!showPseudocode);
            }}
            className="w-full p-4 flex items-center justify-between text-left font-mono text-xs text-[#3FF5E6] hover:bg-[#3FF5E6]/5 transition-colors cursor-pointer select-none"
          >
            <span className="font-bold tracking-wider flex items-center gap-2">
              <span>// BRCV ALGORITHM SPECIFICATION & PSEUDOCODE</span>
              <span className="text-[10px] text-[#7A8CA3] font-normal">[Click to toggle]</span>
            </span>
            {showPseudocode ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showPseudocode && (
            <div className="p-5 border-t border-[rgba(63,245,230,0.12)] bg-[#02060D] font-mono text-xs text-[#A6C0DE] leading-relaxed overflow-x-auto">
              <pre className="text-[#3FF5E6]">
{`# Bounded-Residual Counterfactual Verification (BRCV)
for k in ensemble:
    g_θk ← clip(g_θk, −λ|f_phys|, +λ|f_phys|)
    v1 ← simulate(observed u);  v0 ← simulate(do(u = baseline))
    effect_k ← v1 − v0

μ, σ ← mean, std(effect)
physics_share ← |f_phys| / (|f_phys| + |g_θ|)

if sign(μ) == d and |μ| > z·σ and physics_share ≥ (1 − λ):
    return VERIFIED
elif sign(μ) == d:
    return PHYSICS-GAP   # Neural-only correlation, physics lacks formulation
else:
    return UNSUPPORTED  # Fails counterfactual intervention test`}
              </pre>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
