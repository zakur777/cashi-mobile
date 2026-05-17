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

import { GradientSurface } from '../src/components/ui/GradientSurface';
import { colors, radius, spacing, touchTarget, typography } from '../src/design/tokens';
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
            <GradientSurface style={styles.brandMark}>
              <Text style={styles.brandMarkText}>C</Text>
            </GradientSurface>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Demo offline</Text>
            </View>
          </View>

          <Text style={styles.kicker}>Cashi Mobile</Text>
          <Text style={styles.heroTitle}>Control financiero simple.</Text>
          <Text style={styles.heroSubtitle}>
            Acceso local, claro y seguro para revisar balance, categorías y movimientos de la demo.
          </Text>

          <GradientSurface style={styles.heroArt} colors={['#281C59', '#111225', '#070811']}>
            <View style={styles.glowTopLeft} />
            <View style={styles.glowBottomRight} />
            <View style={styles.orbit}>
              <GradientSurface style={styles.planet} />
              <View style={styles.moon} />
            </View>
          </GradientSurface>

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
              style={styles.buttonShell}
              onPress={() => {
                void handleSubmit();
              }}
            >
              <GradientSurface style={styles.button}>
                <Text style={styles.buttonText}>Ingresar</Text>
              </GradientSurface>
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
  },
  brandMarkText: { color: colors.textOnAccent, fontFamily: typography.display, fontSize: 20, fontWeight: '800' },
  badge: {
    minHeight: 36,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    justifyContent: 'center',
    backgroundColor: colors.surfaceSoft,
  },
  badgeText: { color: colors.lime, fontFamily: typography.bodyBold, fontWeight: '700', fontSize: 12 },
  kicker: {
    color: colors.lime,
    fontFamily: typography.bodyBold,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  heroTitle: { fontFamily: typography.display, fontSize: 32, lineHeight: 34, fontWeight: '800', color: colors.textPrimary },
  heroSubtitle: { fontFamily: typography.body, fontSize: 15, lineHeight: 22, color: colors.textSecondary },
  heroArt: {
    height: 188,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  glowTopLeft: {
    position: 'absolute',
    left: 20,
    top: 16,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.lime,
    opacity: 0.16,
  },
  glowBottomRight: {
    position: 'absolute',
    right: 10,
    bottom: 4,
    width: 142,
    height: 142,
    borderRadius: 71,
    backgroundColor: colors.secondary,
    opacity: 0.26,
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
  planet: { width: 54, height: 54, borderRadius: 27 },
  moon: { position: 'absolute', right: 8, top: 16, width: 14, height: 14, borderRadius: 7, backgroundColor: colors.lime },
  formStack: { gap: spacing.sm },
  fieldContainer: { gap: spacing.xs },
  label: { color: colors.textSecondary, fontFamily: typography.bodyBold, fontSize: 13, fontWeight: '700' },
  input: {
    minHeight: 52,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    color: colors.textPrimary,
    fontFamily: typography.body,
    backgroundColor: colors.surfaceSoft,
  },
  errorText: { color: colors.danger, fontFamily: typography.body, fontSize: 13 },
  buttonShell: { marginTop: spacing.sm, borderRadius: radius.pill, overflow: 'hidden' },
  button: {
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    minHeight: touchTarget.minHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: { color: colors.textOnAccent, fontFamily: typography.bodyBold, fontSize: 16, fontWeight: '800' },
  footerNote: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: spacing.md,
  },
});
