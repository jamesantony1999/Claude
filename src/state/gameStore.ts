import { create } from 'zustand';
import { getWrestler } from '../data/wrestlers';
import { MOVES, buildSignatureMove, movesForCategory } from '../data/moves';
import {
  FighterId,
  FighterMatchState,
  LogEntry,
  MatchPhase,
  MoveDefinition,
  PoseName,
} from '../types';
import { chooseAIMove, clamp, initFighterState, regenerateStamina, resolveMove } from '../game/engine';

let logCounter = 0;
function nextLogId(): string {
  logCounter += 1;
  return `log-${logCounter}`;
}

interface GameState {
  playerWrestlerId: string | null;
  opponentWrestlerId: string | null;
  player: FighterMatchState | null;
  opponent: FighterMatchState | null;
  phase: MatchPhase;
  log: LogEntry[];
  winner: FighterId | null;
  pinCount: number;
  roundActive: boolean;

  selectPlayerWrestler: (id: string) => void;
  selectOpponentWrestler: (id: string) => void;
  startMatch: () => void;
  availableMoves: () => MoveDefinition[];
  playerSignature: () => MoveDefinition;
  opponentSignature: () => MoveDefinition;
  performPlayerMove: (move: MoveDefinition) => void;
  runOpponentTurn: () => void;
  beginPinAttempt: () => void;
  attemptPin: () => void;
  opponentKicksOut: () => void;
  resetMatch: () => void;
  setPose: (fighter: FighterId, pose: PoseName) => void;
}

function pushLog(state: GameState, text: string, tone: LogEntry['tone'] = 'neutral'): LogEntry[] {
  const entry: LogEntry = { id: nextLogId(), text, tone };
  return [...state.log.slice(-6), entry];
}

