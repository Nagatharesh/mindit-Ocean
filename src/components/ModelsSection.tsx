import React from 'react';
import { playHoverTick } from '../utils/audio';

interface ModelsSectionProps {
  soundEnabled: boolean;
}

export const ModelsSection: React.FC<ModelsSectionProps> = ({ soundEnabled }) => {
  return (
    <section
      id="models"
      className="relative w-full py-24 sm:py-32 px-4 sm:px-8 lg:px-14 z-20"
      aria-labelledby="models-heading"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section kicker */}
        <div
          className="font-mono text-xs sm:text-sm text-[#3FF5E6] tracking-widest uppercase mb-3 flex items-center gap-2"
          data-readout="SECTION 05 DEEP LEARNING ARCHITECTURE"
        >
          <span className="text-[#3FF5E6] font-bold">//</span>
          <span>05 · DEEP LEARNING</span>
        </div>

        {/* Heading */}
        <h2
          id="models-heading"
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#E6F1FF] tracking-tight mb-4 font-heading"
        >
          Neural networks learn <br className="sm:hidden" />
          <span className="text-[#3FF5E6] drop-shadow-[0_0_20px_rgba(63,245,230,0.3)]">
            what physics misses.
          </span>
        </h2>
        <p className="text-base sm:text-lg text-[#A6C0DE] max-w-2xl mb-12 font-normal">
          First-principles equations establish rigorous conservation bounds. Specialized deep learning architectures model non-linear biological responses and sensory corruption.
        </p>

        {/* 4 Bracketed Cards (2x2 desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* DL-1: LSTM FORECASTER */}
          <div
            onMouseEnter={() => playHoverTick(soundEnabled)}
            className="bracket-panel p-6 sm:p-7 flex flex-col justify-between select-none"
            data-readout="DL-1 LSTM TIME-SERIES FORECASTER"
          >
            <span className="bracket-corner-tr" />
            <span className="bracket-corner-bl" />

            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[rgba(63,245,230,0.12)]">
                <span className="font-mono text-xs text-[#3FF5E6] font-bold tracking-wider">
                  // DL-1 · LSTM FORECASTER
                </span>
                <span className="font-mono text-[10px] text-[#4ADE80]">PROBABILISTIC</span>
              </div>

              <h3 className="text-xl font-bold text-[#E6F1FF] mb-2 font-heading">
                Predicts SST, oxygen and chlorophyll 1–4 weeks ahead with uncertainty.
              </h3>
              <p className="text-xs text-[#A6C0DE] mb-6 leading-relaxed">
                Bi-directional LSTM with temporal attention predicts trajectory confidence cones, giving conservationists advance notice before thermal mortality events.
              </p>

              {/* Mini-visual: Line chart with solid past, dashed forecast, and shaded uncertainty band */}
              <div className="w-full h-32 bg-[#02060D]/80 border border-[rgba(63,245,230,0.15)] p-3 relative flex items-center justify-center overflow-hidden mb-4">
                <svg className="w-full h-full" viewBox="0 0 280 100" preserveAspectRatio="none">
                  {/* Grid lines */}
                  <line x1="0" y1="25" x2="280" y2="25" stroke="rgba(63,245,230,0.08)" strokeDasharray="3 3" />
                  <line x1="0" y1="50" x2="280" y2="50" stroke="rgba(63,245,230,0.08)" strokeDasharray="3 3" />
                  <line x1="0" y1="75" x2="280" y2="75" stroke="rgba(63,245,230,0.08)" strokeDasharray="3 3" />
                  <line x1="140" y1="0" x2="140" y2="100" stroke="rgba(63,245,230,0.2)" strokeDasharray="2 2" />

                  {/* Uncertainty Band (140 to 280) */}
                  <path
                    d="M 140 50 Q 200 20 280 15 L 280 85 Q 200 70 140 50 Z"
                    fill="rgba(63, 245, 230, 0.12)"
                  />

                  {/* Historical Solid Curve (0 to 140) */}
                  <path
                    d="M 10 75 Q 50 65 80 58 T 140 50"
                    fill="none"
                    stroke="#3FF5E6"
                    strokeWidth="2.5"
                  />

                  {/* Forecast Dashed Curve (140 to 280) */}
                  <path
                    d="M 140 50 Q 200 45 270 38"
                    fill="none"
                    stroke="#3FF5E6"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />

                  {/* Present Marker */}
                  <circle cx="140" cy="50" r="3.5" fill="#3FF5E6" />
                  <text x="145" y="65" fill="#7A8CA3" fontSize="8" fontFamily="JetBrains Mono">NOW</text>
                  <text x="210" y="32" fill="#3FF5E6" fontSize="8" fontFamily="JetBrains Mono">+3 WEEKS</text>
                </svg>
              </div>
            </div>

            <div className="pt-3 border-t border-[rgba(63,245,230,0.1)] flex items-center justify-between font-mono text-[10px] text-[#7A8CA3]">
              <span>RUNTIME ENGINE</span>
              <span className="text-[#3FF5E6] font-semibold">PyTorch</span>
            </div>
          </div>

          {/* DL-2: HYBRID NEURAL ODE */}
          <div
            onMouseEnter={() => playHoverTick(soundEnabled)}
            className="bracket-panel p-6 sm:p-7 flex flex-col justify-between select-none"
            data-readout="DL-2 HYBRID NEURAL DIFFERENTIAL EQUATIONS"
          >
            <span className="bracket-corner-tr" />
            <span className="bracket-corner-bl" />

            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[rgba(63,245,230,0.12)]">
                <span className="font-mono text-xs text-[#3FF5E6] font-bold tracking-wider">
                  // DL-2 · HYBRID NEURAL ODE
                </span>
                <span className="font-mono text-[10px] text-[#3FF5E6]">dx/dt = f_phys + g_θ</span>
              </div>

              <h3 className="text-xl font-bold text-[#E6F1FF] mb-2 font-heading">
                dx/dt = f_physics(x) + g_θ(x). Equations plus a learned correction.
              </h3>
              <p className="text-xs text-[#A6C0DE] mb-6 leading-relaxed">
                Advection-diffusion thermodynamics form the baseline. A continuous neural network captures micro-turbulent mixing without violating mass-energy invariants.
              </p>

              {/* Mini-visual: Overlapping curves labelled PHYSICS (cyan) and +NEURAL (thin white) */}
              <div className="w-full h-32 bg-[#02060D]/80 border border-[rgba(63,245,230,0.15)] p-3 relative flex items-center justify-center overflow-hidden mb-4">
                <svg className="w-full h-full" viewBox="0 0 280 100" preserveAspectRatio="none">
                  <line x1="0" y1="50" x2="280" y2="50" stroke="rgba(63,245,230,0.1)" strokeDasharray="3 3" />
                  
                  {/* Base Physics Curve (cyan) */}
                  <path
                    d="M 10 70 Q 70 20 140 60 T 270 30"
                    fill="none"
                    stroke="#3FF5E6"
                    strokeWidth="2.5"
                  />

                  {/* +Neural Corrected Curve (thin white) */}
                  <path
                    d="M 10 70 Q 70 26 140 54 T 270 24"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                  />

                  <text x="20" y="25" fill="#3FF5E6" fontSize="9" fontFamily="JetBrains Mono">f_physics (Thermodynamics)</text>
                  <text x="20" y="40" fill="#FFFFFF" fontSize="9" fontFamily="JetBrains Mono">+ g_θ (Learned Residual)</text>
                </svg>
              </div>
            </div>

            <div className="pt-3 border-t border-[rgba(63,245,230,0.1)] flex items-center justify-between font-mono text-[10px] text-[#7A8CA3]">
              <span>RUNTIME ENGINE</span>
              <span className="text-[#3FF5E6] font-semibold">torchdiffeq</span>
            </div>
          </div>

          {/* DL-3: GRAPH NEURAL NETWORK */}
          <div
            onMouseEnter={() => playHoverTick(soundEnabled)}
            className="bracket-panel p-6 sm:p-7 flex flex-col justify-between select-none"
            data-readout="DL-3 GRAPH NEURAL NETWORK"
          >
            <span className="bracket-corner-tr" />
            <span className="bracket-corner-bl" />

            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[rgba(63,245,230,0.12)]">
                <span className="font-mono text-xs text-[#3FF5E6] font-bold tracking-wider">
                  // DL-3 · GRAPH NEURAL NETWORK
                </span>
                <span className="font-mono text-[10px] text-[#4ADE80]">TROPHIC PROPAGATION</span>
              </div>

              <h3 className="text-xl font-bold text-[#E6F1FF] mb-2 font-heading">
                Learns how stress spreads through the food web to rank hypotheses.
              </h3>
              <p className="text-xs text-[#A6C0DE] mb-6 leading-relaxed">
                Represents species and substrates as nodes. Message-passing updates rank secondary extinction risks when primary corals experience thermal bleaching.
              </p>

              {/* Mini-visual: Node graph with a propagating pulse */}
              <div className="w-full h-32 bg-[#02060D]/80 border border-[rgba(63,245,230,0.15)] p-3 relative flex items-center justify-center overflow-hidden mb-4">
                <svg className="w-full h-full" viewBox="0 0 280 100">
                  {/* Edges */}
                  <line x1="40" y1="50" x2="100" y2="25" stroke="#3FF5E6" strokeWidth="1.5" strokeOpacity="0.4" />
                  <line x1="40" y1="50" x2="100" y2="75" stroke="#3FF5E6" strokeWidth="1.5" strokeOpacity="0.4" />
                  <line x1="100" y1="25" x2="180" y2="40" stroke="#3FF5E6" strokeWidth="1.5" strokeOpacity="0.6" />
                  <line x1="100" y1="75" x2="180" y2="60" stroke="#3FF5E6" strokeWidth="1.5" strokeOpacity="0.6" />
                  <line x1="180" y1="40" x2="250" y2="50" stroke="#4ADE80" strokeWidth="2" />
                  <line x1="180" y1="60" x2="250" y2="50" stroke="#4ADE80" strokeWidth="2" />

                  {/* Nodes */}
                  <circle cx="40" cy="50" r="7" fill="#FF5A5F" />
                  <circle cx="100" cy="25" r="6" fill="#F5B83F" />
                  <circle cx="100" cy="75" r="6" fill="#F5B83F" />
                  <circle cx="180" cy="40" r="6" fill="#3FF5E6" />
                  <circle cx="180" cy="60" r="6" fill="#3FF5E6" />
                  <circle cx="250" cy="50" r="8" fill="#4ADE80" />

                  {/* Labels */}
                  <text x="30" y="70" fill="#FF5A5F" fontSize="8" fontFamily="JetBrains Mono">HEAT</text>
                  <text x="90" y="15" fill="#F5B83F" fontSize="8" fontFamily="JetBrains Mono">CORAL</text>
                  <text x="170" y="80" fill="#3FF5E6" fontSize="8" fontFamily="JetBrains Mono">HERBIVORE</text>
                  <text x="235" y="70" fill="#4ADE80" fontSize="8" fontFamily="JetBrains Mono">ALGAE</text>
                </svg>
              </div>
            </div>

            <div className="pt-3 border-t border-[rgba(63,245,230,0.1)] flex items-center justify-between font-mono text-[10px] text-[#7A8CA3]">
              <span>RUNTIME ENGINE</span>
              <span className="text-[#3FF5E6] font-semibold">PyTorch Geometric</span>
            </div>
          </div>

          {/* DL-4: ANOMALY AUTOENCODER */}
          <div
            onMouseEnter={() => playHoverTick(soundEnabled)}
            className="bracket-panel p-6 sm:p-7 flex flex-col justify-between select-none"
            data-readout="DL-4 AUTOENCODER RECONSTRUCTION DEFENSE"
          >
            <span className="bracket-corner-tr" />
            <span className="bracket-corner-bl" />

            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[rgba(63,245,230,0.12)]">
                <span className="font-mono text-xs text-[#3FF5E6] font-bold tracking-wider">
                  // DL-4 · ANOMALY AUTOENCODER
                </span>
                <span className="font-mono text-[10px] text-[#FF5A5F]">RECONSTRUCTION ERROR</span>
              </div>

              <h3 className="text-xl font-bold text-[#E6F1FF] mb-2 font-heading">
                Flags subtle, coordinated data poisoning by reconstruction error.
              </h3>
              <p className="text-xs text-[#A6C0DE] mb-6 leading-relaxed">
                Trained exclusively on 20 years of clean ocean physics. Coordinated fake telemetry produces high reconstruction residual ||x - x̂||, alerting Sentinel instantly.
              </p>

              {/* Mini-visual: Hourglass-shaped network diagram with red spike */}
              <div className="w-full h-32 bg-[#02060D]/80 border border-[rgba(63,245,230,0.15)] p-3 relative flex items-center justify-center overflow-hidden mb-4">
                <svg className="w-full h-full" viewBox="0 0 280 100">
                  {/* Hourglass shape: Input (wide) -> Latent (narrow) -> Output (wide) */}
                  <polygon
                    points="30,15 30,85 140,55 140,45"
                    fill="rgba(63,245,230,0.08)"
                    stroke="rgba(63,245,230,0.3)"
                    strokeWidth="1"
                  />
                  <polygon
                    points="140,45 140,55 250,85 250,15"
                    fill="rgba(63,245,230,0.08)"
                    stroke="rgba(63,245,230,0.3)"
                    strokeWidth="1"
                  />

                  {/* Input Nodes */}
                  <line x1="30" y1="25" x2="30" y2="75" stroke="#3FF5E6" strokeWidth="3" />
                  {/* Latent Bottleneck */}
                  <circle cx="140" cy="50" r="5" fill="#3FF5E6" />
                  {/* Output Normal */}
                  <line x1="250" y1="25" x2="250" y2="55" stroke="#4ADE80" strokeWidth="3" />
                  {/* Reconstruction Error Spike */}
                  <line x1="250" y1="58" x2="250" y2="78" stroke="#FF5A5F" strokeWidth="4" />
                  <circle cx="250" cy="68" r="4" fill="#FF5A5F" className="animate-ping" />

                  <text x="18" y="94" fill="#7A8CA3" fontSize="8" fontFamily="JetBrains Mono">INPUT (x)</text>
                  <text x="122" y="70" fill="#3FF5E6" fontSize="8" fontFamily="JetBrains Mono">z (LATENT)</text>
                  <text x="210" y="94" fill="#FF5A5F" fontSize="8" fontFamily="JetBrains Mono">RESIDUAL SPIKE</text>
                </svg>
              </div>
            </div>

            <div className="pt-3 border-t border-[rgba(63,245,230,0.1)] flex items-center justify-between font-mono text-[10px] text-[#7A8CA3]">
              <span>RUNTIME ENGINE</span>
              <span className="text-[#3FF5E6] font-semibold">PyTorch</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
