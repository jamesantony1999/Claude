import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export function MainMenuScreen({ onPlay }: { onPlay: () => void }) {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.title}>RING LEGENDS</Text>
      <Text style={styles.subtitle}>3D</Text>
      <Text style={styles.tagline}>An original wrestling saga. Six legends. One ring.</Text>

      <Pressable style={({ pressed }) => [styles.playButton, { opacity: pressed ? 0.8 : 1 }]} onPress={onPlay}>
        <Text style={styles.playText}>ENTER THE RING</Text>
      </Pressable>

      <Text style={styles.footnote}>
        Fan-made original concept — not affiliated with or endorsed by WWE, TKO, or any real wrestling
        promotion.
      </Text>
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
  title: {
    color: '#ffd23f',
    fontSize: 40,
    fontWeight: '900',
    letterSpacing: 3,
  },
  subtitle: {
    color: '#ff5fa2',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 6,
    marginTop: -6,
  },
  tagline: {
    color: '#9797ad',
    fontSize: 13,
    marginTop: 16,
    marginBottom: 40,
    textAlign: 'center',
  },
  playButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  playText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 1,
  },
  footnote: {
    position: 'absolute',
    bottom: 24,
    color: '#4c4c63',
    fontSize: 10,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
