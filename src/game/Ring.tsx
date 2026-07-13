import React from 'react';

const RING_HALF = 2.6;
const POST_HEIGHT = 1.3;
const ROPE_HEIGHTS = [0.35, 0.7, 1.05];

const corners: [number, number][] = [
  [-RING_HALF, -RING_HALF],
  [RING_HALF, -RING_HALF],
  [RING_HALF, RING_HALF],
  [-RING_HALF, RING_HALF],
];

export function Ring() {
  return (
    <group>
      {/* apron skirt */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[RING_HALF * 2 + 0.4, 0.3, RING_HALF * 2 + 0.4]} />
        <meshStandardMaterial color="#1b1f3b" roughness={0.8} />
      </mesh>

      {/* mat */}
      <mesh position={[0, 0.32, 0]} receiveShadow>
        <boxGeometry args={[RING_HALF * 2, 0.06, RING_HALF * 2]} />
        <meshStandardMaterial color="#e8e8f0" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.356, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.0, 1.15, 3]} />
        <meshStandardMaterial color="#ff3d6e" />
      </mesh>

      {/* turnbuckles */}
      {corners.map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, POST_HEIGHT / 2 + 0.32, 0]} castShadow>
            <cylinderGeometry args={[0.09, 0.09, POST_HEIGHT, 12]} />
            <meshStandardMaterial color="#c0c5d6" metalness={0.4} roughness={0.4} />
          </mesh>
          <mesh position={[0, POST_HEIGHT + 0.32, 0]}>
            <sphereGeometry args={[0.13, 12, 12]} />
            <meshStandardMaterial color="#ff3d6e" />
          </mesh>
        </group>
      ))}

      {/* ropes */}
      {ROPE_HEIGHTS.map((h, i) => (
        <group key={i} position={[0, h + 0.32, 0]}>
          <mesh position={[0, 0, -RING_HALF]}>
            <boxGeometry args={[RING_HALF * 2, 0.035, 0.035]} />
            <meshStandardMaterial color={i === 1 ? '#f7f7ff' : '#dedeea'} />
          </mesh>
          <mesh position={[0, 0, RING_HALF]}>
            <boxGeometry args={[RING_HALF * 2, 0.035, 0.035]} />
            <meshStandardMaterial color={i === 1 ? '#f7f7ff' : '#dedeea'} />
          </mesh>
          <mesh position={[-RING_HALF, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[RING_HALF * 2, 0.035, 0.035]} />
            <meshStandardMaterial color={i === 1 ? '#f7f7ff' : '#dedeea'} />
          </mesh>
          <mesh position={[RING_HALF, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[RING_HALF * 2, 0.035, 0.035]} />
            <meshStandardMaterial color={i === 1 ? '#f7f7ff' : '#dedeea'} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export const RING_HALF_SIZE = RING_HALF;
