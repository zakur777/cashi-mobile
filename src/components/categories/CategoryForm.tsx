import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, radius, spacing, touchTarget } from '../../design/tokens';

interface CategoryFormProps {
  title: string;
  name: string;
  error?: string;
  loading: boolean;
  saveLabel: string;
  onChangeName: (value: string) => void;
  onSave: () => void;
  onDelete?: () => void;
}

export function CategoryForm({
  title,
  name,
  error,
  loading,
  saveLabel,
  onChangeName,
  onSave,
  onDelete,
}: CategoryFormProps) {
  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>{title}</Text>

        <Text style={styles.label}>Nombre</Text>
        <TextInput
          value={name}
          onChangeText={onChangeName}
          placeholder="Ej: Comida"
          style={[styles.input, error ? styles.inputError : undefined]}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable style={styles.saveButton} onPress={onSave} disabled={loading}>
          <Text style={styles.saveText}>{loading ? 'Guardando...' : saveLabel}</Text>
        </Pressable>

        {onDelete ? (
          <Pressable style={styles.deleteButton} onPress={onDelete} disabled={loading}>
            <Text style={styles.deleteText}>Eliminar categoría</Text>
          </Pressable>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: { flex: 1, backgroundColor: colors.surface },
  container: { flexGrow: 1, padding: spacing.md, paddingBottom: spacing.xl, backgroundColor: colors.surface },
  title: { fontSize: 22, fontWeight: '700', marginBottom: spacing.lg, color: colors.textPrimary },
  label: { fontSize: 14, fontWeight: '600', marginBottom: spacing.xs, color: colors.textPrimary },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    fontSize: 16,
    color: colors.textPrimary,
    backgroundColor: colors.surfaceCard,
  },
  inputError: { borderColor: colors.danger },
  error: { color: colors.danger, marginTop: 6, marginBottom: 10 },
  saveButton: {
    marginTop: 18,
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    minHeight: touchTarget.minHeight,
    justifyContent: 'center',
  },
  saveText: { color: colors.textOnPrimary, textAlign: 'center', fontWeight: '600' },
  deleteButton: {
    marginTop: 12,
    backgroundColor: colors.danger,
    borderRadius: radius.sm,
    minHeight: touchTarget.minHeight,
    justifyContent: 'center',
  },
  deleteText: { color: colors.textOnPrimary, textAlign: 'center', fontWeight: '600' },
});
