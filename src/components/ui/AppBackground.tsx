import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, RadialGradient, Rect, Stop } from 'react-native-svg';

import { colors } from '../../design/tokens';

interface AppBackgroundProps {
  children: ReactNode;
}

function BackgroundGlow() {
  return (
    <Svg pointerEvents="none" style={StyleSheet.absoluteFill} preserveAspectRatio="none" viewBox="0 0 100 100">
      <Defs>
        <RadialGradient id="topTeal" cx="50%" cy="-10%" rx="62%" ry="48%" fx="50%" fy="-10%">
          <Stop offset="0" stopColor="rgb(78,141,156)" stopOpacity="0.36" />
          <Stop offset="0.38" stopColor="rgb(78,141,156)" stopOpacity="0.13" />
          <Stop offset="1" stopColor="rgb(78,141,156)" stopOpacity="0" />
        </RadialGradient>
        <RadialGradient id="rightPurple" cx="100%" cy="4%" rx="58%" ry="52%" fx="100%" fy="4%">
          <Stop offset="0" stopColor="rgb(40,28,89)" stopOpacity="0.6" />
          <Stop offset="0.42" stopColor="rgb(40,28,89)" stopOpacity="0.22" />
          <Stop offset="1" stopColor="rgb(40,28,89)" stopOpacity="0" />
        </RadialGradient>
        <RadialGradient id="leftPurple" cx="-8%" cy="24%" rx="62%" ry="58%" fx="-8%" fy="24%">
          <Stop offset="0" stopColor="rgb(40,28,89)" stopOpacity="0.48" />
          <Stop offset="0.45" stopColor="rgb(40,28,89)" stopOpacity="0.2" />
          <Stop offset="1" stopColor="rgb(40,28,89)" stopOpacity="0" />
        </RadialGradient>
        <LinearGradient id="depthWash" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0" stopColor="rgb(27,45,61)" stopOpacity="0.2" />
          <Stop offset="0.42" stopColor="rgb(32,33,66)" stopOpacity="0.16" />
          <Stop offset="1" stopColor="rgb(5,6,11)" stopOpacity="0" />
        </LinearGradient>
      </Defs>
      <Rect width="100" height="100" fill={colors.surface} />
      <Rect width="100" height="100" fill="url(#depthWash)" />
      <Rect width="100" height="100" fill="url(#topTeal)" />
      <Rect width="100" height="100" fill="url(#rightPurple)" />
      <Rect width="100" height="100" fill="url(#leftPurple)" />
    </Svg>
  );
}

export function AppBackground({ children }: AppBackgroundProps) {
  return (
    <View style={styles.container}>
      <BackgroundGlow />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface, overflow: 'hidden' },
});
