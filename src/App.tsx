/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Loader } from './components/Loader';
import { VideoBackground } from './components/VideoBackground';
import { Background3DCanvas } from './components/Background3DCanvas';
import { HudBar } from './components/HudBar';
import { DepthGauge } from './components/DepthGauge';
import { ProgressRail } from './components/ProgressRail';
import { Hero } from './components/Hero';
import { ProblemSection } from './components/ProblemSection';
import { SolutionSection } from './components/SolutionSection';
import { TwinSection } from './components/TwinSection';
import { SiteMapSection } from './components/SiteMapSection';
import { CrewSection } from './components/CrewSection';
import { ModelsSection } from './components/ModelsSection';
import { BRCVSection } from './components/BRCVSection';
import { WhatIfSection } from './components/WhatIfSection';
import { DreamSection } from './components/DreamSection';
import { SecuritySection } from './components/SecuritySection';
import { UsersSection } from './components/UsersSection';
import { BusinessSection } from './components/BusinessSection';
import { ResearchSection } from './components/ResearchSection';
import { CtaSection } from './components/CtaSection';
import { Footer } from './components/Footer';
import { CustomCursor } from './components/CustomCursor';
import { DemoModal } from './components/DemoModal';
import { setOceanSound } from './utils/audio';

const SECTION_IDS = [
  'hero',
  'problem',
  'solution',
  'twin',
  'sites',
  'crew',
  'models',
  'brcv',
  'what-if',
  'dream',
  'security',
  'users',
  'business',
  'research',
  'cta',
];

export default function App() {
  const [loaderComplete, setLoaderComplete] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [highlightedAgentId, setHighlightedAgentId] = useState<string | null>(null);
  const [demoModalOpen, setDemoModalOpen] = useState<boolean>(false);
  const [quotaExceeded, setQuotaExceeded] = useState<boolean>(false);

  // Listen for Google Maps Platform quota exceeded custom event
  useEffect(() => {
    const handleQuotaExceeded = () => {
      setQuotaExceeded(true);
    };
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
  }, []);

  // Monitor scroll for Depth Gauge, Progress Rail & Active Section detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 50);

      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0) {
        setScrollProgress(Math.min(1, Math.max(0, scrollY / maxScroll)));
      }

      // Detect active section based on midpoint of viewport
      const midPoint = scrollY + window.innerHeight * 0.4;
      for (let i = SECTION_IDS.length - 1; i >= 0; i--) {
        const id = SECTION_IDS[i];
        if (id === 'hero') {
          if (scrollY < 400) {
            setActiveSection('hero');
            break;
          }
          continue;
        }
        const el = document.getElementById(id);
        if (el && el.offsetTop <= midPoint) {
          setActiveSection(id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync ambient ocean sound with soundEnabled
  useEffect(() => {
    setOceanSound(soundEnabled);
  }, [soundEnabled]);

  const handleDiveIn = () => {
    setSoundEnabled(true);
    const problemEl = document.getElementById('problem');
    if (problemEl) {
      problemEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#02060D] text-[#E6F1FF] overflow-x-hidden selection:bg-[#3FF5E6]/30 selection:text-[#3FF5E6]">
      {/* ── LOADER (1.5s typed initialization sequence) ── */}
      {!loaderComplete && <Loader onComplete={() => setLoaderComplete(true)} />}

      {/* ── LAYER 1: YouTube Background Video + Dark-blue Caustic Fallback ── */}
      <VideoBackground soundEnabled={soundEnabled} scrollProgress={scrollProgress} />

      {/* ── LAYER 3: Three.js Interactive Plankton Field Canvas ── */}
      <Background3DCanvas scrollProgress={scrollProgress} />

      {/* ── LAYER 4: Scanlines + Subtle Noise Overlays ── */}
      <div className="scanlines-overlay" aria-hidden="true" />
      <div className="noise-overlay" aria-hidden="true" />

      {/* ── MANDATORY GOOGLE MAPS PLATFORM QUOTA BANNER ── */}
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* ── TOP HUD BAR (fixed) ── */}
      <HudBar
        scrolled={scrolled}
        soundEnabled={soundEnabled}
        activeSection={activeSection}
        onToggleSound={toggleSound}
        onOpenDemo={() => setDemoModalOpen(true)}
      />

      {/* ── LEFT DEPTH GAUGE (fixed, desktop only) ── */}
      <DepthGauge scrollProgress={scrollProgress} />

      {/* ── RIGHT PROGRESS RAIL (fixed, desktop only) ── */}
      <ProgressRail activeSection={activeSection} soundEnabled={soundEnabled} />

      {/* ── LAYER 5: HTML UI CONTENT (sections in exact order) ── */}
      <main className="relative z-20 flex flex-col w-full">
        {/* HERO (100vh) */}
        <Hero
          soundEnabled={soundEnabled}
          onDiveIn={handleDiveIn}
          onWatchDemo={() => setDemoModalOpen(true)}
          highlightedAgentId={highlightedAgentId}
          onAgentHover={setHighlightedAgentId}
        />

        {/* SECTION 01 · THE PROBLEM */}
        <ProblemSection soundEnabled={soundEnabled} />

        {/* SECTION 02 · THE SOLUTION */}
        <SolutionSection soundEnabled={soundEnabled} />

        {/* SECTION 03 · THE DIGITAL TWIN */}
        <TwinSection soundEnabled={soundEnabled} />

        {/* SECTION 03B · GOOGLE MAPS LIVE MONITORING SITES */}
        <SiteMapSection soundEnabled={soundEnabled} />

        {/* SECTION 04 · MEET THE CREW */}
        <CrewSection
          soundEnabled={soundEnabled}
          onAgentHover={setHighlightedAgentId}
        />

        {/* SECTION 05 · NEURAL MODELS */}
        <ModelsSection soundEnabled={soundEnabled} />

        {/* SECTION 06 · BRCV — OUR NOVEL ALGORITHM */}
        <BRCVSection soundEnabled={soundEnabled} />

        {/* SECTION 07 · WHAT-IF LAB */}
        <WhatIfSection soundEnabled={soundEnabled} />

        {/* SECTION 08 · DREAM — RECURSIVE SELF-IMPROVEMENT */}
        <DreamSection soundEnabled={soundEnabled} />

        {/* SECTION 09 · 8-LAYER SECURITY */}
        <SecuritySection soundEnabled={soundEnabled} />

        {/* SECTION 10 · WHO IT'S FOR */}
        <UsersSection soundEnabled={soundEnabled} />

        {/* SECTION 11 · BUSINESS MODEL & NOVELTY */}
        <BusinessSection soundEnabled={soundEnabled} />

        {/* SECTION 12 · ABSTRACT & TECH */}
        <ResearchSection soundEnabled={soundEnabled} />

        {/* SECTION 13 · FINAL CTA */}
        <CtaSection soundEnabled={soundEnabled} />
      </main>

      {/* ── FOOTER ── */}
      <Footer soundEnabled={soundEnabled} />

      {/* ── LAYER 6: CUSTOM CURSOR (desktop only) ── */}
      <CustomCursor />

      {/* ── INTERACTIVE DEMO MODAL (Inspect Real Verification Log) ── */}
      <DemoModal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
        soundEnabled={soundEnabled}
      />
    </div>
  );
}
