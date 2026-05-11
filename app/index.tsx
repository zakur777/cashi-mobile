import { useRouter } from 'expo-router';
import { SafeAreaView, StyleSheet, Text, View, Pressable } from 'react-native';

import { colors, radius, spacing, touchTarget } from '../src/design/tokens';

export default function LoginScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Cashi Mobile</Text>
        <Text style={styles.subtitle}>Unit 1 scaffold listo</Text>
        <Pressable style={styles.button} onPress={() => router.replace('/(tabs)')}>
          <Text style={styles.buttonText}>Ingresar</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.sm, padding: spacing.md },
  title: { fontSize: 28, fontWeight: '700', color: colors.textPrimary },
  subtitle: { fontSize: 16, color: colors.textSecondary },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.sm,
    minHeight: touchTarget.minHeight,
    justifyContent: 'center',
  },
  buttonText: { color: colors.textOnPrimary, fontSize: 16, fontWeight: '600' },
});
