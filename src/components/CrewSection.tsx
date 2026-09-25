import React, { useEffect, useState } from 'react';
import { playHoverTick, playSonarPing } from '../utils/audio';

interface CrewSectionProps {
  soundEnabled: boolean;
  onAgentHover: (id: string | null) => void;
}

interface AgentCard {
  id: string;
  name: string;
  icon: string;
  role: string;
  tags: string;
  detail: string;
  statuses: string[];
  pulseType: 'green' | 'amber' | 'cyan';
  metric: string;
}

export const CrewSection: React.FC<CrewSectionProps> = ({ soundEnabled, onAgentHover }) => {
  const agents: AgentCard[] = [
    {
      id: 'sentinel',
      name: 'Sentinel',
      icon: '🛡️',
      role: 'Blocks poisoned data and prompt injection.',
      tags: 'RANGE · CROSS-SOURCE · AUTOENCODER',
      detail: 'Validates satellite ↔ buoy consistency and applies input bounds before agent ingestion.',
      statuses: ['SCANNING...', 'VALIDATING HASH', 'IDLE', 'VERIFYING...'],
      pulseType: 'cyan',
      metric: '0.00ms ANOMALIES DETECTED',
    },
    {
      id: 'oceanographer',
      name: 'Oceanographer',
      icon: '🌊',
      role: 'Reads heat, oxygen and forecasts.',
      tags: 'DHW · HYPOXIA · LSTM',
      detail: 'Parses sea surface anomalies, evaluates pycnocline barrier depth, and runs LSTM trajectory models.',
      statuses: ['READING ISOTHERMS', 'CALCULATING DHW', 'VERIFYING...', 'IDLE'],
      pulseType: 'green',
      metric: '30.4°C SST REGISTERED',
    },
    {
      id: 'ecologist',
      name: 'Ecologist',
      icon: '🐠',
      role: 'Maps stress onto the food web.',
      tags: 'TROPHIC · GNN',
      detail: 'Applies graph neural networks over benthic survey nodes to calculate coral mortality cascade risks.',
      statuses: ['MAPPING TROPHIC WEB', 'ASSESSING BLEACHING', 'VERIFYING...', 'IDLE'],
      pulseType: 'green',
      metric: 'CORAL STRESS STAGE 2',
    },
    {
      id: 'skeptic',
      name: 'Skeptic',
      icon: '🧐',
      role: 'Hunts weak links and false claims.',
      tags: 'BRCV · MAG',
      detail: 'Adversarially questions every edge with counterfactual queries and queries Memory-Augmented Generation.',
      statuses: ['FALSIFYING CLAIMS', 'PROBING EDGES', 'VERIFYING...', 'IDLE'],
      pulseType: 'amber',
      metric: 'P-VALUE RIGOR: <0.001',
    },
    {
      id: 'strategist',
      name: 'Strategist',
      icon: '🧭',
      role: 'Tests interventions in simulation.',
      tags: 'WHAT-IF',
      detail: 'Evaluates solar shade curtains, herbivore reserves, and nutrient caps in the numerical sandbox.',
      statuses: ['RUNNING WHAT-IF', 'TESTING CURE', 'VERIFYING...', 'IDLE'],
      pulseType: 'cyan',
      metric: '+41% SURVIVAL DELTA',
    },
    {
      id: 'synthesizer',
      name: 'Synthesizer',
      icon: '📡',
      role: 'Builds the verified cascade.',
      tags: 'JSON SCHEMA',
      detail: 'Validates strict output schema, builds the immutable DAG, and cryptographically signs final audits.',
      statuses: ['COMPILING GRAPH', 'SIGNING AUDIT CHAIN', 'VERIFYING...', 'IDLE'],
      pulseType: 'green',
      metric: 'SHA-256 AUDIT ATTESTED',
    },
  ];

  const [cycleIndex, setCycleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCycleIndex((prev) => (prev + 1) % 4);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="crew"
      className="relative w-full py-24 sm:py-32 px-4 sm:px-8 lg:px-14 z-20"
      aria-labelledby="crew-heading"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section kicker */}
        <div
          className="font-mono text-xs sm:text-sm text-[#3FF5E6] tracking-widest uppercase mb-3 flex items-center gap-2"
          data-readout="SECTION 04 MULTI-AGENT SWARM"
        >
          <span className="text-[#3FF5E6] font-bold">//</span>
          <span>04 · AGENTS</span>
        </div>

        {/* Heading */}
        <h2
          id="crew-heading"
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#E6F1FF] tracking-tight mb-4 font-heading"
        >
          Six agents. <br className="sm:hidden" />
          <span className="text-[#3FF5E6] drop-shadow-[0_0_20px_rgba(63,245,230,0.3)]">
            One verified answer.
          </span>
        </h2>
        <p className="text-base sm:text-lg text-[#A6C0DE] max-w-2xl mb-12 font-normal">
          Each autonomous agent operates with explicit domain constraints and adversarial cross-examination. No claim reaches decision-makers unverified.
        </p>

        {/* Grid of 6 Bracketed Cards (3x2 desktop, 1 col mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-10">
          {agents.map((agent) => {
            const currentStatus = agent.statuses[cycleIndex % agent.statuses.length];
            return (
              <div
                key={agent.id}
                onMouseEnter={() => {
                  playHoverTick(soundEnabled);
                  onAgentHover(agent.id);
                }}
                onMouseLeave={() => onAgentHover(null)}
                onClick={() => playSonarPing(soundEnabled)}
                className="bracket-panel group p-7 flex flex-col justify-between transition-all duration-400 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(63,245,230,0.18)] cursor-pointer select-none"
                data-readout={`AGENT ${agent.name.toUpperCase()} · ${currentStatus}`}
              >
                {/* Corner brackets */}
                <span className="bracket-corner-tr" />
                <span className="bracket-corner-bl" />

                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-[rgba(63,245,230,0.12)]">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl p-1.5 bg-[#071626] border border-[rgba(63,245,230,0.2)]">
                        {agent.icon}
                      </span>
                      <div>
                        <h3 className="text-xl font-bold text-[#E6F1FF] font-heading group-hover:text-[#3FF5E6] transition-colors">
                          {agent.name}
                        </h3>
                        <span className="font-mono text-[10px] text-[#3FF5E6] tracking-widest uppercase">
                          {agent.tags}
                        </span>
                      </div>
                    </div>

                    {/* Status Pill Indicator */}
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-[#071626]/80 border border-[rgba(63,245,230,0.15)] font-mono text-[10px]">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          agent.pulseType === 'cyan'
                            ? 'bg-[#3FF5E6] shadow-[0_0_8px_#3FF5E6]'
                            : agent.pulseType === 'amber'
                            ? 'bg-[#F5B83F] pulse-dot-amber'
                            : 'bg-[#4ADE80] pulse-dot-green'
                        }`}
                      />
                      <span className="text-[#3FF5E6] font-medium tracking-tight">
                        {currentStatus}
                      </span>
                    </div>
                  </div>

                  {/* One-line role */}
                  <p className="text-sm font-medium text-[#E6F1FF] mb-2 leading-snug">
                    "{agent.role}"
                  </p>

                  {/* Detailed role description */}
                  <p className="text-xs text-[#A6C0DE] leading-relaxed mb-6 font-normal">
                    {agent.detail}
                  </p>
                </div>

                {/* Footer telemetry */}
                <div className="pt-3 border-t border-[rgba(63,245,230,0.1)] flex items-center justify-between font-mono text-[11px]">
                  <span className="text-[#7A8CA3]">TELEMETRY:</span>
                  <span className="text-[#3FF5E6] font-semibold">{agent.metric}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Orchestration Policy Strip & Knowledge Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Orchestration Policy Strip */}
          <div
            className="lg:col-span-7 bracket-panel p-5 flex flex-col justify-center select-none"
            data-readout="ORCHESTRATION POLICY DEFINITION"
          >
            <span className="bracket-corner-tr" />
            <span className="bracket-corner-bl" />
            <div className="font-mono text-xs text-[#3FF5E6] tracking-wider uppercase mb-1">
              // ORCHESTRATION POLICY
            </div>
            <p className="text-sm text-[#E6F1FF] leading-relaxed">
              Decides which hypotheses to explore, how many agents run in parallel, and when to stop. <span className="text-[#3FF5E6] font-semibold">This is what DREAM improves.</span>
            </p>
          </div>

          {/* CAG & MAG Knowledge Panel */}
          <div
            className="lg:col-span-5 bracket-panel p-5 select-none"
            data-readout="CAG & MAG KNOWLEDGE ARCHITECTURE"
          >
            <span className="bracket-corner-tr" />
            <span className="bracket-corner-bl" />
            <div className="grid grid-cols-2 gap-4 font-mono text-xs">
              <div className="border-r border-[rgba(63,245,230,0.12)] pr-3">
                <span className="text-[#3FF5E6] font-bold block mb-1">CAG (Cache-Augmented)</span>
                <p className="text-[11px] text-[#A6C0DE] leading-tight font-sans">
                  Cached science: bleaching thresholds, hypoxia limits, food web invariants.
                </p>
              </div>
              <div className="pl-1">
                <span className="text-[#4ADE80] font-bold block mb-1">MAG (Memory-Augmented)</span>
                <p className="text-[11px] text-[#A6C0DE] leading-tight font-sans">
                  Verified evidence from past cases. Recall only — never commands.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
