import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface DepthLayersProps {
  inView?: boolean;
}

function LayersScene({ inView = true }: { inView?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const mouseRef = useRef({ targetX: 0, targetY: 0, curX: 0, curY: 0 });

  // Separate outward as it scrolls into view:
  // Base spacing: 1.2 units, expanding to ~2.1 units when in view
  const separationRef = useRef(1.4);

  // Surface mesh plane (plane geometry with segments for wave deformation)
  const surfaceGeo = useMemo(() => new THREE.PlaneGeometry(5.4, 3.4, 28, 20), []);
  const thermoGeo = useMemo(() => new THREE.PlaneGeometry(5.4, 3.4, 28, 20), []);
  const seabedGeo = useMemo(() => new THREE.PlaneGeometry(5.4, 3.4, 28, 20), []);

  // Causal vertical cascading pulse lines between layers
  const verticalCausalLines = useMemo(() => {
    return [
      { x: -1.6, z: -0.6, speed: 1.2, delay: 0 },
      { x: -0.4, z: 0.8, speed: 1.5, delay: 0.3 },
      { x: 0.6, z: -0.4, speed: 1.1, delay: 0.6 },
      { x: 1.7, z: 0.5, speed: 1.4, delay: 0.2 },
      { x: 0.0, z: 0.0, speed: 1.3, delay: 0.4 },
    ];
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Lerp mouse interaction
    mouseRef.current.curX += (mouseRef.current.targetX - mouseRef.current.curX) * 0.06;
    mouseRef.current.curY += (mouseRef.current.targetY - mouseRef.current.curY) * 0.06;

    // Expand spacing smoothly when in view
    const targetSeparation = inView ? 2.1 : 1.2;
    separationRef.current += (targetSeparation - separationRef.current) * 0.05;

    if (groupRef.current) {
      // Isometric tilted angle: around 35° X tilt, 25° Y rotation + mouse follow
      groupRef.current.rotation.x = 0.65 + mouseRef.current.curY * 0.25;
      groupRef.current.rotation.y = -0.55 + mouseRef.current.curX * 0.35;
    }

    // Animate wave displacement on planes
    const animatePlaneWave = (geo: THREE.PlaneGeometry, speed: number, amp: number, phaseOffset: number) => {
      const posAttr = geo.attributes.position;
      const count = posAttr.count;
      for (let i = 0; i < count; i++) {
        const u = posAttr.getX(i);
        const v = posAttr.getY(i);
        const z = Math.sin(u * 1.5 + t * speed + phaseOffset) * Math.cos(v * 1.8 + t * 0.8) * amp;
        posAttr.setZ(i, z);
      }
      posAttr.needsUpdate = true;
    };

    animatePlaneWave(surfaceGeo, 1.8, 0.15, 0);
    animatePlaneWave(thermoGeo, 1.2, 0.1, 1.5);
    animatePlaneWave(seabedGeo, 0.6, 0.08, 3.0);
  });

  const sep = separationRef.current;

  return (
    <group
      ref={groupRef}
      onPointerMove={(e) => {
        mouseRef.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseRef.current.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
      }}
    >
      {/* 1. SURFACE LAYER: Amber-to-Red Heat Map */}
      <group position={[0, sep, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh geometry={surfaceGeo}>
          <meshStandardMaterial
            color="#FF5A5F"
            emissive="#F5B83F"
            emissiveIntensity={0.65}
            roughness={0.4}
            metalness={0.2}
            transparent={true}
            opacity={0.45}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh geometry={surfaceGeo}>
          <meshBasicMaterial
            color="#FFAA40"
            wireframe={true}
            transparent={true}
            opacity={0.25}
          />
        </mesh>
      </group>

      {/* 2. THERMOCLINE LAYER: Bioluminescent Cyan */}
      <group position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh geometry={thermoGeo}>
          <meshStandardMaterial
            color="#088395"
            emissive="#3FF5E6"
            emissiveIntensity={0.7}
            roughness={0.3}
            metalness={0.3}
            transparent={true}
            opacity={0.4}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh geometry={thermoGeo}>
          <meshBasicMaterial
            color="#3FF5E6"
            wireframe={true}
            transparent={true}
            opacity={0.25}
          />
        </mesh>
      </group>

      {/* 3. SEABED LAYER: Green-to-Coral Substrate */}
      <group position={[0, -sep, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh geometry={seabedGeo}>
          <meshStandardMaterial
            color="#0F5132"
            emissive="#4ADE80"
            emissiveIntensity={0.5}
            roughness={0.5}
            metalness={0.2}
            transparent={true}
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh geometry={seabedGeo}>
          <meshBasicMaterial
            color="#4ADE80"
            wireframe={true}
            transparent={true}
            opacity={0.25}
          />
        </mesh>
      </group>

      {/* Cascading Causal Vertical Beams */}
      {verticalCausalLines.map((col, idx) => (
        <CausalVerticalBeam
          key={idx}
          x={col.x}
          z={col.z}
          topY={sep}
          bottomY={-sep}
          speed={col.speed}
          delay={col.delay}
        />
      ))}
    </group>
  );
}

function CausalVerticalBeam({
  x,
  z,
  topY,
  bottomY,
  speed,
  delay,
}: {
  x: number;
  z: number;
  topY: number;
  bottomY: number;
  speed: number;
  delay: number;
}) {
  const lineRef = useRef<THREE.Line>(null);
  const pulseRef = useRef<THREE.Mesh>(null);

  const geo = useMemo(() => {
    const pts = [new THREE.Vector3(x, topY, z), new THREE.Vector3(x, bottomY, z)];
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [x, z, topY, bottomY]);

  useFrame((state) => {
    if (lineRef.current) {
      const pos = lineRef.current.geometry.attributes.position.array as Float32Array;
      pos[1] = topY;
      pos[4] = bottomY;
      lineRef.current.geometry.attributes.position.needsUpdate = true;
    }

    if (pulseRef.current) {
      const t = (state.clock.getElapsedTime() * speed + delay) % 1;
      const curY = topY - t * (topY - bottomY);
      pulseRef.current.position.set(x, curY, z);
    }
  });

  const beamLine = useMemo(() => {
    return new THREE.Line(
      geo,
      new THREE.LineBasicMaterial({
        color: '#3FF5E6',
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
      })
    );
  }, [geo]);

  return (
    <group>
      <primitive object={beamLine} ref={lineRef} />
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshBasicMaterial
          color="#3FF5E6"
          transparent={true}
          opacity={0.9}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

export const DepthLayers: React.FC<DepthLayersProps> = ({ inView = true }) => {
  return (
    <div className="w-full h-[360px] sm:h-[420px] lg:h-[480px] relative select-none">
      <Canvas
        camera={{ position: [0, 0, 7.8], fov: 45, near: 0.1, far: 50 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[4, 8, 4]} intensity={1.2} color="#FFFFFF" />
        <pointLight position={[-4, -3, 3]} intensity={0.8} color="#3FF5E6" />
        <LayersScene inView={inView} />
      </Canvas>

      {/* Crisp 3D Layer HUD Labels (Rendered cleanly as DOM overlay to eliminate Drei root unmount conflicts) */}
      <div className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 flex flex-col justify-between h-[240px] sm:h-[280px] pointer-events-none z-10">
        {/* Surface Label */}
        <div
          className="bracket-panel px-3 py-1.5 bg-[#07121F]/90 border border-[rgba(63,245,230,0.2)] border-l-2 border-l-[#FF5A5F] text-[11px] font-mono tracking-wider shadow-[0_0_15px_rgba(255,90,95,0.2)]"
          data-readout="SURFACE ISOTHERM ANOMALY"
        >
          <span className="font-semibold text-white">01. SURFACE</span>
          <span className="text-[#F5B83F] ml-1.5 font-bold">· TEMPERATURE (+2.4°C)</span>
        </div>

        {/* Thermocline Label */}
        <div
          className="bracket-panel px-3 py-1.5 bg-[#07121F]/90 border border-[rgba(63,245,230,0.2)] border-l-2 border-l-[#3FF5E6] text-[11px] font-mono tracking-wider shadow-[0_0_15px_rgba(63,245,230,0.2)]"
          data-readout="THERMOCLINE STRATIFICATION BARRIER"
        >
          <span className="font-semibold text-white">02. THERMOCLINE</span>
          <span className="text-[#3FF5E6] ml-1.5 font-bold">· OXYGEN (5.8 mg/L)</span>
        </div>

        {/* Seabed Label */}
        <div
          className="bracket-panel px-3 py-1.5 bg-[#07121F]/90 border border-[rgba(63,245,230,0.2)] border-l-2 border-l-[#4ADE80] text-[11px] font-mono tracking-wider shadow-[0_0_15px_rgba(74,222,128,0.2)]"
          data-readout="BENTHIC REEF STRESS MATRIX"
        >
          <span className="font-semibold text-white">03. SEABED</span>
          <span className="text-[#4ADE80] ml-1.5 font-bold">· CORAL & ALGAE (DHW 9.2)</span>
        </div>
      </div>
    </div>
  );
};
