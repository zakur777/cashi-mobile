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
      <GradientSurface
        style={styles.topWash}
        colors={['#172635', '#11182A', '#080A13', colors.surface]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      <GradientSurface
        style={styles.rightGlow}
        colors={['rgba(40,28,89,0.28)', 'rgba(40,28,89,0.08)', 'rgba(40,28,89,0)']}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
      <GradientSurface
        style={styles.topTealGlow}
        colors={['rgba(78,141,156,0.16)', 'rgba(78,141,156,0.04)', 'rgba(78,141,156,0)']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface, overflow: 'hidden' },
  topWash: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 230,
  },
  rightGlow: {
    position: 'absolute',
    top: 0,
    right: -72,
    width: 210,
    height: 230,
  },
  topTealGlow: {
    position: 'absolute',
    top: 0,
    left: 40,
    right: 40,
    height: 150,
  },
});
