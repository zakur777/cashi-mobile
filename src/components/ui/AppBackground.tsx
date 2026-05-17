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
        <RadialGradient id="topTeal" cx="50%" cy="-16%" rx="92%" ry="50%" fx="50%" fy="-16%">
          <Stop offset="0" stopColor="rgb(78,141,156)" stopOpacity="0.22" />
          <Stop offset="0.58" stopColor="rgb(78,141,156)" stopOpacity="0.07" />
          <Stop offset="1" stopColor="rgb(78,141,156)" stopOpacity="0" />
        </RadialGradient>
        <RadialGradient id="rightPurple" cx="112%" cy="2%" rx="76%" ry="50%" fx="112%" fy="2%">
          <Stop offset="0" stopColor="rgb(40,28,89)" stopOpacity="0.38" />
          <Stop offset="0.54" stopColor="rgb(40,28,89)" stopOpacity="0.12" />
          <Stop offset="1" stopColor="rgb(40,28,89)" stopOpacity="0" />
        </RadialGradient>
        <RadialGradient id="leftPurple" cx="8%" cy="18%" rx="78%" ry="46%" fx="8%" fy="18%">
          <Stop offset="0" stopColor="rgb(40,28,89)" stopOpacity="0.18" />
          <Stop offset="0.62" stopColor="rgb(40,28,89)" stopOpacity="0.06" />
          <Stop offset="1" stopColor="rgb(40,28,89)" stopOpacity="0" />
        </RadialGradient>
        <LinearGradient id="depthWash" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0" stopColor="rgb(27,45,61)" stopOpacity="0.18" />
          <Stop offset="0.22" stopColor="rgb(32,33,66)" stopOpacity="0.1" />
          <Stop offset="0.55" stopColor="rgb(5,6,11)" stopOpacity="0" />
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
