import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface CausalEdge {
  id: string;
  source: string;
  target: string;
  claim: string;
  verdict: 'VERIFIED' | 'PHYSICS-GAP' | 'UNSUPPORTED';
  physicsShare: number;
  effect: string;
  note: string;
  sourcePos: [number, number, number];
  targetPos: [number, number, number];
}

export const CAUSAL_EDGES: CausalEdge[] = [
  {
    id: 'sst-dhw',
    source: 'SST Anomaly',
    target: 'Heat Stress / DHW',
    claim: 'SST Anomaly → Heat Stress / DHW',
    verdict: 'VERIFIED',
    physicsShare: 0.97,
    effect: '+4.2 °C-weeks accumulated',
    note: 'Degree Heating Weeks calculated via thermodynamic heat summation above climatology.',
    sourcePos: [-2.2, 1.4, 0],
    targetPos: [-0.6, 1.4, 0],
  },
  {
    id: 'dhw-bleaching',
    source: 'Heat Stress / DHW',
    target: 'Coral Bleaching',
    claim: 'Heat Stress → Coral Bleaching',
    verdict: 'VERIFIED',
    physicsShare: 0.88,
    effect: '−31% coral cover ± 4%',
    note: 'Simulated counterfactual: removing DHW pulse restores zooxanthellae retention.',
    sourcePos: [-0.6, 1.4, 0],
    targetPos: [-1.2, -1.3, 0],
  },
  {
    id: 'bleaching-herbivore',
    source: 'Coral Bleaching',
    target: 'Herbivore Decline',
    claim: 'Coral Bleaching → Herbivore Decline',
    verdict: 'PHYSICS-GAP',
    physicsShare: 0.54,
    effect: '−12% herbivore biomass ± 6%',
    note: 'Neural-only evidence — flagged for scientists. Physics equations do not resolve grazing lag.',
    sourcePos: [-1.2, -1.3, 0],
    targetPos: [0.8, -1.3, 0],
  },
  {
    id: 'herbivore-algae',
    source: 'Herbivore Decline',
    target: 'Algal Overgrowth',
    claim: 'Herbivore Decline → Algal Overgrowth',
    verdict: 'VERIFIED',
    physicsShare: 0.81,
    effect: '+18% macroalgae cover ± 5%',
    note: 'Loss of parrotfish and urchin grazing creates space for competitive turf dominance.',
    sourcePos: [0.8, -1.3, 0],
    targetPos: [2.2, -1.3, 0],
  },
  {
    id: 'sst-chlorophyll',
    source: 'SST Anomaly',
    target: 'Chlorophyll Spike',
    claim: 'SST Anomaly → Chlorophyll Spike',
    verdict: 'UNSUPPORTED',
    physicsShare: 0.18,
    effect: '+1% ± 7% (null effect)',
    note: 'Effect not distinguishable from noise. Pycnocline stratification suppressed nutrient flux.',
    sourcePos: [-2.2, 1.4, 0],
    targetPos: [1.2, 0.1, 0.4],
  },
];

interface NodeData {
  id: string;
  name: string;
  layer: 'surface' | 'thermocline' | 'seabed';
  pos: [number, number, number];
}

const NODES: NodeData[] = [
  { id: 'sst', name: 'SST Anomaly', layer: 'surface', pos: [-2.2, 1.4, 0] },
  { id: 'dhw', name: 'Heat Stress / DHW', layer: 'surface', pos: [-0.6, 1.4, 0] },
  { id: 'chloro', name: 'Chlorophyll Spike', layer: 'thermocline', pos: [1.2, 0.1, 0.4] },
  { id: 'bleach', name: 'Coral Bleaching', layer: 'seabed', pos: [-1.2, -1.3, 0] },
  { id: 'herbivore', name: 'Herbivore Decline', layer: 'seabed', pos: [0.8, -1.3, 0] },
  { id: 'algae', name: 'Algal Overgrowth', layer: 'seabed', pos: [2.2, -1.3, 0] },
];

