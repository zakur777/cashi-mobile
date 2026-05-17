import type { ReactNode } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';

import { colors } from '../../design/tokens';

const backgroundImage = require('../../assets/backgrounds/cashi-app-background.webp');

interface AppBackgroundProps {
  children: ReactNode;
}

export function AppBackground({ children }: AppBackgroundProps) {
  return (
    <View style={styles.container}>
      <ImageBackground source={backgroundImage} resizeMode="cover" style={styles.background} imageStyle={styles.image}>
        {children}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface, overflow: 'hidden' },
  background: { flex: 1 },
  image: { opacity: 1 },
});
