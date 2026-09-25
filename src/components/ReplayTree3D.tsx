import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ReplayTreeProps {
  isDreaming: boolean;
  selectedBranch: number; // 0, 1, 2
}

interface TreeNode {
  id: string;
  pos: [number, number, number];
  branch: number;
  level: number;
}

function TreeScene({
  isDreaming,
  selectedBranch,
}: {
  isDreaming: boolean;
  selectedBranch: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const pulseMeshRef = useRef<THREE.Mesh>(null);

  // Nodes hierarchy: Root (level 0) -> 3 branches (level 1) -> child leaves (level 2)
  const nodes: TreeNode[] = useMemo(() => {
    return [
      { id: 'root', pos: [0, -1.8, 0], branch: 0, level: 0 },
      // Branch 0 (Left)
      { id: 'b0', pos: [-1.8, -0.4, 0], branch: 0, level: 1 },
      { id: 'b0_l0', pos: [-2.5, 1.2, 0.4], branch: 0, level: 2 },
      { id: 'b0_l1', pos: [-1.4, 1.4, -0.3], branch: 0, level: 2 },
      // Branch 1 (Center - Best Path)
      { id: 'b1', pos: [0.1, -0.2, 0.3], branch: 1, level: 1 },
      { id: 'b1_l0', pos: [-0.4, 1.5, 0.2], branch: 1, level: 2 },
      { id: 'b1_l1', pos: [0.6, 1.6, -0.2], branch: 1, level: 2 },
      // Branch 2 (Right)
      { id: 'b2', pos: [1.8, -0.4, -0.2], branch: 2, level: 1 },
      { id: 'b2_l0', pos: [1.3, 1.3, 0.3], branch: 2, level: 2 },
      { id: 'b2_l1', pos: [2.4, 1.2, -0.4], branch: 2, level: 2 },
    ];
  }, []);

  // Tree branch lines
  const lines = useMemo(() => {
    return [
      { from: nodes[0], to: nodes[1], branch: 0 },
      { from: nodes[1], to: nodes[2], branch: 0 },
      { from: nodes[1], to: nodes[3], branch: 0 },

      { from: nodes[0], to: nodes[4], branch: 1 },
      { from: nodes[4], to: nodes[5], branch: 1 },
      { from: nodes[4], to: nodes[6], branch: 1 },

      { from: nodes[0], to: nodes[7], branch: 2 },
      { from: nodes[7], to: nodes[8], branch: 2 },
      { from: nodes[7], to: nodes[9], branch: 2 },
    ];
  }, [nodes]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.4) * 0.25;
    }

    if (pulseMeshRef.current && isDreaming) {
      const t = (state.clock.getElapsedTime() * 2) % 1;
      pulseMeshRef.current.position.y = -1.8 + t * 3.4;
      pulseMeshRef.current.position.x = Math.sin(t * Math.PI) * 0.4;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Tree connecting branch lines */}
      {lines.map((l, idx) => {
        const isOptimal = l.branch === selectedBranch;
        const color = isOptimal ? '#3FF5E6' : '#7A8CA3';
        const geo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(...l.from.pos),
          new THREE.Vector3(...l.to.pos),
        ]);

        return (
          <primitive
            key={idx}
            object={
              new THREE.Line(
                geo,
                new THREE.LineBasicMaterial({
                  color,
                  transparent: true,
                  opacity: isOptimal ? 0.85 : 0.25,
                })
              )
            }
          />
        );
      })}

      {/* Nodes */}
      {nodes.map((node) => {
        const isOptimal = node.branch === selectedBranch || node.id === 'root';
        const nodeColor = isOptimal ? '#3FF5E6' : '#7A8CA3';

        return (
          <mesh key={node.id} position={node.pos}>
            <sphereGeometry args={[node.level === 0 ? 0.18 : 0.12, 16, 16]} />
            <meshStandardMaterial
              color="#07121F"
              emissive={nodeColor}
              emissiveIntensity={isOptimal ? 1.5 : 0.5}
            />
          </mesh>
        );
      })}

      {/* Traveling Dream Replay Pulse */}
      {isDreaming && (
        <mesh ref={pulseMeshRef}>
          <sphereGeometry args={[0.15, 12, 12]} />
          <meshBasicMaterial
            color="#3FF5E6"
            transparent
            opacity={0.9}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
    </group>
  );
}

export const ReplayTree3D: React.FC<ReplayTreeProps> = ({ isDreaming, selectedBranch }) => {
  return (
    <div className="w-full h-[360px] sm:h-[420px] relative select-none">
      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 48, near: 0.1, far: 50 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[3, 4, 3]} intensity={1.2} color="#3FF5E6" />
        <TreeScene isDreaming={isDreaming} selectedBranch={selectedBranch} />
      </Canvas>

      <div className="absolute top-3 left-3 font-mono text-[9px] text-[#3FF5E6] flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 bg-[#3FF5E6] rounded-full animate-pulse" />
        <span>REASONING GRAPH REPLAY TREE</span>
      </div>
    </div>
  );
};
