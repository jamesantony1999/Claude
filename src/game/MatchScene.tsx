import React from 'react';
import { Canvas } from '@react-three/fiber';
import { ArenaLighting, ArenaFloor } from './Arena';
import { Ring } from './Ring';
import { Wrestler3D } from './Wrestler3D';
import { WrestlerDefinition, PoseName } from '../types';

interface MatchSceneProps {
  playerWrestler: WrestlerDefinition;
  opponentWrestler: WrestlerDefinition;
  playerPose: PoseName;
  opponentPose: PoseName;
}

export function MatchScene({ playerWrestler, opponentWrestler, playerPose, opponentPose }: MatchSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 2.6, 5.4], fov: 45 }}
      gl={{ antialias: true }}
      onCreated={({ scene }) => {
        scene.background = null;
      }}
    >
      <ArenaLighting />
      <ArenaFloor />
      <Ring />
      <Wrestler3D
        wrestler={playerWrestler}
        pose={playerPose}
        position={[-0.9, 0, 0.6]}
        facing={Math.PI * 0.15}
      />
      <Wrestler3D
        wrestler={opponentWrestler}
        pose={opponentPose}
        position={[0.9, 0, -0.6]}
        facing={-Math.PI * 0.85}
      />
    </Canvas>
  );
}
