import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { playSonarPing } from '../utils/audio';

export interface AgentNodeData {
  id: string;
  name: string;
  role: string;
  icon: string;
  orbitRadius: number;
  orbitSpeed: number;
  orbitTilt: [number, number, number];
  color: string;
}

export const AGENTS: AgentNodeData[] = [
  {
    id: 'sentinel',
    name: 'SENTINEL',
    role: 'Blocks poisoned data & prompt injection',
    icon: '🛡️',
    orbitRadius: 2.3,
    orbitSpeed: 0.65,
    orbitTilt: [0.35, 0.2, 0.1],
    color: '#3FF5E6',
  },
  {
    id: 'oceanographer',
    name: 'OCEANOGRAPHER',
    role: 'Reads heat, oxygen & ocean currents',
    icon: '🌊',
    orbitRadius: 2.5,
    orbitSpeed: -0.5,
    orbitTilt: [-0.4, 0.5, 0.2],
    color: '#4ADE80',
  },
  {
    id: 'ecologist',
    name: 'ECOLOGIST',
    role: 'Maps stress onto the trophic food web',
    icon: '🐠',
    orbitRadius: 2.7,
    orbitSpeed: 0.45,
    orbitTilt: [0.6, -0.3, 0.4],
    color: '#3FF5E6',
  },
  {
    id: 'skeptic',
    name: 'SKEPTIC',
    role: 'Hunts weak links & hallucinated claims',
    icon: '🧐',
    orbitRadius: 2.9,
    orbitSpeed: -0.6,
    orbitTilt: [-0.2, -0.6, 0.3],
    color: '#F5B83F',
  },
  {
    id: 'strategist',
    name: 'STRATEGIST',
    role: 'Tests interventions in simulation sandbox',
    icon: '🧭',
    orbitRadius: 3.1,
    orbitSpeed: 0.4,
    orbitTilt: [0.5, 0.4, -0.5],
    color: '#3FF5E6',
  },
  {
    id: 'synthesizer',
    name: 'SYNTHESIZER',
    role: 'Builds the verified causal cascade',
    icon: '📡',
    orbitRadius: 3.3,
    orbitSpeed: -0.35,
    orbitTilt: [0.1, 0.7, -0.3],
    color: '#4ADE80',
  },
];

interface SonarRing {
  id: number;
}

function CoreScene({
  soundEnabled,
  highlightedAgentId,
  hoveredAgentId,
  onNodeHover,
}: {
  soundEnabled: boolean;
  highlightedAgentId?: string | null;
  hoveredAgentId: string | null;
  onNodeHover: (id: string | null) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const outerSphereRef = useRef<THREE.Mesh>(null);
  const innerSphereRef = useRef<THREE.Mesh>(null);
  const [sonarRings, setSonarRings] = useState<SonarRing[]>([]);

  // Smooth mouse tilt tracking
  const mouseRef = useRef({ targetX: 0, targetY: 0, currentX: 0, currentY: 0 });

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Lerp mouse
    mouseRef.current.currentX += (mouseRef.current.targetX - mouseRef.current.currentX) * 0.06;
    mouseRef.current.currentY += (mouseRef.current.targetY - mouseRef.current.currentY) * 0.06;

    if (groupRef.current) {
      // Mouse interaction: tilts toward cursor smoothly
      groupRef.current.rotation.y = t * 0.15 + mouseRef.current.currentX * 0.6;
      groupRef.current.rotation.x = mouseRef.current.currentY * 0.4;
    }

    if (outerSphereRef.current) {
      outerSphereRef.current.rotation.y = t * 0.08;
      outerSphereRef.current.rotation.x = Math.sin(t * 0.05) * 0.1;
    }

    // Heartbeat pulse for inner glowing sphere
    if (innerSphereRef.current) {
      const pulse = 1 + 0.08 * Math.sin(t * 3.2) * Math.sin(t * 3.2);
      innerSphereRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  const handlePointerMove = (e: { clientX: number; clientY: number }) => {
    mouseRef.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseRef.current.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
  };

  const triggerSonar = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    playSonarPing(soundEnabled);
    setSonarRings((prev) => [...prev.slice(-3), { id: Date.now() }]);
  };

  return (
    <group
      ref={groupRef}
      onPointerMove={(e) => handlePointerMove(e)}
      onClick={triggerSonar}
    >
      {/* Outer Rotating Wireframe Icosphere */}
      <mesh ref={outerSphereRef}>
        <icosahedronGeometry args={[1.65, 2]} />
        <meshBasicMaterial
          wireframe={true}
          color="#3FF5E6"
          transparent={true}
          opacity={0.32}
        />
      </mesh>

      {/* Second deeper wireframe shell for spatial depth */}
      <mesh>
        <icosahedronGeometry args={[1.35, 1]} />
        <meshBasicMaterial
          wireframe={true}
          color="#3FF5E6"
          transparent={true}
          opacity={0.16}
        />
      </mesh>

      {/* Inner Glowing Pulsing Heartbeat Core */}
      <mesh ref={innerSphereRef}>
        <sphereGeometry args={[0.78, 32, 32]} />
        <meshStandardMaterial
          color="#063248"
          emissive="#3FF5E6"
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.7}
          transparent={true}
          opacity={0.92}
        />
      </mesh>

      {/* Expanding Sonar Torus Rings from core clicks */}
      {sonarRings.map((ring) => (
        <ExpandingTorus
          key={ring.id}
          onComplete={() => setSonarRings((prev) => prev.filter((r) => r.id !== ring.id))}
        />
      ))}

      {/* 6 Orbiting Agent Nodes + Tilted Rings + Connecting Pulse Lines */}
      {AGENTS.map((agent, index) => {
        const isHovered = hoveredAgentId === agent.id || highlightedAgentId === agent.id;
        return (
          <OrbitingAgent
            key={agent.id}
            agent={agent}
            index={index}
            isHovered={isHovered}
            onHover={(hover) => {
              onNodeHover(hover ? agent.id : null);
            }}
          />
        );
      })}
    </group>
  );
}