function GraphScene({
  selectedEdgeId,
  onSelectEdge,
}: {
  selectedEdgeId: string;
  onSelectEdge: (id: string) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const mouseRef = useRef({ targetX: 0, targetY: 0, curX: 0, curY: 0 });

  useFrame((state) => {
    mouseRef.current.curX += (mouseRef.current.targetX - mouseRef.current.curX) * 0.05;
    mouseRef.current.curY += (mouseRef.current.targetY - mouseRef.current.curY) * 0.05;

    if (groupRef.current) {
      groupRef.current.rotation.y = mouseRef.current.curX * 0.3;
      groupRef.current.rotation.x = -mouseRef.current.curY * 0.2;
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerMove={(e) => {
        mouseRef.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseRef.current.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
      }}
    >
      {/* Background Depth Reference Planes */}
      {/* Surface reference grid */}
      <gridHelper args={[6, 8, '#3FF5E6', '#3FF5E6']} position={[0, 1.4, 0]} rotation={[0, 0, 0]} />
      {/* Seabed reference grid */}
      <gridHelper args={[6, 8, '#4ADE80', '#4ADE80']} position={[0, -1.3, 0]} rotation={[0, 0, 0]} />

      {/* Edges */}
      {CAUSAL_EDGES.map((edge) => (
        <GraphEdgeLine
          key={edge.id}
          edge={edge}
          isSelected={edge.id === selectedEdgeId}
          onClick={() => onSelectEdge(edge.id)}
        />
      ))}

      {/* Nodes */}
      {NODES.map((node) => (
        <GraphNode key={node.id} node={node} />
      ))}
    </group>
  );
}

function GraphEdgeLine({
  edge,
  isSelected,
  onClick,
}: {
  edge: CausalEdge;
  isSelected: boolean;
  onClick: () => void;
}) {
  const pulseRef = useRef<THREE.Mesh>(null);

  const edgeColor =
    edge.verdict === 'VERIFIED'
      ? '#4ADE80'
      : edge.verdict === 'PHYSICS-GAP'
      ? '#B18CFF'
      : '#FF5A5F';

  const lineGeo = useMemo(() => {
    const pts = [
      new THREE.Vector3(...edge.sourcePos),
      new THREE.Vector3(...edge.targetPos),
    ];
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [edge.sourcePos, edge.targetPos]);

  const lineMat = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: edgeColor,
      transparent: true,
      opacity: isSelected ? 0.95 : edge.verdict === 'UNSUPPORTED' ? 0.35 : 0.65,
    });
  }, [edgeColor, isSelected, edge.verdict]);

  useFrame((state) => {
    if (pulseRef.current && edge.verdict === 'VERIFIED') {
      const t = (state.clock.getElapsedTime() * 0.9) % 1;
      const x = THREE.MathUtils.lerp(edge.sourcePos[0], edge.targetPos[0], t);
      const y = THREE.MathUtils.lerp(edge.sourcePos[1], edge.targetPos[1], t);
      const z = THREE.MathUtils.lerp(edge.sourcePos[2], edge.targetPos[2], t);
      pulseRef.current.position.set(x, y, z);
    }
  });

  return (
    <group onClick={(e) => { e.stopPropagation(); onClick(); }}>
      <primitive object={new THREE.Line(lineGeo, lineMat)} />

      {/* Hit box for easy clicking */}
      <mesh
        position={[
          (edge.sourcePos[0] + edge.targetPos[0]) / 2,
          (edge.sourcePos[1] + edge.targetPos[1]) / 2,
          (edge.sourcePos[2] + edge.targetPos[2]) / 2,
        ]}
      >
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Pulse along verified edges only */}
      {edge.verdict === 'VERIFIED' && (
        <mesh ref={pulseRef}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshBasicMaterial
            color="#4ADE80"
            transparent
            opacity={0.9}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
    </group>
  );
}

function GraphNode({ node }: { node: NodeData }) {
  const nodeColor =
    node.layer === 'surface'
      ? '#3FF5E6'
      : node.layer === 'thermocline'
      ? '#3FF5E6'
      : '#4ADE80';

  return (
    <group position={node.pos}>
      <mesh>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshStandardMaterial
          color="#07121F"
          emissive={nodeColor}
          emissiveIntensity={1.2}
          roughness={0.3}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.24, 16, 16]} />
        <meshBasicMaterial
          color={nodeColor}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

export const CascadeGraph3D: React.FC<{
  selectedEdgeId: string;
  onSelectEdge: (id: string) => void;
}> = ({ selectedEdgeId, onSelectEdge }) => {
  return (
    <div className="w-full h-[380px] sm:h-[440px] relative select-none">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 50, near: 0.1, far: 50 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[4, 5, 4]} intensity={1.2} color="#3FF5E6" />
        <GraphScene selectedEdgeId={selectedEdgeId} onSelectEdge={onSelectEdge} />
      </Canvas>

      {/* Depth Level Markers */}
      <div className="absolute left-3 top-4 pointer-events-none font-mono text-[9px] text-[#3FF5E6] flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 bg-[#3FF5E6] rounded-full" />
        <span>SURFACE LEVEL (0–20m)</span>
      </div>
      <div className="absolute left-3 bottom-4 pointer-events-none font-mono text-[9px] text-[#4ADE80] flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 bg-[#4ADE80] rounded-full" />
        <span>SEABED BENTHIC (20–50m)</span>
      </div>
    </div>
  );
};
