import React, { useEffect, useState } from 'react';

interface LoaderProps {
  onComplete: () => void;
}

export const Loader: React.FC<LoaderProps> = ({ onComplete }) => {
  const [step, setStep] = useState<number>(0);
  const [progress, setProgress] = useState<number>(5);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);

  const logs = [
    'INITIALISING TIDEMIND...',
    'CONNECTING SENSORS... OK',
    'LOADING 6 AGENTS... OK',
    'LOADING NEURAL MODELS... 4/4',
    'BRCV VERIFIER ONLINE',
    'SECURITY LAYERS 8/8 ACTIVE',
  ];

  useEffect(() => {
    // Step transitions across 1.5 seconds
    const t1 = setTimeout(() => { setStep(1); setProgress(20); }, 220);
    const t2 = setTimeout(() => { setStep(2); setProgress(40); }, 440);
    const t3 = setTimeout(() => { setStep(3); setProgress(60); }, 680);
    const t4 = setTimeout(() => { setStep(4); setProgress(82); }, 950);
    const t5 = setTimeout(() => { setStep(5); setProgress(100); }, 1250);
    const t6 = setTimeout(() => { setIsFadingOut(true); }, 1550);
    const t7 = setTimeout(() => { onComplete(); }, 2150);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
      clearTimeout(t7);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[10000] bg-[#02060D] flex flex-col items-center justify-center pointer-events-auto transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isFadingOut ? 'opacity-0 -translate-y-8 pointer-events-none' : 'opacity-100 translate-y-0'
      }`}
    >
      {/* Background subtle grid */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(63, 245, 230, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(63, 245, 230, 0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 max-w-md w-full px-6 flex flex-col items-center text-center">
        {/* Emblem */}
        <div className="relative mb-6">
          <div className="w-16 h-16 border border-[#3FF5E6]/40 flex items-center justify-center relative">
            <span className="text-2xl select-none">🐋</span>
            {/* Corner brackets */}
            <span className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-[#3FF5E6]" />
            <span className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-[#3FF5E6]" />
            <span className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-[#3FF5E6]" />
            <span className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-[#3FF5E6]" />
          </div>
          <div className="absolute inset-0 bg-[#3FF5E6]/10 animate-ping rounded-none opacity-40 pointer-events-none" />
        </div>

        {/* Typed terminal sequence */}
        <div className="font-mono text-sm tracking-wider text-[#E6F1FF] min-h-[90px] flex flex-col items-center justify-center space-y-1.5">
          {logs.slice(0, step + 1).map((log, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-2 transition-opacity duration-300 ${
                idx === step ? 'text-[#3FF5E6] font-semibold' : 'text-[#7A8CA3] text-xs'
              }`}
            >
              <span className="text-[10px] text-[#3FF5E6]">//</span>
              <span>{log}</span>
              {idx === step && <span className="inline-block w-2 h-4 bg-[#3FF5E6] animate-pulse" />}
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="w-64 h-[2px] bg-[#071626] border border-[#3FF5E6]/20 mt-6 relative overflow-hidden">
          <div
            className="h-full bg-[#3FF5E6] transition-all duration-300 ease-out shadow-[0_0_10px_#3FF5E6]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Status coordinate */}
        <div className="mt-3 font-mono text-[10px] text-[#7A8CA3] tracking-widest uppercase">
          CALIBRATING SENSORY MATRIX · 09.12°N 79.13°E
        </div>
      </div>
    </div>
  );
};
