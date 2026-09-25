import React, { useEffect, useRef, useState } from 'react';

interface VideoBackgroundProps {
  soundEnabled: boolean;
  scrollProgress?: number;
  onPlayerReady?: () => void;
}

// Global declaration for YouTube API
declare global {
  interface Window {
    YT?: {
      Player: new (
        elementId: string | HTMLElement,
        options: {
          videoId?: string;
          width?: string | number;
          height?: string | number;
          events?: {
            onReady?: (event: { target: YTPlayerInstance }) => void;
            onStateChange?: (event: { data: number }) => void;
            onError?: (event: unknown) => void;
          };
          playerVars?: Record<string, unknown>;
        }
      ) => YTPlayerInstance;
      PlayerState?: {
        PLAYING: number;
        BUFFERING: number;
        ENDED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

export interface YTPlayerInstance {
  playVideo: () => void;
  pauseVideo: () => void;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  setVolume: (volume: number) => void;
  getVolume: () => number;
}

export const VideoBackground: React.FC<VideoBackgroundProps> = ({ soundEnabled, scrollProgress = 0, onPlayerReady }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [fallbackActive, setFallbackActive] = useState<boolean>(false);
  const playerRef = useRef<YTPlayerInstance | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const fallbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Depth overlay: shifts to 0.92 at the page bottom to simulate descending into the abyss
  const depthDarkness = 0.35 + scrollProgress * 0.57;

  useEffect(() => {
    // 4-second fallback timer: if video doesn't transition to playing, activate fallback visual
    fallbackTimeoutRef.current = setTimeout(() => {
      if (!isPlaying) {
        setFallbackActive(true);
      }
    }, 4000);

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) return;
      try {
        playerRef.current = new window.YT.Player('yt-bg-player', {
          events: {
            onReady: (event) => {
              event.target.mute();
              event.target.playVideo();
              setIsPlaying(true);
              onPlayerReady?.();
            },
            onStateChange: (event) => {
              // 1 is PLAYING, 3 is BUFFERING
              if (event.data === 1 || event.data === 3) {
                setIsPlaying(true);
                if (fallbackTimeoutRef.current) {
                  clearTimeout(fallbackTimeoutRef.current);
                }
              }
            },
            onError: () => {
              setFallbackActive(true);
            },
          },
        });
      } catch {
        // Fallback gracefully
        setIsPlaying(true);
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevCallback) prevCallback();
        initPlayer();
      };

      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        tag.async = true;
        document.body.appendChild(tag);
      }
    }

    // Safety: ensure video becomes visible after 1.5s regardless
    const showTimer = setTimeout(() => {
      setIsPlaying(true);
    }, 1500);

    return () => {
      if (fallbackTimeoutRef.current) clearTimeout(fallbackTimeoutRef.current);
      clearTimeout(showTimer);
    };
  }, [onPlayerReady, isPlaying]);

  // Sync mute/unmute with soundEnabled via API and postMessage
  useEffect(() => {
    if (playerRef.current) {
      try {
        if (soundEnabled) {
          playerRef.current.unMute();
          playerRef.current.setVolume(30);
        } else {
          playerRef.current.mute();
        }
      } catch {
        // Ignore
      }
    }

    // Backup postMessage command to iframe
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        const cmd = soundEnabled
          ? '{"event":"command","func":"unMute","args":""}'
          : '{"event":"command","func":"mute","args":""}';
        iframeRef.current.contentWindow.postMessage(cmd, '*');
        if (soundEnabled) {
          iframeRef.current.contentWindow.postMessage(
            '{"event":"command","func":"setVolume","args":[30]}',
            '*'
          );
        }
      } catch {
        // Ignore
      }
    }
  }, [soundEnabled]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-1 bg-[#02060D]">
      {/* Fallback Animated Gradient with Caustic Light Rays */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          fallbackActive ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: 'radial-gradient(circle at 50% 25%, #072648 0%, #031427 45%, #02060D 100%)',
        }}
      >
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(63,245,230,0.25),rgba(255,255,255,0))]" />
        {/* Animated drifting light shafts */}
        <div className="absolute inset-0 opacity-25 overflow-hidden">
          <div
            className="w-[200%] h-[200%] -top-[50%] -left-[50%] absolute"
            style={{
              background:
                'repeating-linear-gradient(65deg, transparent, transparent 50px, rgba(63,245,230,0.06) 60px, transparent 120px)',
              animation: 'spinRays 40s linear infinite',
            }}
          />
        </div>
      </div>

      {/* YouTube IFrame Wrapper with Full Viewport Cover (16:9 ratio centered) */}
      <div
        className={`absolute top-1/2 left-1/2 transition-opacity duration-[1200ms] pointer-events-none ${
          isPlaying ? 'opacity-90' : 'opacity-0'
        }`}
        style={{
          width: 'max(100vw, 177.78vh)',
          height: 'max(100vh, 56.25vw)',
          transform: 'translate(-50%, -50%) scale(1.12)',
        }}
      >
        <iframe
          ref={iframeRef}
          id="yt-bg-player"
          src="https://www.youtube.com/embed/YFmV_MRSD7M?autoplay=1&mute=1&loop=1&playlist=YFmV_MRSD7M&controls=0&showinfo=0&modestbranding=1&playsinline=1&rel=0&iv_load_policy=3&disablekb=1&enablejsapi=1"
          title="TideMind Marine Video Background"
          allow="autoplay; encrypted-media"
          className="w-full h-full pointer-events-none border-0 block absolute inset-0"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        />
      </div>

      {/* Balanced Oceanic Scrim: Dynamically darkens as user descends into the abyss */}
      <div
        className="absolute inset-0 pointer-events-none z-2 transition-opacity duration-300"
        style={{
          background: `linear-gradient(to bottom, rgba(2,6,13,${depthDarkness * 0.5}) 0%, rgba(2,6,13,${depthDarkness * 0.8}) 45%, rgba(2,6,13,${Math.min(0.96, depthDarkness * 1.1)}) 100%)`,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none z-2"
        style={{
          background: `radial-gradient(circle at center, transparent 35%, rgba(2,6,13,${depthDarkness * 0.7}) 80%, rgba(2,6,13,${Math.min(0.95, depthDarkness * 1.05)}) 100%)`,
        }}
      />

      <style>{`
        @keyframes spinRays {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
