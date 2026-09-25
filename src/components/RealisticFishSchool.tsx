import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';

// Preload 3D fish assets
useGLTF.preload('/models/Koi_01.glb');
useGLTF.preload('/models/Koi_02.glb');
useGLTF.preload('/models/Koi_03.glb');
useGLTF.preload('/models/Koi_05.glb');

export interface FishState {
  id: number;
  model: string;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  target: THREE.Vector3;
  wanderAngle: number;
  scale: number;
  speed: number;
  fastUntil: number;
  turnSpeed: number;
}

interface SingleFishProps {
  fish: FishState;
  timeScale: number;
  mouseWorldRef: React.MutableRefObject<THREE.Vector3>;
  onFishClick?: (fish: FishState) => void;
  interactive?: boolean;
}

export const SingleFish: React.FC<SingleFishProps> = ({
  fish,
  timeScale,
  mouseWorldRef,
  onFishClick,
  interactive = true,
}) => {
  const { scene, animations } = useGLTF(`/models/${fish.model}.glb`);
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const groupRef = useRef<THREE.Group>(null);
  const { actions } = useAnimations(animations, groupRef);

  // Configure materials for realistic underwater deep-ocean aesthetic
  useEffect(() => {
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (mesh.material) {
          const mat = (mesh.material as THREE.MeshStandardMaterial).clone();
          mat.roughness = 0.35;
          mat.metalness = 0.2;
          // Subtle ocean depth iridescent tint
          mat.emissive = new THREE.Color('#3FF5E6');
          mat.emissiveIntensity = 0.08;
          mesh.material = mat;
        }
      }
    });
  }, [clone]);

  // Handle animation state with timing
  useEffect(() => {
    const normalAction =
      actions['Fish_Armature|Swimming_Normal'] ||
      actions['Swimming_Normal'] ||
      actions[Object.keys(actions)[0]];

    const fastAction =
      actions['Fish_Armature|Swimming_Fast'] ||
      actions['Swimming_Fast'] ||
      actions['Fish_Armature|Swimming_Impulse'];

    if (normalAction) {
      normalAction.timeScale = 1.0 * timeScale;
      normalAction.play();
    }

    return () => {
      normalAction?.stop();
      fastAction?.stop();
    };
  }, [actions, timeScale]);

  // Per-frame boid kinematics and spatial orientation
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const effectiveDelta = Math.min(delta, 0.1) * timeScale;
    const now = state.clock.getElapsedTime();

    // Check if darting
    const isDarting = fish.fastUntil > now;
    const fastAction =
      actions['Fish_Armature|Swimming_Fast'] ||
      actions['Fish_Armature|Swimming_Impulse'];
    const normalAction =
      actions['Fish_Armature|Swimming_Normal'] ||
      actions[Object.keys(actions)[0]];

    if (fastAction && normalAction) {
      if (isDarting && !fastAction.isRunning()) {
        normalAction.fadeOut(0.2);
        fastAction.reset().fadeIn(0.2).play();
        fastAction.timeScale = 1.8 * timeScale;
      } else if (!isDarting && fastAction.isRunning()) {
        fastAction.fadeOut(0.3);
        normalAction.reset().fadeIn(0.3).play();
        normalAction.timeScale = 1.0 * timeScale;
      }
    }

    // Interactive mouse reaction: swim toward or avoid pointer
    if (interactive && mouseWorldRef.current) {
      const mouseDist = fish.position.distanceTo(mouseWorldRef.current);
      if (mouseDist < 4.5 && mouseDist > 0.1) {
        // Gentle avoidance impulse
        const avoidDir = new THREE.Vector3()
          .subVectors(fish.position, mouseWorldRef.current)
          .normalize();
        fish.velocity.add(avoidDir.multiplyScalar(0.4 * effectiveDelta));
      }
    }

    // Wander and natural heading adjustment
    fish.wanderAngle += (Math.random() - 0.5) * 0.15;
    const wanderForce = new THREE.Vector3(
      Math.sin(fish.wanderAngle) * 0.8,
      Math.cos(fish.wanderAngle * 1.3) * 0.4,
      Math.sin(fish.wanderAngle * 0.7) * 0.5
    );
    fish.velocity.add(wanderForce.multiplyScalar(effectiveDelta));

    // Cap velocity
    const maxSpeed = (isDarting ? fish.speed * 2.2 : fish.speed) * (0.8 + Math.sin(now * 2 + fish.id) * 0.2);
    if (fish.velocity.length() > maxSpeed) {
      fish.velocity.setLength(maxSpeed);
    }
    if (fish.velocity.length() < 0.2) {
      fish.velocity.setLength(0.2);
    }

    // Update position
    fish.position.addScaledVector(fish.velocity, effectiveDelta * 2.5);

    // Soft bounds steering
    const bX = 14;
    const bY = 9;
    const bZ = 7;
    if (Math.abs(fish.position.x) > bX) {
      fish.velocity.x += (fish.position.x > 0 ? -1 : 1) * 2.0 * effectiveDelta;
    }
    if (Math.abs(fish.position.y) > bY) {
      fish.velocity.y += (fish.position.y > 0 ? -1 : 1) * 1.5 * effectiveDelta;
    }
    if (Math.abs(fish.position.z) > bZ) {
      fish.velocity.z += (fish.position.z > 0 ? -1 : 1) * 1.5 * effectiveDelta;
    }

    // Slerp rotation to face velocity vector
    groupRef.current.position.copy(fish.position);
    if (fish.velocity.lengthSq() > 0.001) {
      const lookTarget = fish.position.clone().add(fish.velocity);
      const dummy = new THREE.Object3D();
      dummy.position.copy(fish.position);
      dummy.lookAt(lookTarget);

      // Model points along Z or X axis depending on model; Koi models face +X, so rotate Y by -PI/2
      dummy.rotateY(-Math.PI / 2);

      // Natural banking into turns
      const bankAngle = THREE.MathUtils.clamp(-fish.velocity.x * 0.25, -0.4, 0.4);
      dummy.rotateZ(bankAngle);

      groupRef.current.quaternion.slerp(dummy.quaternion, 0.08);
    }
  });

  return (
    <group
      ref={groupRef}
      scale={fish.scale}
      onClick={(e) => {
        e.stopPropagation();
        if (onFishClick) onFishClick(fish);
      }}
    >
      <primitive object={clone} />
    </group>
  );
};

