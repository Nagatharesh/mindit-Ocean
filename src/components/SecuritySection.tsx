import React, { useState } from 'react';
import { ShieldCheck, AlertOctagon } from 'lucide-react';
import { playHoverTick, playSonarPing } from '../utils/audio';

interface SecuritySectionProps {
  soundEnabled: boolean;
}

export const SecuritySection: React.FC<SecuritySectionProps> = ({ soundEnabled }) => {
  const [activeAttack, setActiveAttack] = useState<string | null>(null);
  const [blockedLayerId, setBlockedLayerId] = useState<string | null>(null);
  const [attackMessage, setAttackMessage] = useState<string | null>(null);

  const layers = [
    { id: 'L1', name: 'INPUT', desc: 'Physical range validation (rejection of unphysical temperature/salinity spikes)' },
    { id: 'L2', name: 'CONSISTENCY', desc: 'Satellite ↔ buoy cross-check (detects sensor drift and unilateral spoofing)' },
    { id: 'L3', name: 'LEARNED ANOMALY', desc: 'Autoencoder reconstruction error (flags multivariate adversarial anomalies)' },
    { id: 'L4', name: 'PROMPT', desc: 'Injection scan + strict JSON schemas (blocks prompt hijacking in agent prompts)' },
    { id: 'L5', name: 'MODEL INTEGRITY', desc: 'SHA-256 weight hashes + data provenance (cryptographic runtime attestation)' },
    { id: 'L6', name: 'REASONING INTEGRITY', desc: 'Prefix-only replay, BRCV bound, no-regression (prevents drift)' },
    { id: 'L7', name: 'ACCESS', desc: 'API keys, role-based access, rate limits, TLS (zero-trust edge security)' },
    { id: 'L8', name: 'PRIVACY & AUDIT', desc: 'Tenant isolation + hash-chained audit log (immutable verification trail)' },
  ];

  const handleTriggerAttack = (type: 'crude' | 'subtle' | 'coordinated') => {
    setActiveAttack(type);
    setBlockedLayerId(null);
    playHoverTick(soundEnabled);

    if (type === 'crude') {
      setAttackMessage('INJECTING: SST = 60°C (Crude Sensor Spike)...');
      setTimeout(() => {
        setBlockedLayerId('L1');
        setAttackMessage('BLOCKED AT L1 · REJECTED: SST 60°C EXCEEDS PHYSICAL BOUND (-2°C to 38°C)');
        playSonarPing(soundEnabled);
      }, 500);
    } else if (type === 'subtle') {
      setAttackMessage('INJECTING: Subtly Manipulated Buoy Record (+1.4°C drift)...');
      setTimeout(() => {
        setBlockedLayerId('L2');
        setAttackMessage('BLOCKED AT L2 · REJECTED: SATELLITE ↔ BUOY RESIDUAL DIVERGENCE > 1.8σ');
        playSonarPing(soundEnabled);
      }, 850);
    } else if (type === 'coordinated') {
      setAttackMessage('INJECTING: Coordinated Cross-Source Spoofing (Buoy + Satellite)...');
      setTimeout(() => {
        setBlockedLayerId('L3');
        setAttackMessage('BLOCKED AT L3 · AUTOENCODER ANOMALY SCORE 0.94 (LATENT RECONSTRUCTION FAIL)');
        playSonarPing(soundEnabled);
      }, 1200);
    }
  };

  const auditBlocks = [
    { hash: 'a3f9e1', name: 'NOAA-CRW-5km', time: 'T-12m' },
    { hash: '7c21b4', name: 'ARGO-BUOY-44013', time: 'T-8m' },
    { hash: '88de02', name: 'LSTM-FORECAST', time: 'T-4m' },
    { hash: '12fa90', name: 'BRCV-DO-CALCULUS', time: 'T-1m' },
    { hash: '4f99bb', name: 'DREAM-SYNTHESIS', time: 'NOW', active: true },
  ];

  return (
    <section
      id="security"
      className="relative w-full py-24 sm:py-32 px-4 sm:px-8 lg:px-14 z-20"
      aria-labelledby="security-heading"
    >
      <div className="max-w-[1480px] mx-auto">
        {/* Section kicker */}
        <div
          className="font-mono text-xs sm:text-sm text-[#3FF5E6] tracking-widest uppercase mb-3 flex items-center gap-2"
          data-readout="SECTION 09 8-LAYER AGENTIC SECURITY"
        >
          <span className="text-[#3FF5E6] font-bold">//</span>
          <span>09 · 8-LAYER SECURITY</span>
        </div>

        {/* Heading */}
        <h2
          id="security-heading"
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#E6F1FF] tracking-tight mb-4 font-heading"
        >
          Trust is engineered, <br className="sm:hidden" />
          <span className="text-[#3FF5E6] drop-shadow-[0_0_20px_rgba(63,245,230,0.3)]">
            not assumed.
          </span>
        </h2>
        <p className="text-base sm:text-lg text-[#A6C0DE] max-w-2xl mb-12 font-normal">
          An eight-tier defense shield sanitizes raw physical sensory feeds, isolates agent prompts, guarantees neural weights, and preserves cryptographic chain-of-custody.
        </p>

        {/* Main Grid: Left 8-layer stack, Right Poison-the-data simulator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          {/* Left: 8 Layer Plates */}
          <div className="lg:col-span-7 flex flex-col gap-2.5">
            {layers.map((l) => {
              const isBlockedHere = blockedLayerId === l.id;
              return (
                <div
                  key={l.id}
                  className={`bracket-panel p-3.5 sm:p-4 flex items-center justify-between transition-all duration-300 ${
                    isBlockedHere
                      ? 'border-[#FF5A5F] bg-[#FF5A5F]/15 shadow-[0_0_25px_rgba(255,90,95,0.4)] animate-pulse'
                      : 'border-[rgba(63,245,230,0.14)] hover:border-[rgba(63,245,230,0.35)]'
                  }`}
                  data-readout={`SECURITY LAYER ${l.id}: ${l.name}`}
                >
                  <span className="bracket-corner-tr" />
                  <span className="bracket-corner-bl" />

                  <div className="flex items-center gap-3">
                    <span
                      className={`font-mono text-xs font-bold px-2 py-0.5 border ${
                        isBlockedHere
                          ? 'border-[#FF5A5F] text-[#FF5A5F] bg-[#FF5A5F]/20'
                          : 'border-[#3FF5E6]/40 text-[#3FF5E6] bg-[#3FF5E6]/10'
                      }`}
                    >
                      {l.id}
                    </span>
                    <div>
                      <span className="font-mono text-xs font-bold text-[#E6F1FF] mr-2">
                        {l.name}
                      </span>
                      <span className="text-xs text-[#A6C0DE] hidden sm:inline">
                        — {l.desc}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 font-mono text-[10px]">
                    {isBlockedHere ? (
                      <span className="text-[#FF5A5F] font-bold flex items-center gap-1">
                        <AlertOctagon className="w-3.5 h-3.5" />
                        BLOCKED
                      </span>
                    ) : (
                      <span className="text-[#4ADE80] flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        PASS
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: "POISON THE DATA" Interactive Attack Simulator */}
          <div
            className="lg:col-span-5 bracket-panel p-6 sm:p-8 select-none bg-[#07121F]/95"
            data-readout="ADVERSARIAL POISONING INJECTION PANEL"
          >
            <span className="bracket-corner-tr" />
            <span className="bracket-corner-bl" />

            <div className="flex items-center justify-between pb-3 mb-6 border-b border-[rgba(63,245,230,0.14)]">
              <span className="font-mono text-xs text-[#FF5A5F] font-bold tracking-widest uppercase flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-[#FF5A5F]" />
                POISON THE DATA · ADVERSARIAL SANDBOX
              </span>
              <span className="font-mono text-[10px] text-[#7A8CA3]">LIVE DRILL</span>
            </div>

            <p className="text-xs text-[#A6C0DE] leading-relaxed mb-6">
              Test how TideMind's layered defenses withstand sensor malfunction, single-source falsification, and coordinated multivariate attacks.
            </p>

            {/* 3 Red Outline Buttons */}
            <div className="flex flex-col gap-3.5 mb-6">
              <button
                onClick={() => handleTriggerAttack('crude')}
                onMouseEnter={() => playHoverTick(soundEnabled)}
                className={`py-3 px-4 border text-left font-mono text-xs tracking-wider transition-all cursor-pointer ${
                  activeAttack === 'crude'
                    ? 'border-[#FF5A5F] bg-[#FF5A5F]/20 text-[#FF5A5F] shadow-[0_0_15px_rgba(255,90,95,0.3)]'
                    : 'border-[#FF5A5F]/40 hover:border-[#FF5A5F] text-[#E6F1FF] hover:bg-[#FF5A5F]/10'
                }`}
              >
                <div className="font-bold flex items-center justify-between">
                  <span>[Crude attack: SST 60°C]</span>
                  <span className="text-[10px] text-[#FF5A5F]">TARGET: L1</span>
                </div>
                <div className="text-[11px] text-[#7A8CA3] mt-0.5">
                  Gross physical sensor malfunction or corrupted decimal
                </div>
              </button>

              <button
                onClick={() => handleTriggerAttack('subtle')}
                onMouseEnter={() => playHoverTick(soundEnabled)}
                className={`py-3 px-4 border text-left font-mono text-xs tracking-wider transition-all cursor-pointer ${
                  activeAttack === 'subtle'
                    ? 'border-[#FF5A5F] bg-[#FF5A5F]/20 text-[#FF5A5F] shadow-[0_0_15px_rgba(255,90,95,0.3)]'
                    : 'border-[#FF5A5F]/40 hover:border-[#FF5A5F] text-[#E6F1FF] hover:bg-[#FF5A5F]/10'
                }`}
              >
                <div className="font-bold flex items-center justify-between">
                  <span>[Subtle attack: one fake buoy]</span>
                  <span className="text-[10px] text-[#FF5A5F]">TARGET: L2</span>
                </div>
                <div className="text-[11px] text-[#7A8CA3] mt-0.5">
                  Plausible SST elevation on a single isolated sensor
                </div>
              </button>

              <button
                onClick={() => handleTriggerAttack('coordinated')}
                onMouseEnter={() => playHoverTick(soundEnabled)}
                className={`py-3 px-4 border text-left font-mono text-xs tracking-wider transition-all cursor-pointer ${
                  activeAttack === 'coordinated'
                    ? 'border-[#FF5A5F] bg-[#FF5A5F]/20 text-[#FF5A5F] shadow-[0_0_15px_rgba(255,90,95,0.3)]'
                    : 'border-[#FF5A5F]/40 hover:border-[#FF5A5F] text-[#E6F1FF] hover:bg-[#FF5A5F]/10'
                }`}
              >
                <div className="font-bold flex items-center justify-between">
                  <span>[Coordinated attack: both sources]</span>
                  <span className="text-[10px] text-[#FF5A5F]">TARGET: L3</span>
                </div>
                <div className="text-[11px] text-[#7A8CA3] mt-0.5">
                  Complex multi-source injection masked across ranges
                </div>
              </button>
            </div>

            {/* Defense Diagnostic Log Box */}
            <div className="p-3.5 bg-[#02060D] border border-[rgba(63,245,230,0.15)] font-mono text-xs min-h-[64px] flex items-center">
              {attackMessage ? (
                <div className="text-[#3FF5E6] leading-tight">
                  <span className="text-[10px] text-[#7A8CA3] block mb-1">// SHIELD TELEMETRY</span>
                  <span>{attackMessage}</span>
                </div>
              ) : (
                <span className="text-[#7A8CA3]">
                  Select an attack above to simulate adversarial penetration across the 8-layer stack.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Horizontal Cryptographic Audit Chain */}
        <div className="bracket-panel p-6 select-none bg-[#07121F]/90">
          <span className="bracket-corner-tr" />
          <span className="bracket-corner-bl" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 mb-4 border-b border-[rgba(63,245,230,0.14)] gap-2">
            <span className="font-mono text-xs text-[#3FF5E6] tracking-wider uppercase">
              // CRYPTOGRAPHIC SHA-256 AUDIT TRAIL
            </span>
            <span className="font-mono text-xs text-[#4ADE80] font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#4ADE80]" />
              MODEL INTEGRITY ✓ 4/4 VERIFIED
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono">
            {auditBlocks.map((blk, i) => (
              <div
                key={blk.hash}
                className={`p-3 border text-xs flex flex-col justify-between ${
                  blk.active
                    ? 'border-[#3FF5E6] bg-[#3FF5E6]/10 shadow-[0_0_15px_rgba(63,245,230,0.3)]'
                    : 'border-[rgba(63,245,230,0.15)] bg-[#02060D]/60'
                }`}
              >
                <div className="flex justify-between text-[10px] text-[#7A8CA3] mb-1">
                  <span>BLOCK #{i + 1}</span>
                  <span>{blk.time}</span>
                </div>
                <div className="text-sm font-bold text-[#3FF5E6] mb-1">
                  {blk.hash}…
                </div>
                <div className="text-[10px] text-[#A6C0DE] truncate">
                  {blk.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
