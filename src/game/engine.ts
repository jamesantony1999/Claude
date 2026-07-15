import { MoveDefinition, WrestlerDefinition, FighterMatchState } from '../types';

export function initFighterState(wrestler: WrestlerDefinition): FighterMatchState {
  const maxHealth = 100;
  const maxStamina = 50 + wrestler.stats.stamina * 5;
  return {
    wrestlerId: wrestler.id,
    health: maxHealth,
    maxHealth,
    stamina: maxStamina,
    maxStamina,
    momentum: 0,
    pose: 'idle',
  };
}

export interface MoveOutcome {
  damage: number;
  reversed: boolean;
  critical: boolean;
  momentumGainAttacker: number;
  momentumGainDefender: number;
}

/**
 * Resolves one move: attacker's power/technique vs defender's speed/technique
 * determine reversal odds; otherwise damage scales with attacker power stat.
 */
export function resolveMove(
  move: MoveDefinition,
  attacker: WrestlerDefinition,
  defender: WrestlerDefinition,
  attackerMomentum: number
): MoveOutcome {
  const defenderReversalSkill = defender.stats.speed * 0.6 + defender.stats.technique * 0.4;
  const attackerControlSkill = attacker.stats.technique * 0.7;
  const baseReversalChance = Math.max(
    0,
    move.reversalChance + defenderReversalSkill * 0.015 - attackerControlSkill * 0.01
  );
  const reversed = move.category !== 'taunt' && Math.random() < baseReversalChance;

  if (reversed) {
    return {
      damage: 0,
      reversed: true,
      critical: false,
      momentumGainAttacker: 0,
      momentumGainDefender: Math.round(move.momentumGain * 0.8),
    };
  }

  const powerMultiplier = 0.7 + (attacker.stats.power / 10) * 0.6;
  const momentumMultiplier = 1 + attackerMomentum / 200;
  const critical = Math.random() < 0.12 + attacker.stats.power * 0.01;
  const rawDamage =
    (move.minDamage + Math.random() * (move.maxDamage - move.minDamage)) *
    powerMultiplier *
    momentumMultiplier *
    (critical ? 1.5 : 1);

  return {
    damage: Math.round(rawDamage),
    reversed: false,
    critical,
    momentumGainAttacker: move.momentumGain,
    momentumGainDefender: 0,
  };
}

export function regenerateStamina(current: number, max: number, technique: number): number {
  const regen = 6 + technique * 0.4;
  return Math.min(max, Math.round(current + regen));
}

/** Simple AI heuristic: prefers cheap moves when low on stamina, presses
 * advantage with signature when momentum is full, otherwise favors higher
 * expected value moves weighted by wrestler stats. */
export function chooseAIMove(
  available: MoveDefinition[],
  aiState: FighterMatchState,
  opponentState: FighterMatchState,
  signature: MoveDefinition
): MoveDefinition {
  if (aiState.momentum >= 100 && aiState.stamina >= signature.staminaCost) {
    return signature;
  }

  const affordable = available.filter((m) => m.staminaCost <= aiState.stamina);
  const pool = affordable.length > 0 ? affordable : [available[0]];

  if (opponentState.health < 20) {
    const heaviest = [...pool].sort((a, b) => b.maxDamage - a.maxDamage)[0];
    return heaviest;
  }

  if (aiState.stamina < 15) {
    const cheapest = [...pool].sort((a, b) => a.staminaCost - b.staminaCost)[0];
    return cheapest;
  }

  const weighted = pool.flatMap((m) => Array(Math.max(1, Math.round(m.maxDamage / 3))).fill(m));
  return weighted[Math.floor(Math.random() * weighted.length)];
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
