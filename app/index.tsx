import { useRouter } from 'expo-router';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { colors, radius, spacing, touchTarget } from '../src/design/tokens';
import { useLoginForm } from '../src/hooks/useLoginForm';

export default function LoginScreen() {
  const router = useRouter();
  const { email, setEmail, password, setPassword, errors, formError, handleSubmit } = useLoginForm({
    onSuccess: () => router.replace('/(tabs)'),
  });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.topbar}>
            <View style={styles.brandMark}>
              <Text style={styles.brandMarkText}>C</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Demo offline</Text>
            </View>
          </View>

          <Text style={styles.kicker}>Cashi Mobile</Text>
          <Text style={styles.heroTitle}>Control financiero simple.</Text>
          <Text style={styles.heroSubtitle}>
            Acceso local, claro y seguro para revisar balance, categorías y movimientos de la demo.
          </Text>

          <View style={styles.heroArt}>
            <View style={styles.orbit}>
              <View style={styles.planet} />
            </View>
          </View>

          <View style={styles.formStack}>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Correo</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                accessibilityLabel="Email"
                placeholder="demo@cashi.com"
                placeholderTextColor={colors.textMuted}
                style={styles.input}
              />
              {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Contraseña</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                accessibilityLabel="Contraseña"
                placeholder="••••••••"
                placeholderTextColor={colors.textMuted}
                style={styles.input}
              />
              {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
            </View>

            {formError ? <Text style={styles.errorText}>{formError}</Text> : null}

            <Pressable
              style={styles.button}
              onPress={() => {
                void handleSubmit();
              }}
            >
              <Text style={styles.buttonText}>Ingresar</Text>
            </Pressable>
          </View>

          <Text style={styles.footerNote}>Demo local: tus datos viven solo en este dispositivo.</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: colors.surface },
  scrollContent: { flexGrow: 1, padding: spacing.lg, gap: spacing.md, justifyContent: 'center' },
  topbar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brandMark: {
    width: 42,
    height: 42,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
  },
  brandMarkText: { color: colors.textOnAccent, fontSize: 20, fontWeight: '800' },
  badge: {
    minHeight: 36,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    justifyContent: 'center',
    backgroundColor: colors.surfaceSoft,
  },
  badgeText: { color: colors.lime, fontWeight: '700', fontSize: 12 },
  kicker: { color: colors.lime, fontSize: 12, fontWeight: '800', letterSpacing: 1.5, textTransform: 'uppercase' },
  heroTitle: { fontSize: 32, lineHeight: 34, fontWeight: '800', color: colors.textPrimary },
  heroSubtitle: { fontSize: 15, lineHeight: 22, color: colors.textSecondary },
  heroArt: {
    height: 188,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbit: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planet: { width: 54, height: 54, borderRadius: 27, backgroundColor: colors.secondary },
  formStack: { gap: spacing.sm },
  fieldContainer: { gap: spacing.xs },
  label: { color: colors.textSecondary, fontSize: 13, fontWeight: '700' },
  input: {
    minHeight: 52,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    color: colors.textPrimary,
    backgroundColor: colors.surfaceSoft,
  },
  errorText: { color: colors.danger, fontSize: 13 },
  button: {
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    minHeight: touchTarget.minHeight,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  buttonText: { color: colors.textOnAccent, fontSize: 16, fontWeight: '800' },
  footerNote: { color: colors.textMuted, fontSize: 12, textAlign: 'center', lineHeight: 18, marginTop: spacing.md },
});