export const useGameStore = create<GameState>((set, get) => ({
  playerWrestlerId: null,
  opponentWrestlerId: null,
  player: null,
  opponent: null,
  phase: 'intro',
  log: [],
  winner: null,
  pinCount: 0,
  roundActive: false,

  selectPlayerWrestler: (id) => set({ playerWrestlerId: id }),
  selectOpponentWrestler: (id) => set({ opponentWrestlerId: id }),

  startMatch: () => {
    const { playerWrestlerId, opponentWrestlerId } = get();
    if (!playerWrestlerId || !opponentWrestlerId) return;
    const playerDef = getWrestler(playerWrestlerId);
    const opponentDef = getWrestler(opponentWrestlerId);
    set({
      player: initFighterState(playerDef),
      opponent: initFighterState(opponentDef),
      phase: 'selecting',
      winner: null,
      pinCount: 0,
      roundActive: false,
      log: [
        {
          id: nextLogId(),
          text: `${playerDef.name} and ${opponentDef.name} lock eyes across the ring!`,
          tone: 'neutral',
        },
      ],
    });
  },

  availableMoves: () => {
    const { playerWrestlerId } = get();
    if (!playerWrestlerId) return [];
    const wrestler = getWrestler(playerWrestlerId);
    return movesForCategory(wrestler.moveset.filter((c) => c !== 'signature'));
  },

  playerSignature: () => {
    const { playerWrestlerId } = get();
    const wrestler = getWrestler(playerWrestlerId!);
    return buildSignatureMove(wrestler.id, wrestler.signatureMove);
  },

  opponentSignature: () => {
    const { opponentWrestlerId } = get();
    const wrestler = getWrestler(opponentWrestlerId!);
    return buildSignatureMove(wrestler.id, wrestler.signatureMove);
  },

  setPose: (fighter, pose) => {
    set((state) => {
      const key = fighter === 'player' ? 'player' : 'opponent';
      const current = state[key];
      if (!current) return {};
      return { [key]: { ...current, pose } } as Partial<GameState>;
    });
  },

  performPlayerMove: (move) => {
    const state = get();
    if (!state.player || !state.opponent || !state.playerWrestlerId || !state.opponentWrestlerId) return;
    if (state.roundActive || state.phase !== 'selecting') return;
    if (move.staminaCost > state.player.stamina) return;

    const playerDef = getWrestler(state.playerWrestlerId);
    const opponentDef = getWrestler(state.opponentWrestlerId);
    const outcome = resolveMove(move, playerDef, opponentDef, state.player.momentum);

    const newOpponentHealth = clamp(state.opponent.health - outcome.damage, 0, state.opponent.maxHealth);
    const newPlayerStamina = clamp(state.player.stamina - move.staminaCost, 0, state.player.maxStamina);
    const newPlayerMomentum =
      move.category === 'signature'
        ? 0
        : clamp(state.player.momentum + outcome.momentumGainAttacker, 0, 100);
    const newOpponentMomentum = clamp(state.opponent.momentum + outcome.momentumGainDefender, 0, 100);
    const regeneratedOpponentStamina = regenerateStamina(
      state.opponent.stamina,
      state.opponent.maxStamina,
      opponentDef.stats.technique
    );

    let logText: string;
    let tone: LogEntry['tone'] = 'neutral';
    if (outcome.reversed) {
      logText = `${opponentDef.name} reverses ${playerDef.name}'s ${move.name}!`;
      tone = 'bad';
    } else if (outcome.critical) {
      logText = `CRITICAL! ${playerDef.name} lands a devastating ${move.name} for ${outcome.damage} damage!`;
      tone = 'critical';
    } else {
      logText = `${playerDef.name} hits ${move.name} for ${outcome.damage} damage.`;
      tone = 'good';
    }

    set((s) => ({
      opponent: {
        ...s.opponent!,
        health: newOpponentHealth,
        momentum: newOpponentMomentum,
        stamina: regeneratedOpponentStamina,
      },
      player: {
        ...s.player!,
        stamina: newPlayerStamina,
        momentum: newPlayerMomentum,
        pose: outcome.reversed ? 'hitReact' : move.pose,
      },
      log: pushLog(s, logText, tone),
      roundActive: true,
    }));

    if (outcome.reversed) {
      set((s) => ({ opponent: { ...s.opponent!, pose: move.pose } }));
    }

    if (newOpponentHealth <= 0) {
      set((s) => ({
        log: pushLog(s, `${opponentDef.name} is down! ${playerDef.name} goes for the cover!`, 'critical'),
      }));
      setTimeout(() => get().beginPinAttempt(), 900);
      return;
    }

    setTimeout(() => get().runOpponentTurn(), 1100);
  },

  runOpponentTurn: () => {
    const state = get();
    if (!state.player || !state.opponent || !state.playerWrestlerId || !state.opponentWrestlerId) return;
    if (state.phase !== 'selecting') return;

    const playerDef = getWrestler(state.playerWrestlerId);
    const opponentDef = getWrestler(state.opponentWrestlerId);
    const signature = get().opponentSignature();
    const pool = movesForCategory(opponentDef.moveset.filter((c) => c !== 'signature'));
    const move = chooseAIMove(pool, state.opponent, state.player, signature);
    const outcome = resolveMove(move, opponentDef, playerDef, state.opponent.momentum);

    const newPlayerHealth = clamp(state.player.health - outcome.damage, 0, state.player.maxHealth);
    const newOpponentStaminaAfterMove = clamp(
      state.opponent.stamina - move.staminaCost,
      0,
      state.opponent.maxStamina
    );
    const newOpponentMomentum =
      move.category === 'signature'
        ? 0
        : clamp(state.opponent.momentum + outcome.momentumGainAttacker, 0, 100);
    const newPlayerMomentum = clamp(state.player.momentum + outcome.momentumGainDefender, 0, 100);

    let logText: string;
    let tone: LogEntry['tone'] = 'neutral';
    if (outcome.reversed) {
      logText = `${playerDef.name} reverses ${opponentDef.name}'s ${move.name}!`;
      tone = 'good';
    } else if (outcome.critical) {
      logText = `CRITICAL! ${opponentDef.name} nails a brutal ${move.name} for ${outcome.damage} damage!`;
      tone = 'critical';
    } else {
      logText = `${opponentDef.name} counters with ${move.name} for ${outcome.damage} damage.`;
      tone = 'bad';
    }

    const regeneratedPlayerStamina = regenerateStamina(
      state.player.stamina,
      state.player.maxStamina,
      playerDef.stats.technique
    );

    set((s) => ({
      player: {
        ...s.player!,
        health: newPlayerHealth,
        stamina: regeneratedPlayerStamina,
        momentum: newPlayerMomentum,
        pose: outcome.reversed ? move.pose : 'hitReact',
      },
      opponent: {
        ...s.opponent!,
        stamina: newOpponentStaminaAfterMove,
        momentum: newOpponentMomentum,
        pose: outcome.reversed ? 'hitReact' : move.pose,
      },
      log: pushLog(s, logText, tone),
      roundActive: false,
    }));

    if (newPlayerHealth <= 0) {
      set({ phase: 'defeat', winner: 'opponent' });
      return;
    }
  },

  beginPinAttempt: () => {
    set({ phase: 'pinAttempt', pinCount: 0 });
  },

  attemptPin: () => {
    const state = get();
    if (state.phase !== 'pinAttempt' || !state.opponent) return;
    const nextCount = state.pinCount + 1;

    if (nextCount >= 3) {
      set({ phase: 'victory', winner: 'player', pinCount: 3 });
      return;
    }

    const kickOutChance = clamp(0.15 + state.opponent.stamina / state.opponent.maxStamina / 2, 0, 0.8);
    if (Math.random() < kickOutChance * 0.35) {
      get().opponentKicksOut();
      return;
    }

    set({ pinCount: nextCount });
  },

  opponentKicksOut: () => {
    const state = get();
    if (!state.opponent || !state.opponentWrestlerId) return;
    const opponentDef = getWrestler(state.opponentWrestlerId);
    set((s) => ({
      phase: 'selecting',
      pinCount: 0,
      opponent: { ...s.opponent!, health: clamp(s.opponent!.health + 12, 1, s.opponent!.maxHealth), pose: 'idle' },
      log: pushLog(s, `${opponentDef.name} kicks out! The match continues!`, 'bad'),
    }));
    setTimeout(() => get().runOpponentTurn(), 900);
  },

  resetMatch: () => {
    set({
      playerWrestlerId: null,
      opponentWrestlerId: null,
      player: null,
      opponent: null,
      phase: 'intro',
      log: [],
      winner: null,
      pinCount: 0,
      roundActive: false,
    });
  },
}));
