import React from 'react';
import { playHoverTick, playSonarPing } from '../utils/audio';

interface BusinessSectionProps {
  soundEnabled: boolean;
}

export const BusinessSection: React.FC<BusinessSectionProps> = ({ soundEnabled }) => {
  const tiers = [
    {
      name: 'FREE',
      target: 'Researchers & students',
      features: ['1 marine observation region', 'Frozen backtest sandbox', 'Public data ingest access'],
      cta: 'Free Tier',
      isPopular: false,
    },
    {
      name: 'FARM',
      target: 'Aquaculture operators',
      features: ['Per-site early warnings', 'SMS & WhatsApp alert feeds', 'Interactive What-If simulator'],
      cta: 'Contact Sales',
      isPopular: true,
    },
    {
      name: 'ENTERPRISE',
      target: 'Insurers, agencies, blue-carbon',
      features: ['Audit-grade verification reports', 'Parametric loss triggers', 'Full REST & WebSocket API'],
      cta: 'Contact Sales',
      isPopular: false,
    },
    {
      name: 'DATA API',
      target: 'Research institutions',
      features: ['Anonymised verified cascades', 'Raw neural-ODE weights', 'High-throughput batch export'],
      cta: 'Request Access',
      isPopular: false,
    },
  ];

  const noveltyScores = [
    { name: 'BRCV counterfactual verification', score: 9 },
    { name: 'Simulator-verified agents', score: 9 },
    { name: '8-layer agentic security', score: 9 },
    { name: 'physics_share + Physics-Gap', score: 8 },
    { name: 'Replay-based RSI', score: 7 },
    { name: '3D explainable twin', score: 7 },
  ];

  return (
    <section
      id="business"
      className="relative w-full py-24 sm:py-32 px-4 sm:px-8 lg:px-14 z-20"
      aria-labelledby="business-heading"
    >
      <div className="max-w-[1480px] mx-auto">
        {/* Section kicker */}
        <div
          className="font-mono text-xs sm:text-sm text-[#3FF5E6] tracking-widest uppercase mb-3 flex items-center gap-2"
          data-readout="SECTION 11 COMMERCIAL ARCHITECTURE & NOVELTY RATINGS"
        >
          <span className="text-[#3FF5E6] font-bold">//</span>
          <span>11 · BUSINESS & NOVELTY</span>
        </div>

        {/* Heading */}
        <h2
          id="business-heading"
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#E6F1FF] tracking-tight mb-4 font-heading"
        >
          Freemium to B2B. <br className="sm:hidden" />
          <span className="text-[#3FF5E6] drop-shadow-[0_0_20px_rgba(63,245,230,0.3)]">
            Moat: verified history.
          </span>
        </h2>
        <p className="text-base sm:text-lg text-[#A6C0DE] max-w-2xl mb-12 font-normal">
          Competitive defensibility is rooted in historical causal graphs tested across verified thermodynamic backtests.
        </p>

        {/* 4 Pricing-Style Tier Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {tiers.map((t) => (
            <div
              key={t.name}
              onMouseEnter={() => playHoverTick(soundEnabled)}
              className={`bracket-panel p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 select-none ${
                t.isPopular
                  ? 'border-[#3FF5E6] bg-[#071626]/90 shadow-[0_0_30px_rgba(63,245,230,0.18)] -translate-y-1'
                  : 'border-[rgba(63,245,230,0.14)]'
              }`}
              data-readout={`DEPLOYMENT TIER: ${t.name}`}
            >
              <span className="bracket-corner-tr" />
              <span className="bracket-corner-bl" />

              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[rgba(63,245,230,0.12)]">
                  <h3 className="font-mono text-base font-bold text-[#3FF5E6] tracking-wider uppercase">
                    {t.name}
                  </h3>
                  {t.isPopular && (
                    <span className="font-mono text-[9px] text-[#02060D] bg-[#3FF5E6] px-1.5 py-0.5 font-bold">
                      POPULAR
                    </span>
                  )}
                </div>

                <div className="text-xs text-[#A6C0DE] mb-5 font-mono">
                  {t.target}
                </div>

                <ul className="space-y-2.5 mb-8">
                  {t.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-[#E6F1FF] leading-snug">
                      <span className="text-[#3FF5E6] font-bold">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <button
                  onClick={() => playSonarPing(soundEnabled)}
                  onMouseEnter={() => playHoverTick(soundEnabled)}
                  className={`w-full py-2.5 px-4 font-mono text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer border ${
                    t.isPopular
                      ? 'bg-[#3FF5E6] text-[#02060D] border-[#3FF5E6] hover:bg-[#68FFF3]'
                      : 'bg-transparent text-[#E6F1FF] border-[rgba(63,245,230,0.3)] hover:border-[#3FF5E6] hover:text-[#3FF5E6]'
                  }`}
                >
                  {t.cta}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Novelty Panel: Horizontal Bar Chart with Scores */}
        <div
          className="bracket-panel p-6 sm:p-8 select-none bg-[#07121F]/90"
          data-readout="COMPETITIVE NOVELTY BENCHMARKS"
        >
          <span className="bracket-corner-tr" />
          <span className="bracket-corner-bl" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-6 border-b border-[rgba(63,245,230,0.14)] gap-3">
            <div>
              <span className="font-mono text-xs text-[#3FF5E6] tracking-widest uppercase block mb-1">
                // SYSTEM NOVELTY BENCHMARKS
              </span>
              <p className="text-xs text-[#A6C0DE]">
                Evaluated against existing marine DSS and autonomous reasoning literature.
              </p>
            </div>

            <div className="font-mono text-lg sm:text-xl font-bold text-[#3FF5E6] bg-[#3FF5E6]/10 border border-[#3FF5E6]/40 px-3 py-1.5 whitespace-nowrap shadow-[0_0_15px_rgba(63,245,230,0.25)]">
              OVERALL NOVELTY 8.5 / 10
            </div>
          </div>

          <div className="space-y-4">
            {noveltyScores.map((item) => (
              <div key={item.name} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="font-mono text-xs text-[#E6F1FF] sm:w-1/3">
                  {item.name}
                </span>

                <div className="flex-1 flex items-center gap-3">
                  <div className="flex-1 h-3 bg-[#02060D] border border-[rgba(63,245,230,0.15)] relative overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#088395] to-[#3FF5E6] transition-all duration-1000"
                      style={{ width: `${(item.score / 10) * 100}%` }}
                    />
                  </div>
                  <span className="font-mono text-xs font-bold text-[#3FF5E6] w-8 text-right">
                    {item.score}/10
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
