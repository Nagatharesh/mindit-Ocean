import React from 'react';
import { Anchor, Building2, Scale } from 'lucide-react';
import { playHoverTick } from '../utils/audio';

interface UsersSectionProps {
  soundEnabled: boolean;
}

export const UsersSection: React.FC<UsersSectionProps> = ({ soundEnabled }) => {
  const users = [
    {
      type: 'AQUACULTURE OPERATORS',
      icon: <Anchor className="w-5 h-5 text-[#3FF5E6]" />,
      quote: 'I find out about a crash when my stock is already dead.',
      answer: 'Weeks of early warning for heat stress and hypoxia.',
      detail: 'Predictive LSTM pycnocline models forecast dissolved oxygen depletions before lethal thresholds occur in pens.',
    },
    {
      type: 'COASTAL AGENCIES',
      icon: <Building2 className="w-5 h-5 text-[#4ADE80]" />,
      quote: "Alerts don't tell me what to do.",
      answer: 'Compare interventions before committing resources.',
      detail: 'What-If simulations test nutrient runoff bans vs. artificial upwelling shade curtains before spending public capital.',
    },
    {
      type: 'INSURERS & REGULATORS',
      icon: <Scale className="w-5 h-5 text-[#B18CFF]" />,
      quote: "I can't defend an AI's conclusion.",
      answer: 'Verified links, physics_share scores and a tamper-evident audit trail.',
      detail: 'Every trigger is backed by BRCV counterfactual bounds and cryptographic SHA-256 state proofs acceptable in courts.',
    },
  ];

  const scenarioSteps = [
    'Farm uploads data',
    'Sentinel passes',
    'LSTM forecasts +0.8°C',
    'BRCV verifies bleaching risk',
    'Farm gets warning + action + audit report',
  ];

  return (
    <section
      id="users"
      className="relative w-full py-24 sm:py-32 px-4 sm:px-8 lg:px-14 z-20"
      aria-labelledby="users-heading"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section kicker */}
        <div
          className="font-mono text-xs sm:text-sm text-[#3FF5E6] tracking-widest uppercase mb-3 flex items-center gap-2"
          data-readout="SECTION 10 STAKEHOLDER PROFILES"
        >
          <span className="text-[#3FF5E6] font-bold">//</span>
          <span>10 · USERS</span>
        </div>

        {/* Heading */}
        <h2
          id="users-heading"
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#E6F1FF] tracking-tight mb-4 font-heading"
        >
          Built for people <br className="sm:hidden" />
          <span className="text-[#3FF5E6] drop-shadow-[0_0_20px_rgba(63,245,230,0.3)]">
            who have to act.
          </span>
        </h2>
        <p className="text-base sm:text-lg text-[#A6C0DE] max-w-2xl mb-12 font-normal">
          From commercial mariculture facilities to sovereign coastal authorities, decisions carry multi-million-dollar consequences. TideMind turns alerts into defensible action.
        </p>

        {/* 3 Bracketed Pain-Point Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {users.map((u) => (
            <div
              key={u.type}
              onMouseEnter={() => playHoverTick(soundEnabled)}
              className="bracket-panel p-7 sm:p-8 flex flex-col justify-between transition-all duration-400 hover:-translate-y-1 select-none"
              data-readout={`USER SECTOR: ${u.type}`}
            >
              <span className="bracket-corner-tr" />
              <span className="bracket-corner-bl" />

              <div>
                <div className="flex items-center gap-3 pb-3 mb-4 border-b border-[rgba(63,245,230,0.12)]">
                  <div className="p-2 border border-[rgba(63,245,230,0.2)] bg-[#071626]">
                    {u.icon}
                  </div>
                  <h3 className="font-mono text-xs font-bold text-[#3FF5E6] tracking-wider uppercase">
                    {u.type}
                  </h3>
                </div>

                {/* Pain quote */}
                <p className="text-sm sm:text-base text-[#FF5A5F] italic mb-4 leading-relaxed">
                  "{u.quote}"
                </p>

                {/* TideMind Answer */}
                <div className="pt-3 border-t border-[rgba(63,245,230,0.1)] mb-3">
                  <span className="font-mono text-[10px] text-[#3FF5E6] uppercase font-bold block mb-1">
                    TIDEMIND:
                  </span>
                  <p className="text-sm font-semibold text-[#E6F1FF] leading-snug">
                    {u.answer}
                  </p>
                </div>
              </div>

              <p className="text-xs text-[#7A8CA3] leading-relaxed pt-2">
                {u.detail}
              </p>
            </div>
          ))}
        </div>

        {/* Scenario Strip */}
        <div
          className="bracket-panel p-5 select-none bg-[#07121F]/90 overflow-x-auto"
          data-readout="END-TO-END FARM ALERT SCENARIO"
        >
          <span className="bracket-corner-tr" />
          <span className="bracket-corner-bl" />
          <div className="font-mono text-xs text-[#7A8CA3] tracking-widest uppercase mb-3">
            // OPERATIONAL FLOW SCENARIO
          </div>
          <div className="flex items-center gap-2 sm:gap-3 min-w-[700px]">
            {scenarioSteps.map((step, idx) => (
              <React.Fragment key={idx}>
                <div className="px-3 py-1.5 bg-[#02060D] border border-[rgba(63,245,230,0.2)] font-mono text-xs text-[#E6F1FF] whitespace-nowrap flex items-center gap-2">
                  <span className="text-[#3FF5E6] font-bold">{idx + 1}.</span>
                  <span>{step}</span>
                </div>
                {idx < scenarioSteps.length - 1 && (
                  <span className="text-[#3FF5E6] font-mono text-xs">→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
