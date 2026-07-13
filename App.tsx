import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { MainMenuScreen } from './src/screens/MainMenuScreen';
import { CharacterSelectScreen } from './src/screens/CharacterSelectScreen';
import { MatchScreen } from './src/screens/MatchScreen';
import { useGameStore } from './src/state/gameStore';

type AppScreen = 'menu' | 'select' | 'match';

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('menu');
  const selectPlayerWrestler = useGameStore((s) => s.selectPlayerWrestler);
  const selectOpponentWrestler = useGameStore((s) => s.selectOpponentWrestler);
  const startMatch = useGameStore((s) => s.startMatch);
  const resetMatch = useGameStore((s) => s.resetMatch);

  const handleConfirm = (playerId: string, opponentId: string) => {
    selectPlayerWrestler(playerId);
    selectOpponentWrestler(opponentId);
    startMatch();
    setScreen('match');
  };

  const handleExitMatch = () => {
    resetMatch();
    setScreen('select');
  };

  return (
    <View style={styles.root}>
      {screen === 'menu' && <MainMenuScreen onPlay={() => setScreen('select')} />}
      {screen === 'select' && (
        <CharacterSelectScreen onConfirm={handleConfirm} onBack={() => setScreen('menu')} />
      )}
      {screen === 'match' && <MatchScreen onExit={handleExitMatch} />}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0a0a14' },
});
