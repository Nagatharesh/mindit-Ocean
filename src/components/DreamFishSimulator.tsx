import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import {
  Clock,
  Zap,
  Gauge,
  Compass,
  RotateCw,
  Waves,
  Play,
  Pause,
  ChevronRight,
} from 'lucide-react';
import { RealisticFishSchool, FishState } from './RealisticFishSchool';
import { playHoverTick, playSonarPing } from '../utils/audio';

interface DreamFishSimulatorProps {
  soundEnabled?: boolean;
}

export const DreamFishSimulator: React.FC<DreamFishSimulatorProps> = ({
  soundEnabled = false,
}) => {
  const [timeScale, setTimeScale] = useState<number>(1.0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [pulseCount, setPulseCount] = useState<number>(0);
  const [selectedSpecies, setSelectedSpecies] = useState<string>('all');
  const [selectedFish, setSelectedFish] = useState<FishState | null>(null);
  const [simClock, setSimClock] = useState<string>('');
  const [utcClock, setUtcClock] = useState<string>('');

  // Live simulation and UTC clock synchronization
  useEffect(() => {
    let simSeconds = 0;
    const interval = setInterval(() => {
      const now = new Date();
      setUtcClock(
        now.toISOString().substring(11, 19) + ' UTC'
      );

      if (!isPaused) {
        simSeconds += 0.1 * timeScale;
        const h = String(Math.floor((simSeconds / 3600) % 24)).padStart(2, '0');
        const m = String(Math.floor((simSeconds / 60) % 60)).padStart(2, '0');
        const s = String(Math.floor(simSeconds % 60)).padStart(2, '0');
        const ms = String(Math.floor((simSeconds % 1) * 10));
        setSimClock(`T+${h}:${m}:${s}.${ms}`);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [timeScale, isPaused]);

  const handlePulse = () => {
    playSonarPing(soundEnabled);
    setPulseCount((prev) => prev + 1);
  };

  const handleTimeChange = (speed: number) => {
    playHoverTick(soundEnabled);
    setTimeScale(speed);
    setIsPaused(false);
  };

  const modelsForSelection =
    selectedSpecies === 'all'
      ? ['Koi_01', 'Koi_02', 'Koi_03', 'Koi_05']
      : [selectedSpecies];

  return (
    <div className="relative w-full h-[480px] sm:h-[540px] bg-[#02060D] border border-[rgba(63,245,230,0.25)] overflow-hidden flex flex-col">
      {/* Top HUD Frame Bar */}
      <div className="h-10 bg-[#040C18] border-b border-[rgba(63,245,230,0.18)] px-4 flex items-center justify-between font-mono text-xs z-10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#3FF5E6] animate-pulse" />
          <span className="text-[#3FF5E6] font-bold">
            3D LIVING MARINE ECOSYSTEM · SKELETAL FISH SIMULATOR
          </span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="text-[#7A8CA3] hidden sm:inline">{utcClock}</span>
          <span className="text-[#3FF5E6] font-bold bg-[#07121F] px-2 py-0.5 border border-[rgba(63,245,230,0.3)]">
            {simClock || 'T+00:00:00.0'}
          </span>
        </div>
      </div>

      {/* 3D Canvas Area */}
      <div className="relative flex-1 w-full bg-gradient-to-b from-[#02060D] via-[#030E1C] to-[#02060D]">
        <Canvas
          camera={{ position: [0, 1.5, 9], fov: 50 }}
          dpr={[1, 1.5]}
          gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        >
          <Suspense
            fallback={
              <Html center>
                <div className="flex flex-col items-center justify-center p-4 bg-[#07121F]/90 border border-[#3FF5E6] font-mono text-xs text-[#3FF5E6]">
                  <RotateCw className="w-5 h-5 animate-spin mb-2" />
                  <span>Loading 3D Skeletal Marine Meshes...</span>
                </div>
              </Html>
            }
          >
            <RealisticFishSchool
              count={selectedSpecies === 'all' ? 6 : 4}
              timeScale={isPaused ? 0 : timeScale}
              models={modelsForSelection}
              pulseTrigger={pulseCount}
              onSelectFish={(f) => setSelectedFish(f)}
              interactive={true}
            />
            <OrbitControls
              enablePan={false}
              maxDistance={14}
              minDistance={3}
              maxPolarAngle={Math.PI / 1.7}
              minPolarAngle={Math.PI / 3}
            />
          </Suspense>
        </Canvas>

        {/* Orbit Hint (Top Left overlay) */}
        <div className="absolute top-3 left-3 pointer-events-none bg-[#07121F]/80 border border-[rgba(63,245,230,0.2)] px-2.5 py-1 text-[10px] font-mono text-[#7A8CA3] flex items-center gap-1.5 backdrop-blur-xs">
          <Compass className="w-3 h-3 text-[#3FF5E6]" />
          <span>DRAG TO ROTATE 3D PERSPECTIVE · SCROLL TO ZOOM</span>
        </div>

        {/* Real-time Kinematics Overlay (Top Right) */}
        <div className="absolute top-3 right-3 pointer-events-none bg-[#07121F]/85 border border-[rgba(63,245,230,0.25)] p-2.5 font-mono text-[10px] backdrop-blur-xs w-48 shadow-lg">
          <div className="text-[#3FF5E6] font-bold mb-1 flex items-center gap-1">
            <Gauge className="w-3 h-3" />
            <span>BIOLOGICAL TELEMETRY</span>
          </div>
          <div className="space-y-1 text-[#E6F1FF]">
            <div className="flex justify-between">
              <span className="text-[#7A8CA3]">Tail Beat:</span>
              <span className="text-[#3FF5E6]">
                {(1.8 * (isPaused ? 0 : timeScale)).toFixed(2)} Hz
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7A8CA3]">Velocity:</span>
              <span>{(1.35 * (isPaused ? 0 : timeScale)).toFixed(2)} m/s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7A8CA3]">Reynolds (Re):</span>
              <span className="text-[#4ADE80]">1.42 × 10⁴</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7A8CA3]">Boid Cohesion:</span>
              <span className="text-[#3FF5E6]">96.4%</span>
            </div>
          </div>
        </div>

        {/* Selected Fish Inspector Drawer (Bottom Left) */}
        {selectedFish && (
          <div className="absolute bottom-3 left-3 bg-[#07121F]/95 border border-[#3FF5E6] p-3 font-mono text-xs shadow-xl max-w-xs animate-fadeIn z-20">
            <div className="flex items-center justify-between border-b border-[rgba(63,245,230,0.2)] pb-1 mb-1.5">
              <span className="text-[#3FF5E6] font-bold">SPECIMEN #{selectedFish.id}</span>
              <button
                onClick={() => setSelectedFish(null)}
                className="text-[#7A8CA3] hover:text-white text-sm"
              >
                ✕
              </button>
            </div>
            <div className="text-[11px] text-[#E6F1FF] mb-1">
              MODEL: <span className="text-[#3FF5E6]">{selectedFish.model}.glb</span>
            </div>
            <div className="text-[10px] text-[#7A8CA3]">
              Realistic armature with skeletal deformation, dynamic wave banking, and boid flocking attraction.
            </div>
          </div>
        )}
      </div>

      {/* Bottom Simulator Control Panel: Timing & Interactions */}
      <div className="bg-[#040C18] border-t border-[rgba(63,245,230,0.2)] p-3 font-mono text-xs z-10 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Timing Multipliers */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-[#7A8CA3] flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#3FF5E6]" />
            <span>TIMING:</span>
          </span>
          <div className="flex items-center gap-1 bg-[#07121F] p-0.5 border border-[rgba(63,245,230,0.2)]">
            <button
              onClick={() => {
                playHoverTick(soundEnabled);
                setIsPaused(!isPaused);
              }}
              className={`px-2 py-1 text-[10px] transition-colors ${
                isPaused
                  ? 'bg-amber-400 text-black font-bold'
                  : 'text-[#7A8CA3] hover:text-white'
              }`}
            >
              {isPaused ? 'RESUME' : 'PAUSE'}
            </button>
            {[
              { label: '0.5x DRIFT', val: 0.5 },
              { label: '1.0x REAL', val: 1.0 },
              { label: '2.0x SURGE', val: 2.0 },
              { label: '4.0x DREAM', val: 4.0 },
            ].map((t) => (
              <button
                key={t.val}
                onClick={() => handleTimeChange(t.val)}
                className={`px-2 py-1 text-[10px] transition-colors ${
                  timeScale === t.val && !isPaused
                    ? 'bg-[#3FF5E6] text-[#02060D] font-bold'
                    : 'text-[#7A8CA3] hover:text-[#E6F1FF]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Center: Species Selector */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-[#7A8CA3]">SPECIES:</span>
          <select
            value={selectedSpecies}
            onChange={(e) => {
              playHoverTick(soundEnabled);
              setSelectedSpecies(e.target.value);
            }}
            className="bg-[#07121F] text-[#3FF5E6] border border-[rgba(63,245,230,0.3)] px-2 py-1 text-[11px] outline-none cursor-pointer"
          >
            <option value="all">All Species (Multi-Boid)</option>
            <option value="Koi_01">Acro-Reef Chromis (Koi_01)</option>
            <option value="Koi_02">Azure Trevally (Koi_02)</option>
            <option value="Koi_03">Golden Damselfish (Koi_03)</option>
            <option value="Koi_05">Coral Angelfish (Koi_05)</option>
          </select>
        </div>

        {/* Right: Sonar Impulse Trigger */}
        <button
          onClick={handlePulse}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#3FF5E6] hover:bg-[#2fe0d2] text-[#02060D] font-bold text-[11px] uppercase tracking-wider transition-colors cursor-pointer shadow-[0_0_12px_rgba(63,245,230,0.3)]"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>SONAR STARTLE IMPULSE</span>
        </button>
      </div>
    </div>
  );
};
