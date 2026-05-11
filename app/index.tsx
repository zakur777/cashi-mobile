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
          <View style={styles.card}>
            <Text style={styles.title}>Cashi Mobile</Text>
            <Text style={styles.subtitle}>Ingresá con tus credenciales</Text>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                accessibilityLabel="Email"
                placeholder="demo@cashi.com"
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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: colors.surface },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: spacing.md },
  card: {
    backgroundColor: colors.surfaceCard,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  title: { fontSize: 28, fontWeight: '700', color: colors.textPrimary },
  subtitle: { fontSize: 16, color: colors.textSecondary },
  fieldContainer: { gap: spacing.xs },
  label: { color: colors.textPrimary, fontSize: 14, fontWeight: '600' },
  input: {
    minHeight: touchTarget.minHeight,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
  },
  errorText: { color: colors.danger, fontSize: 13 },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    minHeight: touchTarget.minHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: { color: colors.textOnPrimary, fontSize: 16, fontWeight: '600' },
});
