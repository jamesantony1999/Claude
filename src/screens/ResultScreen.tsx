import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface ResultScreenProps {
  won: boolean;
  playerName: string;
  opponentName: string;
  onRematch: () => void;
}

export function ResultScreen({ won, playerName, opponentName, onRematch }: ResultScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={[styles.result, { color: won ? '#ffd23f' : '#ff6b6b' }]}>
        {won ? 'VICTORY' : 'DEFEAT'}
      </Text>
      <Text style={styles.subtitle}>
        {won ? `${playerName} pins ${opponentName} to win the match!` : `${opponentName} gets the better of ${playerName} tonight.`}
      </Text>
      <Pressable style={styles.button} onPress={onRematch}>
        <Text style={styles.buttonText}>BACK TO ROSTER</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a14',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  result: { fontSize: 40, fontWeight: '900', letterSpacing: 3, marginBottom: 12 },
  subtitle: { color: '#c7c7dc', fontSize: 14, textAlign: 'center', marginBottom: 36 },
  button: {
    backgroundColor: '#e74c3c',
    paddingVertical: 16,
    paddingHorizontal: 36,
    borderRadius: 30,
  },
  buttonText: { color: '#fff', fontWeight: '800', letterSpacing: 1 },
});
