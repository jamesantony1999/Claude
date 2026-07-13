import React, { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { POSES, TRANSIENT_POSE_DURATION_MS } from './poses';
import { PoseName, WrestlerDefinition } from '../types';

interface Wrestler3DProps {
  wrestler: WrestlerDefinition;
  pose: PoseName;
  position: [number, number, number];
  facing: number; // radians, base Y rotation so wrestlers face each other
}

function lerpTriple(
  current: [number, number, number],
  target: [number, number, number],
  t: number
): [number, number, number] {
  return [
    THREE.MathUtils.lerp(current[0], target[0], t),
    THREE.MathUtils.lerp(current[1], target[1], t),
    THREE.MathUtils.lerp(current[2], target[2], t),
  ];
}

export function Wrestler3D({ wrestler, pose, position, facing }: Wrestler3DProps) {
  const [displayPose, setDisplayPose] = useState<PoseName>('idle');

  const rootRef = useRef<THREE.Group>(null);
  const torsoRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const armLRef = useRef<THREE.Group>(null);
  const armRRef = useRef<THREE.Group>(null);
  const legLRef = useRef<THREE.Group>(null);
  const legRRef = useRef<THREE.Group>(null);
  const hipRef = useRef<THREE.Group>(null);

  const currentJoints = useRef({
    armL: [0, 0, 0.35] as [number, number, number],
    armR: [0, 0, -0.35] as [number, number, number],
    legL: [0, 0, 0.06] as [number, number, number],
    legR: [0, 0, -0.06] as [number, number, number],
    torso: [0, 0, 0] as [number, number, number],
    head: [0, 0, 0] as [number, number, number],
    hipLift: 0,
  });

  const clock = useRef(0);

  useEffect(() => {
    setDisplayPose(pose);
    const duration = TRANSIENT_POSE_DURATION_MS[pose];
    if (duration) {
      const timer = setTimeout(() => setDisplayPose('idle'), duration);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [pose]);

  useFrame((_, delta) => {
    clock.current += delta;
    const target = POSES[displayPose];
    const t = Math.min(1, delta * 8);
    const j = currentJoints.current;
    j.armL = lerpTriple(j.armL, target.armL, t);
    j.armR = lerpTriple(j.armR, target.armR, t);
    j.legL = lerpTriple(j.legL, target.legL, t);
    j.legR = lerpTriple(j.legR, target.legR, t);
    j.torso = lerpTriple(j.torso, target.torso, t);
    j.head = lerpTriple(j.head, target.head, t);
    j.hipLift = THREE.MathUtils.lerp(j.hipLift, target.hipLift, t);

    const idleBob = displayPose === 'idle' ? Math.sin(clock.current * 2.2) * 0.03 : 0;

    if (torsoRef.current) {
      torsoRef.current.rotation.set(j.torso[0], j.torso[1], j.torso[2]);
    }
    if (headRef.current) {
      headRef.current.rotation.set(j.head[0], j.head[1], j.head[2]);
    }
    if (armLRef.current) {
      armLRef.current.rotation.set(j.armL[0], j.armL[1], j.armL[2]);
    }
    if (armRRef.current) {
      armRRef.current.rotation.set(j.armR[0], j.armR[1], j.armR[2]);
    }
    if (legLRef.current) {
      legLRef.current.rotation.set(j.legL[0], j.legL[1], j.legL[2]);
    }
    if (legRRef.current) {
      legRRef.current.rotation.set(j.legR[0], j.legR[1], j.legR[2]);
    }
    if (hipRef.current) {
      hipRef.current.position.y = 1.05 + j.hipLift + idleBob;
    }
    if (rootRef.current) {
      rootRef.current.position.y = position[1];
    }
  });

  const skin = '#e0ab7d';

  return (
    <group ref={rootRef} position={position} rotation={[0, facing, 0]}>
      <group ref={hipRef} position={[0, 1.05, 0]}>
        {/* torso */}
        <group ref={torsoRef} position={[0, 0.32, 0]}>
          <mesh castShadow position={[0, 0.28, 0]}>
            <boxGeometry args={[0.46, 0.56, 0.28]} />
            <meshStandardMaterial color={wrestler.primaryColor} roughness={0.55} />
          </mesh>
          {/* head */}
          <group ref={headRef} position={[0, 0.64, 0]}>
            <mesh castShadow>
              <sphereGeometry args={[0.16, 16, 16]} />
              <meshStandardMaterial color={skin} roughness={0.7} />
            </mesh>
          </group>
          {/* arms */}
          <group ref={armLRef} position={[0.28, 0.42, 0]}>
            <mesh position={[0, -0.26, 0]} castShadow>
              <capsuleGeometry args={[0.08, 0.42, 4, 8]} />
              <meshStandardMaterial color={skin} roughness={0.7} />
            </mesh>
          </group>
          <group ref={armRRef} position={[-0.28, 0.42, 0]}>
            <mesh position={[0, -0.26, 0]} castShadow>
              <capsuleGeometry args={[0.08, 0.42, 4, 8]} />
              <meshStandardMaterial color={skin} roughness={0.7} />
            </mesh>
          </group>
        </group>

        {/* hips block */}
        <mesh position={[0, 0.06, 0]} castShadow>
          <boxGeometry args={[0.4, 0.22, 0.26]} />
          <meshStandardMaterial color={wrestler.secondaryColor} roughness={0.6} />
        </mesh>

        {/* legs */}
        <group ref={legLRef} position={[0.14, -0.06, 0]}>
          <mesh position={[0, -0.38, 0]} castShadow>
            <capsuleGeometry args={[0.1, 0.6, 4, 8]} />
            <meshStandardMaterial color={wrestler.secondaryColor} roughness={0.65} />
          </mesh>
        </group>
        <group ref={legRRef} position={[-0.14, -0.06, 0]}>
          <mesh position={[0, -0.38, 0]} castShadow>
            <capsuleGeometry args={[0.1, 0.6, 4, 8]} />
            <meshStandardMaterial color={wrestler.secondaryColor} roughness={0.65} />
          </mesh>
        </group>

        {/* accent belt */}
        <mesh position={[0, 0.06, 0.14]}>
          <boxGeometry args={[0.42, 0.09, 0.02]} />
          <meshStandardMaterial color={wrestler.accentColor} metalness={0.5} roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
}
