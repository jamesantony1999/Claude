import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LogEntry } from '../types';

const TONE_COLOR: Record<LogEntry['tone'], string> = {
  neutral: '#c7c7dc',
  good: '#5be38a',
  bad: '#ff6b6b',
  critical: '#ffd23f',
};

export function CommentaryFeed({ log }: { log: LogEntry[] }) {
  return (
    <View style={styles.container}>
      {log.slice(-4).map((entry) => (
        <Text key={entry.id} style={[styles.line, { color: TONE_COLOR[entry.tone] }]} numberOfLines={2}>
          {entry.text}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(10,10,18,0.75)',
    borderRadius: 10,
    padding: 8,
    gap: 3,
  },
  line: { fontSize: 12, fontWeight: '600' },
});
