import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { playHoverTick, playSonarPing } from '../utils/audio';

interface HudBarProps {
  scrolled: boolean;
  soundEnabled: boolean;
  activeSection?: string;
  onToggleSound: () => void;
  onOpenDemo?: () => void;
}

const NAV_ITEMS = [
  { id: 'problem', label: 'PROBLEM' },
  { id: 'twin', label: 'SYSTEM' },
  { id: 'sites', label: 'SITES' },
  { id: 'crew', label: 'AGENTS' },
  { id: 'models', label: 'MODELS' },
  { id: 'brcv', label: 'BRCV' },
  { id: 'dream', label: 'DREAM' },
  { id: 'security', label: 'SECURITY' },
  { id: 'business', label: 'BUSINESS' },
];

export const HudBar: React.FC<HudBarProps> = ({
  scrolled,
  soundEnabled,
  activeSection = 'hero',
  onToggleSound,
  onOpenDemo,
}) => {
  const [utcTime, setUtcTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getUTCHours()).padStart(2, '0');
      const minutes = String(now.getUTCMinutes()).padStart(2, '0');
      const seconds = String(now.getUTCSeconds()).padStart(2, '0');
      setUtcTime(`${hours}:${minutes}:${seconds} UTC`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 select-none ${
        scrolled
          ? 'bg-[#07121F]/90 backdrop-blur-md border-b border-[rgba(63,245,230,0.18)] py-2.5 px-4 sm:px-8 shadow-[0_4px_30px_rgba(2,6,13,0.85)]'
          : 'bg-transparent border-b border-transparent py-4 px-4 sm:px-8'
      }`}
    >
      <div className="max-w-[1520px] mx-auto flex items-center justify-between gap-4">
        {/* Left Zone: Brand Mark + System Status */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 group cursor-pointer"
            onMouseEnter={() => playHoverTick(soundEnabled)}
            data-readout="TIDEMIND ENGINE v3.0"
          >
            <span className="text-xl sm:text-2xl transition-transform duration-300 group-hover:scale-110">
              🐋
            </span>
            <span className="text-lg sm:text-xl font-bold tracking-tight text-[#E6F1FF] font-heading">
              TIDEMIND
            </span>
          </a>

          <div className="h-4 w-[1px] bg-[rgba(63,245,230,0.2)] mx-1" />

          <div
            className="flex items-center gap-2 font-mono text-[11px] text-[#A6C0DE] tracking-wider"
            data-readout="TELEMETRY FEED LIVE"
          >
            <span className="w-2 h-2 rounded-full bg-[#4ADE80] pulse-dot-green inline-block" />
            <span className="hidden sm:inline">SYSTEM ONLINE</span>
          </div>
        </div>

        {/* Centre Zone (Desktop): Section Navigation Links in Mono */}
        <nav
          className="hidden lg:flex items-center gap-1 xl:gap-2 overflow-x-auto py-1"
          aria-label="Section Navigation"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  playHoverTick(soundEnabled);
                  scrollTo(item.id);
                }}
                onMouseEnter={() => playHoverTick(soundEnabled)}
                className={`font-mono text-xs px-2.5 py-1 tracking-wider transition-all duration-300 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'text-[#3FF5E6] font-bold border-b border-[#3FF5E6] bg-[#3FF5E6]/10 shadow-[0_0_12px_rgba(63,245,230,0.25)]'
                    : 'text-[#7A8CA3] hover:text-[#E6F1FF] hover:bg-[#3FF5E6]/5'
                }`}
                data-readout={`JUMP TO ${item.label}`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Zone: Coordinates (hide below 1200px) + Live UTC Clock + Sound Toggle */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Coordinates (hidden below 1200px) */}
          <div
            className="hidden min-[1200px]:flex items-center gap-2 font-mono text-xs text-[#7A8CA3] tracking-widest px-2.5 py-1 border border-[rgba(63,245,230,0.12)] bg-[#07121F]/40"
            data-readout="TARGET COORDINATES"
          >
            <span className="text-[#3FF5E6]">09.12°N 79.13°E</span>
          </div>

          {/* UTC Clock */}
          <div
            className="font-mono text-xs sm:text-sm text-[#A6C0DE] tracking-wider hidden sm:block"
            data-readout="ATOMIC SATELLITE CLOCK"
          >
            {utcTime || '00:00:00 UTC'}
          </div>

          {/* Demo Button */}
          {onOpenDemo && (
            <button
              onClick={() => {
                playSonarPing(soundEnabled);
                onOpenDemo();
              }}
              onMouseEnter={() => playHoverTick(soundEnabled)}
              className="hidden md:flex items-center gap-1 px-2 py-1 text-xs font-mono text-[#3FF5E6] border border-[#3FF5E6]/30 hover:border-[#3FF5E6] bg-[#3FF5E6]/5 transition-colors cursor-pointer"
              data-readout="RUN REASONING DEMO"
            >
              <span>[SIMULATE]</span>
            </button>
          )}

          {/* Sound Toggle Button */}
          <button
            onClick={() => {
              onToggleSound();
              if (!soundEnabled) {
                playSonarPing(true);
              }
            }}
            onMouseEnter={() => playHoverTick(soundEnabled)}
            className={`relative flex items-center gap-2 px-3 py-1.5 border transition-all duration-300 cursor-pointer ${
              soundEnabled
                ? 'border-[#3FF5E6] text-[#3FF5E6] bg-[#3FF5E6]/10 shadow-[0_0_15px_rgba(63,245,230,0.2)]'
                : 'border-[rgba(63,245,230,0.2)] text-[#7A8CA3] hover:text-[#E6F1FF] hover:border-[rgba(63,245,230,0.4)] bg-[#07121F]/60'
            }`}
            data-readout={soundEnabled ? 'OCEAN AUDIO SUBSYSTEM ACTIVE' : 'AUDIO SUBSYSTEM MUTED'}
            aria-label={soundEnabled ? 'Mute Ocean Audio' : 'Enable Ocean Audio'}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-[#3FF5E6]" />
                <div className="flex items-end gap-[2px] h-3.5 w-4 pb-[1px]" aria-hidden="true">
                  <span className="w-[2px] bg-[#3FF5E6] animate-[equalizer_0.8s_ease-in-out_infinite] h-full" />
                  <span className="w-[2px] bg-[#3FF5E6] animate-[equalizer_1.1s_ease-in-out_infinite_0.2s] h-2/3" />
                  <span className="w-[2px] bg-[#3FF5E6] animate-[equalizer_0.7s_ease-in-out_infinite_0.4s] h-4/5" />
                  <span className="w-[2px] bg-[#3FF5E6] animate-[equalizer_0.9s_ease-in-out_infinite_0.1s] h-1/2" />
                </div>
                <span className="font-mono text-xs hidden sm:inline tracking-wider">AUDIO ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4" />
                <span className="font-mono text-xs hidden sm:inline tracking-wider">MUTED</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