function ExpandingTorus({ onComplete }: { onComplete: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [life, setLife] = useState(0);

  useFrame((_, delta) => {
    setLife((prev) => {
      const next = prev + delta * 1.6;
      if (next >= 1) {
        onComplete();
        return 1;
      }
      return next;
    });

    if (meshRef.current) {
      const scale = 1.0 + life * 3.8;
      meshRef.current.scale.set(scale, scale, scale);
      const mat = meshRef.current.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = Math.max(0, (1 - life) * 0.65);
      }
    }
  });

  return (
    <mesh ref={meshRef} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[1.5, 0.04, 16, 64]} />
      <meshBasicMaterial
        color="#3FF5E6"
        transparent={true}
        opacity={0.65}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function OrbitingAgent({
  agent,
  index,
  isHovered,
  onHover,
}: {
  agent: AgentNodeData;
  index: number;
  isHovered: boolean;
  onHover: (hover: boolean) => void;
}) {
  const nodeRef = useRef<THREE.Group>(null);
  const lineRef = useRef<THREE.Line>(null);
  const pulsePointRef = useRef<THREE.Mesh>(null);

  const ringCurve = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const segments = 64;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      pts.push(
        new THREE.Vector3(
          Math.cos(theta) * agent.orbitRadius,
          0,
          Math.sin(theta) * agent.orbitRadius
        )
      );
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [agent.orbitRadius]);

  const lineGeo = useMemo(() => {
    const pts = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0)];
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const angle = t * agent.orbitSpeed + index * (Math.PI / 3);

    const x = Math.cos(angle) * agent.orbitRadius;
    const z = Math.sin(angle) * agent.orbitRadius;
    const y = Math.sin(angle * 2) * 0.25;

    // Apply orbit tilt transformation
    const pos = new THREE.Vector3(x, y, z);
    const euler = new THREE.Euler(...agent.orbitTilt);
    pos.applyEuler(euler);

    if (nodeRef.current) {
      nodeRef.current.position.copy(pos);
      const targetScale = isHovered ? 1.7 : 1.0;
      nodeRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15);
    }

    // Update connecting line between core center (0,0,0) and node
    if (lineRef.current) {
      const positions = lineRef.current.geometry.attributes.position.array as Float32Array;
      positions[3] = pos.x;
      positions[4] = pos.y;
      positions[5] = pos.z;
      lineRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Animate light pulse travelling along the line
    if (pulsePointRef.current) {
      const pulseT = (t * 1.4 + index * 0.3) % 1;
      pulsePointRef.current.position.set(pos.x * pulseT, pos.y * pulseT, pos.z * pulseT);
    }
  });

  const ringLine = useMemo(() => {
    return new THREE.Line(
      ringCurve,
      new THREE.LineBasicMaterial({
        color: agent.color,
        transparent: true,
        opacity: 0.12,
      })
    );
  }, [ringCurve, agent.color]);

  const connectingLine = useMemo(() => {
    return new THREE.Line(
      lineGeo,
      new THREE.LineBasicMaterial({
        color: agent.color,
        transparent: true,
        opacity: 0.25,
      })
    );
  }, [lineGeo, agent.color]);

  return (
    <group>
      {/* Tilted Orbit Ring */}
      <group rotation={agent.orbitTilt}>
        <primitive object={ringLine} />
      </group>

      {/* Connecting animated line to core */}
      <primitive object={connectingLine} ref={lineRef} />

      {/* Light pulse travelling along the line */}
      <mesh ref={pulsePointRef}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial
          color="#3FF5E6"
          transparent={true}
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Orbiting Agent Node */}
      <group
        ref={nodeRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(true);
        }}
        onPointerOut={() => onHover(false)}
      >
        {/* Glow halo */}
        <mesh>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshBasicMaterial
            color={agent.color}
            transparent={true}
            opacity={isHovered ? 0.9 : 0.35}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Solid core sphere */}
        <mesh>
          <sphereGeometry args={[0.11, 16, 16]} />
          <meshStandardMaterial
            color="#02060D"
            emissive={agent.color}
            emissiveIntensity={isHovered ? 1.6 : 0.9}
          />
        </mesh>
      </group>
    </group>
  );
}

