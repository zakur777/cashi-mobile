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
      <GradientSurface
        style={styles.topGlow}
        colors={['rgba(78,141,156,0.26)', 'rgba(40,28,89,0.34)', 'rgba(5,6,11,0)']}
        start={{ x: 0.52, y: -0.12 }}
        end={{ x: 0.52, y: 1 }}
      />
      <GradientSurface
        style={styles.rightWash}
        colors={['rgba(40,28,89,0)', 'rgba(78,141,156,0.16)', 'rgba(40,28,89,0.42)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <GradientSurface
        style={styles.leftWash}
        colors={['rgba(40,28,89,0.46)', 'rgba(40,28,89,0.18)', 'rgba(5,6,11,0)']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface, overflow: 'hidden' },
  baseGlow: { ...StyleSheet.absoluteFillObject },
  topGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 250,
  },
  rightWash: {
    position: 'absolute',
    top: -12,
    right: -88,
    width: 260,
    height: 360,
    transform: [{ rotate: '18deg' }],
  },
  leftWash: {
    position: 'absolute',
    top: 122,
    left: -138,
    width: 300,
    height: 340,
    transform: [{ rotate: '-8deg' }],
  },
});
