import React, { useMemo, useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RealisticFishSchool } from './RealisticFishSchool';

interface PlanktonFieldProps {
  scrollProgress: number;
}

function PlanktonPoints({ scrollProgress }: PlanktonFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const count = isMobile ? 400 : 1500;

  // Track normalized mouse in 3D space
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Generate initial particle coordinates and velocities
  const [positions, initialPositions, sizes, sways] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const initPos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    const sw = new Float32Array(count * 3); // phase, speed, amplitude

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 28;
      const y = (Math.random() - 0.5) * 36;
      const z = (Math.random() - 0.5) * 16 - 2;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      initPos[i * 3] = x;
      initPos[i * 3 + 1] = y;
      initPos[i * 3 + 2] = z;

      sz[i] = Math.random() * 2.5 + 1.0;

      sw[i * 3] = Math.random() * Math.PI * 2; // phase
      sw[i * 3 + 1] = 0.4 + Math.random() * 0.8; // speed
      sw[i * 3 + 2] = 0.2 + Math.random() * 0.5; // amplitude
    }

    return [pos, initPos, sz, sw];
  }, [count]);

  const cyanColor = useMemo(() => new THREE.Color('#3FF5E6'), []);
  const deepBlueColor = useMemo(() => new THREE.Color('#0F4C81'), []);
  const currentColor = useMemo(() => new THREE.Color(), []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position;
    const colorAttr = geo.attributes.color;
    const t = state.clock.getElapsedTime();

    // Smooth lerp mouse
    mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
    mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

    // Camera parallax: max ±0.3 units lerped
    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      mouseRef.current.x * 0.35,
      0.04
    );
    // Camera scroll descent: y decreases as scrollProgress increases
    const targetCamY = -scrollProgress * 12;
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      targetCamY + mouseRef.current.y * 0.2,
      0.05
    );

    // Particle color shifts from cyan to deep blue as user scrolls
    const depthT = Math.min(Math.max(scrollProgress, 0), 1);
    currentColor.copy(cyanColor).lerp(deepBlueColor, depthT * 0.75);

    // Mouse position projected in approximate 3D world z = 0 plane
    const mWorldX = mouseRef.current.x * 12;
    const mWorldY = state.camera.position.y + mouseRef.current.y * 8;

    const repulsionRadiusSq = 5.0 * 5.0;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const phase = sways[idx];
      const speed = sways[idx + 1];
      const amp = sways[idx + 2];

      // Drift upward slowly
      positions[idx + 1] += delta * (0.35 + amp * 0.2);

      // Loop when leaving top
      const topBound = state.camera.position.y + 18;
      const bottomBound = state.camera.position.y - 18;
      if (positions[idx + 1] > topBound) {
        positions[idx + 1] = bottomBound;
        positions[idx] = initialPositions[idx] + (Math.random() - 0.5) * 4;
      }

      // Sway sideways with sine wave
      const swayX = Math.sin(t * speed + phase) * (amp * 0.02);
      positions[idx] += swayX;

      // Mouse repulsion calculation
      const dx = positions[idx] - mWorldX;
      const dy = positions[idx + 1] - mWorldY;
      const distSq = dx * dx + dy * dy;

      if (distSq < repulsionRadiusSq && distSq > 0.001) {
        const dist = Math.sqrt(distSq);
        const force = (1 - dist / 5.0) * 0.08;
        positions[idx] += (dx / dist) * force;
        positions[idx + 1] += (dy / dist) * force;
      }

      // Color assignment
      if (colorAttr) {
        const cArr = colorAttr.array as Float32Array;
        // subtle variation per particle
        const v = 0.85 + (i % 5) * 0.03;
        cArr[idx] = currentColor.r * v;
        cArr[idx + 1] = currentColor.g * v;
        cArr[idx + 2] = currentColor.b * v;
      }
    }

    posAttr.needsUpdate = true;
    if (colorAttr) colorAttr.needsUpdate = true;
  });

  const colors = useMemo(() => {
    const c = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      c[i * 3] = 0.25;
      c[i * 3 + 1] = 0.96;
      c[i * 3 + 2] = 0.9;
    }
    return c;
  }, [count]);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.16}
        sizeAttenuation={true}
        vertexColors={true}
        transparent={true}
        opacity={0.7}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

interface Background3DCanvasProps {
  scrollProgress: number;
}

export const Background3DCanvas: React.FC<Background3DCanvasProps> = ({ scrollProgress }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-3 overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60, near: 0.1, far: 100 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
      >
        <PlanktonPoints scrollProgress={scrollProgress} />
        <Suspense fallback={null}>
          <RealisticFishSchool
            count={5}
            timeScale={1.0}
            interactive={true}
            depthOffset={scrollProgress * 8}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
