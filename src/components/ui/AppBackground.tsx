import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { GradientSurface } from './GradientSurface';
import { colors } from '../../design/tokens';

interface AppBackgroundProps {
  children: ReactNode;
}

export function AppBackground({ children }: AppBackgroundProps) {
  return (
    <View style={styles.container}>
      <GradientSurface style={styles.baseGlow} colors={['#0A0B13', '#05060B', '#05060B']} />
      <View style={styles.tealGlow} />
      <View style={styles.purpleGlow} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface, overflow: 'hidden' },
  baseGlow: { ...StyleSheet.absoluteFillObject },
  tealGlow: {
    position: 'absolute',
    top: -90,
    right: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: colors.secondary,
    opacity: 0.18,
  },
  purpleGlow: {
    position: 'absolute',
    top: 120,
    left: -120,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: colors.primary,
    opacity: 0.34,
  },
});