interface RealisticFishSchoolProps {
  count?: number;
  timeScale?: number;
  interactive?: boolean;
  onSelectFish?: (fish: FishState) => void;
  pulseTrigger?: number;
  models?: string[];
  depthOffset?: number;
}

export const RealisticFishSchool: React.FC<RealisticFishSchoolProps> = ({
  count = 6,
  timeScale = 1.0,
  interactive = true,
  onSelectFish,
  pulseTrigger = 0,
  models = ['Koi_01', 'Koi_02', 'Koi_03', 'Koi_05'],
  depthOffset = 0,
}) => {
  const mouseWorldRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));

  // Initialize fish states
  const fishes = useMemo(() => {
    const list: FishState[] = [];
    for (let i = 0; i < count; i++) {
      const model = models[i % models.length];
      const initialPos = new THREE.Vector3(
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 10 - depthOffset,
        (Math.random() - 0.5) * 8 - 1
      );
      const initialVel = new THREE.Vector3(
        (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.5) * 0.8,
        (Math.random() - 0.5) * 0.8
      ).normalize().multiplyScalar(1.2 + Math.random() * 0.8);

      list.push({
        id: i + 1,
        model,
        position: initialPos,
        velocity: initialVel,
        target: new THREE.Vector3(),
        wanderAngle: Math.random() * Math.PI * 2,
        scale: 0.38 + (i % 3) * 0.12,
        speed: 1.1 + Math.random() * 0.7,
        fastUntil: 0,
        turnSpeed: 0.08,
      });
    }
    return list;
  }, [count, models, depthOffset]);

  // Trigger darting behavior on pulse
  useEffect(() => {
    if (pulseTrigger > 0) {
      const now = performance.now() / 1000;
      fishes.forEach((f) => {
        f.fastUntil = now + 1.8 + Math.random() * 1.2;
        // Impulse burst in forward direction
        f.velocity.multiplyScalar(2.2);
      });
    }
  }, [pulseTrigger, fishes]);

  // Update mouse world position projection
  useFrame((state) => {
    if (!interactive) return;
    const { pointer, camera } = state;
    // Unproject pointer to z = 0 plane
    const vec = new THREE.Vector3(pointer.x, pointer.y, 0.5);
    vec.unproject(camera);
    const dir = vec.sub(camera.position).normalize();
    const distance = -camera.position.z / dir.z;
    const pos = camera.position.clone().add(dir.multiplyScalar(distance));
    mouseWorldRef.current.copy(pos);
  });

  return (
    <group>
      {/* Underwater depth lighting */}
      <ambientLight intensity={0.8} color="#0D3B66" />
      <directionalLight position={[5, 12, 8]} intensity={1.4} color="#3FF5E6" />
      <pointLight position={[0, -4, 4]} intensity={0.9} color="#4ADE80" distance={20} />

      {fishes.map((fish) => (
        <SingleFish
          key={fish.id}
          fish={fish}
          timeScale={timeScale}
          mouseWorldRef={mouseWorldRef}
          onFishClick={onSelectFish}
          interactive={interactive}
        />
      ))}
    </group>
  );
};
