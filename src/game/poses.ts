import { PoseName } from '../types';

export interface JointPose {
  armL: [number, number, number];
  armR: [number, number, number];
  legL: [number, number, number];
  legR: [number, number, number];
  torso: [number, number, number];
  head: [number, number, number];
  hipLift: number;
}

const base: JointPose = {
  armL: [0, 0, 0.35],
  armR: [0, 0, -0.35],
  legL: [0, 0, 0.06],
  legR: [0, 0, -0.06],
  torso: [0, 0, 0],
  head: [0, 0, 0],
  hipLift: 0,
};

export const POSES: Record<PoseName, JointPose> = {
  idle: { ...base },
  strikeWindup: {
    ...base,
    armR: [-0.9, 0.3, -0.5],
    torso: [0, 0.15, 0.05],
  },
  strikeImpact: {
    ...base,
    armR: [1.4, -0.1, -0.2],
    torso: [0, -0.1, -0.05],
    head: [0.1, 0, 0],
  },
  grappleHold: {
    ...base,
    armL: [1.1, 0, 0.6],
    armR: [1.1, 0, -0.6],
    torso: [0.25, 0, 0],
  },
  grappleSlam: {
    ...base,
    armL: [1.6, 0, 0.3],
    armR: [1.6, 0, -0.3],
    torso: [0.6, 0, 0],
    hipLift: -0.15,
  },
  aerialLaunch: {
    ...base,
    armL: [-1.4, 0, 0.3],
    armR: [-1.4, 0, -0.3],
    legL: [-0.6, 0, 0.06],
    legR: [-0.6, 0, -0.06],
    hipLift: 0.35,
  },
  aerialImpact: {
    ...base,
    armL: [1.2, 0, 0.5],
    armR: [1.2, 0, -0.5],
    torso: [0.5, 0, 0],
    legL: [0.3, 0, 0.06],
    legR: [-0.3, 0, -0.06],
  },
  taunt: {
    ...base,
    armL: [-1.7, 0, 0.5],
    armR: [-1.7, 0, -0.5],
    torso: [-0.1, 0, 0],
    head: [-0.15, 0, 0],
  },
  signature: {
    ...base,
    armL: [-1.5, 0, 0.8],
    armR: [1.7, 0, -0.2],
    torso: [0.3, 0.3, 0.1],
    head: [0.1, 0, 0],
  },
  hitReact: {
    ...base,
    armL: [-0.4, 0, 0.7],
    armR: [-0.4, 0, -0.7],
    torso: [-0.35, 0, 0],
    head: [-0.3, 0, 0],
  },
  blocking: {
    ...base,
    armL: [1.3, 0, 0.15],
    armR: [1.3, 0, -0.15],
    torso: [0.1, 0, 0],
  },
  victory: {
    ...base,
    armL: [-1.8, 0, 0.4],
    armR: [-1.8, 0, -0.4],
    legL: [0, 0, 0.3],
    torso: [-0.05, 0, 0],
  },
  ko: {
    ...base,
    armL: [0.2, 0, 1.2],
    armR: [0.2, 0, -1.2],
    torso: [1.4, 0, 0],
    hipLift: -0.5,
  },
};

export const TRANSIENT_POSE_DURATION_MS: Partial<Record<PoseName, number>> = {
  strikeWindup: 260,
  strikeImpact: 420,
  grappleSlam: 500,
  aerialLaunch: 380,
  aerialImpact: 480,
  hitReact: 500,
  signature: 700,
};
