export type MoveCategory = 'strike' | 'grapple' | 'aerial' | 'taunt' | 'signature';

export interface MoveDefinition {
  id: string;
  name: string;
  category: MoveCategory;
  staminaCost: number;
  minDamage: number;
  maxDamage: number;
  momentumGain: number;
  reversalChance: number; // chance the opponent reverses this move (0-1)
  pose: PoseName;
  description: string;
}

export type PoseName =
  | 'idle'
  | 'strikeWindup'
  | 'strikeImpact'
  | 'grappleHold'
  | 'grappleSlam'
  | 'aerialLaunch'
  | 'aerialImpact'
  | 'taunt'
  | 'signature'
  | 'hitReact'
  | 'blocking'
  | 'victory'
  | 'ko';

export interface WrestlerStats {
  power: number; // affects damage dealt
  speed: number; // affects reversal/dodge chance
  technique: number; // affects reversal success & stamina efficiency
  stamina: number; // max stamina pool
}

export interface WrestlerDefinition {
  id: string;
  name: string;
  gimmick: string;
  tagline: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  stats: WrestlerStats;
  signatureMove: string;
  moveset: MoveCategory[];
}

export type FighterId = 'player' | 'opponent';

export interface FighterMatchState {
  wrestlerId: string;
  health: number;
  maxHealth: number;
  stamina: number;
  maxStamina: number;
  momentum: number; // 0-100, at 100 signature move unlocked
  pose: PoseName;
  lastMove?: MoveDefinition;
}

export type MatchPhase =
  | 'intro'
  | 'selecting'
  | 'resolving'
  | 'pinAttempt'
  | 'victory'
  | 'defeat';

export interface LogEntry {
  id: string;
  text: string;
  tone: 'neutral' | 'good' | 'bad' | 'critical';
}
