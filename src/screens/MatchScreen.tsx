import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useGameStore } from '../state/gameStore';
import { getWrestler } from '../data/wrestlers';
import { MatchScene } from '../game/MatchScene';
import { StatBar } from '../components/StatBar';
import { MoveButton } from '../components/MoveButton';
import { CommentaryFeed } from '../components/CommentaryFeed';
import { ResultScreen } from './ResultScreen';

export function MatchScreen({ onExit }: { onExit: () => void }) {
  const {
    player,
    opponent,
    playerWrestlerId,
    opponentWrestlerId,
    phase,
    log,
    pinCount,
    roundActive,
    performPlayerMove,
    availableMoves,
    playerSignature,
    attemptPin,
  } = useGameStore();

  if (!player || !opponent || !playerWrestlerId || !opponentWrestlerId) {
    return null;
  }

  const playerDef = getWrestler(playerWrestlerId);
  const opponentDef = getWrestler(opponentWrestlerId);
  const moves = availableMoves();
  const signature = playerSignature();
  const canSignature = player.momentum >= 100 && player.stamina >= signature.staminaCost;

  const handleMove = (move: typeof moves[number]) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    performPlayerMove(move);
  };

  if (phase === 'victory' || phase === 'defeat') {
    return (
      <ResultScreen
        won={phase === 'victory'}
        playerName={playerDef.name}
        opponentName={opponentDef.name}
        onRematch={onExit}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.hud}>
        <View style={styles.fighterHud}>
          <Text style={styles.fighterName}>{playerDef.name}</Text>
          <StatBar label="HP" value={player.health} max={player.maxHealth} color="#e74c3c" />
          <StatBar label="STAMINA" value={player.stamina} max={player.maxStamina} color="#2ecc71" />
          <StatBar label="MOMENTUM" value={player.momentum} max={100} color="#ffd23f" />
        </View>
        <Text style={styles.vs}>VS</Text>
        <View style={styles.fighterHud}>
          <Text style={[styles.fighterName, { textAlign: 'right' }]}>{opponentDef.name}</Text>
          <StatBar label="HP" value={opponent.health} max={opponent.maxHealth} color="#e74c3c" />
          <StatBar label="STAMINA" value={opponent.stamina} max={opponent.maxStamina} color="#2ecc71" />
          <StatBar label="MOMENTUM" value={opponent.momentum} max={100} color="#ffd23f" />
        </View>
      </View>

      <View style={styles.sceneWrap}>
        <MatchScene
          playerWrestler={playerDef}
          opponentWrestler={opponentDef}
          playerPose={player.pose}
          opponentPose={opponent.pose}
        />
      </View>

      <View style={styles.lowerPanel}>
        <CommentaryFeed log={log} />

        {phase === 'pinAttempt' ? (
          <View style={styles.pinPanel}>
            <Text style={styles.pinText}>PIN ATTEMPT — {pinCount} / 3</Text>
            <Pressable style={styles.pinButton} onPress={attemptPin}>
              <Text style={styles.pinButtonText}>COVER!</Text>
            </Pressable>
          </View>
        ) : (
          <ScrollView style={styles.movesList} showsVerticalScrollIndicator={false}>
            {canSignature && (
              <MoveButton
                move={signature}
                disabled={roundActive || phase !== 'selecting'}
                onPress={() => handleMove(signature)}
              />
            )}
            {moves.map((move) => (
              <MoveButton
                key={move.id}
                move={move}
                disabled={roundActive || phase !== 'selecting' || move.staminaCost > player.stamina}
                onPress={() => handleMove(move)}
              />
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a14' },
  hud: {
    flexDirection: 'row',
    paddingTop: 50,
    paddingHorizontal: 14,
    gap: 12,
  },
  fighterHud: { flex: 1, gap: 4 },
  fighterName: { color: '#fff', fontWeight: '800', fontSize: 13, marginBottom: 2 },
  vs: { color: '#4c4c63', fontWeight: '900', alignSelf: 'center', fontSize: 12 },
  sceneWrap: { flex: 1.1 },
  lowerPanel: { flex: 1, paddingHorizontal: 14, paddingBottom: 20, gap: 8 },
  movesList: { flex: 1, marginTop: 4 },
  pinPanel: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  pinText: { color: '#ffd23f', fontWeight: '800', fontSize: 16, letterSpacing: 1 },
  pinButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 18,
    paddingHorizontal: 48,
    borderRadius: 30,
  },
  pinButtonText: { color: '#fff', fontWeight: '900', fontSize: 18, letterSpacing: 1 },
});
