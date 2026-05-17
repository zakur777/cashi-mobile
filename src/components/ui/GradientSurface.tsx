import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import { gradients } from '../../design/tokens';

interface GradientSurfaceProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  colors?: readonly [string, string, ...string[]];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
}

export function GradientSurface({
  children,
  style,
  colors = gradients.primary,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
}: GradientSurfaceProps) {
  return (
    <LinearGradient colors={colors} start={start} end={end} style={style}>
      {children}
    </LinearGradient>
  );
}
