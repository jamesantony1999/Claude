import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface StatBarProps {
  label: string;
  value: number;
  max: number;
  color: string;
  trackColor?: string;
}

export function StatBar({ label, value, max, color, trackColor = '#22223a' }: StatBarProps) {
  const pct = Math.max(0, Math.min(1, value / max));
  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{Math.max(0, Math.round(value))}</Text>
      </View>
      <View style={[styles.track, { backgroundColor: trackColor }]}>
        <View style={[styles.fill, { width: `${pct * 100}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  label: { color: '#d8d8e8', fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  value: { color: '#d8d8e8', fontSize: 11, fontWeight: '700' },
  track: {
    height: 10,
    borderRadius: 6,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 6,
  },
});
