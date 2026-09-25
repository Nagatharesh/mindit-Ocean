import React, { useEffect, useRef, useState } from 'react';
import { CursorBubble } from '../types';

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export const CustomCursor: React.FC = () => {
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(true);
  const [readoutText, setReadoutText] = useState<string | null>(null);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState<boolean>(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [bubbles, setBubbles] = useState<CursorBubble[]>([]);

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -100, y: -100 });
  const ringPosRef = useRef({ x: -100, y: -100 });
  const prevMouseRef = useRef({ x: -100, y: -100 });
  const bubbleIdRef = useRef(0);

  useEffect(() => {
    // Detect touch / fine pointer
    const checkPointer = () => {
      const hasTouch = window.matchMedia('(pointer: coarse)').matches || !window.matchMedia('(hover: hover)').matches;
      setIsTouchDevice(hasTouch);
      if (!hasTouch) {
        document.body.style.cursor = 'none';
      } else {
        document.body.style.cursor = 'auto';
      }
    };

    checkPointer();
    window.addEventListener('resize', checkPointer);

    return () => {
      window.removeEventListener('resize', checkPointer);
      document.body.style.cursor = 'auto';
    };
  }, []);

  useEffect(() => {
    if (isTouchDevice) return;

    let animId: number;

    const handleMouseMove = (e: MouseEvent) => {
      posRef.current.x = e.clientX;
      posRef.current.y = e.clientY;

      // Update dot immediately
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX - 3}px, ${e.clientY - 3}px, 0)`;
      }

      // Check distance moved to spawn tiny ocean bubble
      const dx = e.clientX - prevMouseRef.current.x;
      const dy = e.clientY - prevMouseRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 18) {
        prevMouseRef.current = { x: e.clientX, y: e.clientY };
        setBubbles((prev) => {
          if (prev.length >= 20) {
            prev = prev.slice(1);
          }
          bubbleIdRef.current += 1;
          return [
            ...prev,
            {
              id: bubbleIdRef.current,
              x: e.clientX + (Math.random() - 0.5) * 8,
              y: e.clientY + (Math.random() - 0.5) * 8,
              size: Math.random() * 3 + 2,
              opacity: 0.75,
              vy: Math.random() * 0.8 + 0.6,
            },
          ];
        });
      }

      // Readout tooltip inspection: check element under cursor or parents
      const target = e.target as HTMLElement | null;
      if (target) {
        const readoutEl = target.closest('[data-readout]');
        if (readoutEl) {
          const val = readoutEl.getAttribute('data-readout');
          setReadoutText(val);
        } else {
          setReadoutText(null);
        }

        const interactiveEl = target.closest('button, a, input, select, textarea, [role="button"]');
        setIsHoveringInteractive(!!interactiveEl);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      const newRipple: Ripple = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
      };
      setRipples((prev) => [...prev.slice(-4), newRipple]);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);

    // Animation loop for ring lerping and bubbles rising
    const loop = () => {
      // Lerp ring towards cursor: factor 0.18
      ringPosRef.current.x += (posRef.current.x - ringPosRef.current.x) * 0.2;
      ringPosRef.current.y += (posRef.current.y - ringPosRef.current.y) * 0.2;

      if (ringRef.current) {
        const radius = isHoveringInteractive ? 24 : 16;
        ringRef.current.style.transform = `translate3d(${ringPosRef.current.x - radius}px, ${
          ringPosRef.current.y - radius
        }px, 0)`;
      }

      // Age bubbles
      setBubbles((prev) =>
        prev
          .map((b) => ({
            ...b,
            y: b.y - b.vy,
            opacity: b.opacity - 0.02,
          }))
          .filter((b) => b.opacity > 0)
      );

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      cancelAnimationFrame(animId);
    };
  }, [isTouchDevice, isHoveringInteractive]);

  if (isTouchDevice) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none">
      {/* 6px Center Cyan Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-[6px] h-[6px] rounded-full bg-[#3FF5E6] shadow-[0_0_8px_#3FF5E6] pointer-events-none transition-opacity duration-200"
      />

      {/* 32px Thin Cyan Ring (Expands to 48px on interactive hover) */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 rounded-full border pointer-events-none transition-[width,height,border-color,background-color] duration-200 ${
          isHoveringInteractive
            ? 'w-[48px] h-[48px] border-[#3FF5E6] bg-[#3FF5E6]/10 shadow-[0_0_14px_rgba(63,245,230,0.35)]'
            : 'w-[32px] h-[32px] border-[#3FF5E6]/50 bg-transparent'
        }`}
      />

      {/* Click Sonar Ripples (0 -> 120px expansion) */}
      {ripples.map((ripple) => (
        <SonarRipple
          key={ripple.id}
          x={ripple.x}
          y={ripple.y}
          onDone={() => setRipples((prev) => prev.filter((r) => r.id !== ripple.id))}
        />
      ))}

      {/* Tiny Oceanic Plankton Bubbles Trail */}
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="fixed rounded-full pointer-events-none"
          style={{
            left: `${bubble.x}px`,
            top: `${bubble.y}px`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            opacity: bubble.opacity,
            backgroundColor: '#3FF5E6',
            boxShadow: '0 0 4px #3FF5E6',
          }}
        />
      ))}

      {/* Data-Readout Tooltip following cursor */}
      {readoutText && (
        <div
          className="fixed px-2.5 py-1 bg-[#02060D]/95 border border-[#3FF5E6] text-[11px] font-mono text-[#3FF5E6] tracking-wider pointer-events-none whitespace-nowrap shadow-[0_0_15px_rgba(63,245,230,0.3)]"
          style={{
            transform: `translate3d(${posRef.current.x + 16}px, ${posRef.current.y + 16}px, 0)`,
          }}
        >
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-[#3FF5E6] rounded-full animate-pulse" />
            <span>{readoutText}</span>
          </div>
        </div>
      )}
    </div>
  );
};

function SonarRipple({ x, y, onDone }: { x: number; y: number; onDone: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 650);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div
      className="fixed pointer-events-none rounded-full border border-[#3FF5E6]"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -50%)',
        animation: 'cursorRipple 650ms cubic-bezier(0.1, 0.8, 0.3, 1) forwards',
      }}
    />
  );
}
