import React from 'react';

export function ArenaLighting() {
  return (
    <>
      <ambientLight intensity={0.55} color="#8891ff" />
      <directionalLight position={[3, 8, 4]} intensity={1.4} color="#ffffff" castShadow />
      <pointLight position={[-4, 5, -3]} intensity={0.6} color="#ff5fa2" />
      <pointLight position={[4, 5, -3]} intensity={0.6} color="#3fd1ff" />
      <fog attach="fog" args={['#0a0a14', 8, 22]} />
    </>
  );
}

export function ArenaFloor() {
  return (
    <group>
      <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[12, 32]} />
        <meshStandardMaterial color="#141420" roughness={0.9} />
      </mesh>
      {Array.from({ length: 3 }).map((_, ring) => (
        <mesh
          key={ring}
          position={[0, -0.015, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[3.2 + ring * 1.6, 3.3 + ring * 1.6, 48]} />
          <meshBasicMaterial color="#2b2b45" transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}
