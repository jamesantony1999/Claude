import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MoveDefinition } from '../types';

const CATEGORY_COLOR: Record<string, string> = {
  strike: '#e74c3c',
  grapple: '#8e44ad',
  aerial: '#2980b9',
  taunt: '#f39c12',
  signature: '#f1c40f',
};

interface MoveButtonProps {
  move: MoveDefinition;
  disabled: boolean;
  onPress: () => void;
}

export function MoveButton({ move, disabled, onPress }: MoveButtonProps) {
  const color = CATEGORY_COLOR[move.category] ?? '#555';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        { borderColor: color, opacity: disabled ? 0.35 : pressed ? 0.7 : 1 },
      ]}
    >
      <View style={styles.row}>
        <Text style={styles.name}>{move.name}</Text>
        <Text style={[styles.cost, { color }]}>{move.staminaCost > 0 ? `${move.staminaCost} STA` : 'FREE'}</Text>
      </View>
      <Text style={styles.desc}>{move.description}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1.5,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#14141f',
    marginBottom: 6,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { color: '#f2f2f8', fontWeight: '700', fontSize: 13 },
  cost: { fontSize: 11, fontWeight: '700' },
  desc: { color: '#9797ad', fontSize: 10, marginTop: 2 },
});
