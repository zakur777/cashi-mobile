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
      <GradientSurface style={styles.baseGlow} colors={['#05060B', '#05060B', '#05060B']} />
      <GradientSurface style={styles.topWash} colors={['#1B2D3D', '#202142', '#05060B']} />
      <View style={styles.tealGlow} />
      <View style={styles.purpleGlow} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface, overflow: 'hidden' },
  baseGlow: { ...StyleSheet.absoluteFillObject },
  topWash: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 190,
  },
  tealGlow: {
    position: 'absolute',
    top: -42,
    right: -48,
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: colors.secondary,
    opacity: 0.24,
  },
  purpleGlow: {
    position: 'absolute',
    top: 130,
    left: -120,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: colors.primary,
    opacity: 0.4,
  },
});
