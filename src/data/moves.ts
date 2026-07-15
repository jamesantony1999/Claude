import { MoveDefinition } from '../types';

export const MOVES: Record<string, MoveDefinition> = {
  jab: {
    id: 'jab',
    name: 'Quick Jab',
    category: 'strike',
    staminaCost: 8,
    minDamage: 3,
    maxDamage: 7,
    momentumGain: 6,
    reversalChance: 0.1,
    pose: 'strikeImpact',
    description: 'A fast strike with low risk and low reward.',
  },
  haymaker: {
    id: 'haymaker',
    name: 'Haymaker',
    category: 'strike',
    staminaCost: 16,
    minDamage: 8,
    maxDamage: 14,
    momentumGain: 10,
    reversalChance: 0.25,
    pose: 'strikeImpact',
    description: 'A heavy swing that can be countered if telegraphed.',
  },
  suplex: {
    id: 'suplex',
    name: 'Vertical Suplex',
    category: 'grapple',
    staminaCost: 20,
    minDamage: 10,
    maxDamage: 16,
    momentumGain: 14,
    reversalChance: 0.3,
    pose: 'grappleSlam',
    description: 'Lift and drive the opponent into the mat.',
  },
  backbreaker: {
    id: 'backbreaker',
    name: 'Backbreaker',
    category: 'grapple',
    staminaCost: 18,
    minDamage: 9,
    maxDamage: 15,
    momentumGain: 12,
    reversalChance: 0.28,
    pose: 'grappleHold',
    description: 'Bend the opponent over your knee.',
  },
  diveBomb: {
    id: 'diveBomb',
    name: 'Dive Bomb',
    category: 'aerial',
    staminaCost: 22,
    minDamage: 12,
    maxDamage: 20,
    momentumGain: 16,
    reversalChance: 0.4,
    pose: 'aerialImpact',
    description: 'A high-risk leap from the top rope.',
  },
  taunt: {
    id: 'taunt',
    name: 'Hype the Crowd',
    category: 'taunt',
    staminaCost: 0,
    minDamage: 0,
    maxDamage: 0,
    momentumGain: 18,
    reversalChance: 0,
    pose: 'taunt',
    description: 'Build momentum at the cost of a free turn for your opponent.',
  },
};

export const SIGNATURE_MOVE_TEMPLATE: Omit<MoveDefinition, 'id' | 'name'> = {
  category: 'signature',
  staminaCost: 30,
  minDamage: 22,
  maxDamage: 34,
  momentumGain: 0,
  reversalChance: 0.15,
  pose: 'signature',
  description: 'A devastating finishing maneuver.',
};

export function buildSignatureMove(wrestlerId: string, signatureName: string): MoveDefinition {
  return {
    ...SIGNATURE_MOVE_TEMPLATE,
    id: `signature-${wrestlerId}`,
    name: signatureName,
  };
}

export function movesForCategory(categories: string[]): MoveDefinition[] {
  return Object.values(MOVES).filter((m) => categories.includes(m.category));
}