interface EcosystemCoreProps {
  soundEnabled: boolean;
  highlightedAgentId?: string | null;
  onNodeHover?: (id: string | null) => void;
}

export const EcosystemCore: React.FC<EcosystemCoreProps> = ({
  soundEnabled,
  highlightedAgentId,
  onNodeHover,
}) => {
  const [internalHoveredId, setInternalHoveredId] = useState<string | null>(null);

  const activeId = highlightedAgentId || internalHoveredId;
  const activeAgent = AGENTS.find((a) => a.id === activeId);

  const handleHoverChange = (id: string | null) => {
    setInternalHoveredId(id);
    onNodeHover?.(id);
  };

  return (
    <div className="w-full h-[400px] sm:h-[480px] lg:h-[580px] relative select-none">
      <Canvas
        camera={{ position: [0, 0.5, 6.2], fov: 45, near: 0.1, far: 50 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 6, 5]} intensity={1.2} color="#3FF5E6" />
        <pointLight position={[-5, -4, -4]} intensity={0.8} color="#0F4C81" />
        <CoreScene
          soundEnabled={soundEnabled}
          highlightedAgentId={highlightedAgentId}
          hoveredAgentId={internalHoveredId}
          onNodeHover={handleHoverChange}
        />
      </Canvas>

      {/* Active Agent Dossier Overlay (Clean DOM overlay, avoiding Drei root unmount conflicts) */}
      {activeAgent && (
        <div
          className="absolute top-4 right-4 pointer-events-none z-20 bracket-panel p-3 bg-[#07121F]/95 border border-[#3FF5E6]/60 shadow-[0_0_25px_rgba(63,245,230,0.3)] animate-in fade-in zoom-in-95 duration-200"
          data-readout={`AGENT DOSSIER: ${activeAgent.name}`}
        >
          <span className="bracket-corner-tr" />
          <span className="bracket-corner-bl" />
          <div className="flex items-center gap-2 font-mono text-xs text-[#3FF5E6] font-bold tracking-wider">
            <span>{activeAgent.icon}</span>
            <span>{activeAgent.name}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] pulse-dot-green ml-auto" />
            <span className="text-[10px] text-[#4ADE80] font-normal">ACTIVE</span>
          </div>
          <div className="font-mono text-[11px] text-[#A6C0DE] mt-1.5 max-w-[210px] leading-snug">
            {activeAgent.role}
          </div>
        </div>
      )}

      {/* Visual interaction hint */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 pointer-events-none text-[10px] font-mono tracking-widest text-[#7A8CA3] uppercase flex items-center gap-2 whitespace-nowrap">
        <span className="w-1.5 h-1.5 bg-[#3FF5E6] rounded-full animate-ping opacity-75" />
        <span>INTERACTIVE ECOSYSTEM CORE · CLICK FOR SONAR</span>
      </div>
    </div>
  );
};
