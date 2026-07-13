import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { WRESTLERS } from '../data/wrestlers';
import { WrestlerDefinition } from '../types';

interface CharacterSelectScreenProps {
  onConfirm: (playerId: string, opponentId: string) => void;
  onBack: () => void;
}

function pickRandomOpponent(excludeId: string): string {
  const pool = WRESTLERS.filter((w) => w.id !== excludeId);
  return pool[Math.floor(Math.random() * pool.length)].id;
}

export function CharacterSelectScreen({ onConfirm, onBack }: CharacterSelectScreenProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const renderItem = ({ item }: { item: WrestlerDefinition }) => {
    const selected = item.id === selectedId;
    return (
      <Pressable
        onPress={() => setSelectedId(item.id)}
        style={[styles.card, selected && { borderColor: item.accentColor, borderWidth: 2 }]}
      >
        <View style={[styles.swatch, { backgroundColor: item.primaryColor }]} />
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.gimmick}>{item.gimmick}</Text>
          <View style={styles.statsRow}>
            <StatPip label="PWR" value={item.stats.power} />
            <StatPip label="SPD" value={item.stats.speed} />
            <StatPip label="TEC" value={item.stats.technique} />
            <StatPip label="STA" value={item.stats.stamina} />
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>CHOOSE YOUR LEGEND</Text>
      <FlatList
        data={WRESTLERS}
        keyExtractor={(w) => w.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 16 }}
      />
      <View style={styles.footer}>
        <Pressable style={styles.backButton} onPress={onBack}>
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <Pressable
          style={[styles.confirmButton, { opacity: selectedId ? 1 : 0.4 }]}
          disabled={!selectedId}
          onPress={() => selectedId && onConfirm(selectedId, pickRandomOpponent(selectedId))}
        >
          <Text style={styles.confirmText}>FIGHT</Text>
        </Pressable>
      </View>
    </View>
  );
}

function StatPip({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.pip}>
      <Text style={styles.pipLabel}>{label}</Text>
      <Text style={styles.pipValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a14', paddingTop: 56, paddingHorizontal: 16 },
  header: { color: '#f2f2f8', fontSize: 20, fontWeight: '800', marginBottom: 12, letterSpacing: 1 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#14141f',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  swatch: { width: 48, height: 48, borderRadius: 24, marginRight: 12 },
  name: { color: '#fff', fontWeight: '800', fontSize: 15 },
  gimmick: { color: '#9797ad', fontSize: 11, marginBottom: 6 },
  statsRow: { flexDirection: 'row', gap: 10 },
  pip: { alignItems: 'center' },
  pipLabel: { color: '#6c6c85', fontSize: 9, fontWeight: '700' },
  pipValue: { color: '#ffd23f', fontSize: 12, fontWeight: '800' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12 },
  backButton: { paddingVertical: 12, paddingHorizontal: 20 },
  backText: { color: '#9797ad', fontWeight: '700' },
  confirmButton: { backgroundColor: '#e74c3c', paddingVertical: 12, paddingHorizontal: 32, borderRadius: 24 },
  confirmText: { color: '#fff', fontWeight: '800', letterSpacing: 1 },
});
