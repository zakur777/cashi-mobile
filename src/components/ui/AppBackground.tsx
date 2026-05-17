import { Canvas, Circle, Group, LinearGradient, RadialGradient, Rect, vec } from '@shopify/react-native-skia';
import type { ReactNode } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { colors } from '../../design/tokens';

interface AppBackgroundProps {
  children: ReactNode;
}

function SkiaBackground() {
  const { width, height } = useWindowDimensions();
  const topHeight = height * 0.42;

  return (
    <Canvas pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Rect x={0} y={0} width={width} height={height} color={colors.surface} />

      <Rect x={0} y={0} width={width} height={topHeight}>
        <LinearGradient
          start={vec(0, 0)}
          end={vec(0, topHeight)}
          colors={['#172635', '#101426', '#070811', colors.surface]}
          positions={[0, 0.32, 0.72, 1]}
        />
      </Rect>

      <Circle cx={width * 0.5} cy={-height * 0.08} r={width * 0.62}>
        <RadialGradient
          c={vec(width * 0.5, -height * 0.08)}
          r={width * 0.62}
          colors={['rgba(78,141,156,0.22)', 'rgba(78,141,156,0.07)', 'rgba(78,141,156,0)']}
          positions={[0, 0.48, 1]}
        />
      </Circle>

      <Circle cx={width * 1.08} cy={height * 0.04} r={width * 0.52}>
        <RadialGradient
          c={vec(width * 1.08, height * 0.04)}
          r={width * 0.52}
          colors={['rgba(40,28,89,0.42)', 'rgba(40,28,89,0.13)', 'rgba(40,28,89,0)']}
          positions={[0, 0.56, 1]}
        />
      </Circle>

      <Circle cx={-width * 0.08} cy={height * 0.22} r={width * 0.42}>
        <RadialGradient
          c={vec(-width * 0.08, height * 0.22)}
          r={width * 0.42}
          colors={['rgba(40,28,89,0.24)', 'rgba(40,28,89,0.08)', 'rgba(40,28,89,0)']}
          positions={[0, 0.6, 1]}
        />
      </Circle>

      <Group opacity={0.16}>
        <Rect x={width * 0.58} y={0} width={width * 0.42} height={height * 0.3}>
          <LinearGradient
            start={vec(width * 0.58, 0)}
            end={vec(width, height * 0.3)}
            colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0)']}
          />
        </Rect>
      </Group>
    </Canvas>
  );
}

export function AppBackground({ children }: AppBackgroundProps) {
  return (
    <View style={styles.container}>
      <SkiaBackground />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface, overflow: 'hidden' },
});
