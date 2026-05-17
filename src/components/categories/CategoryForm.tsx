import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, radius, spacing, touchTarget } from '../../design/tokens';
import { CATEGORY_COLORS, type CategoryColor, type TransactionType } from '../../domain/types';

interface CategoryFormProps {
  title: string;
  name: string;
  type: TransactionType;
  color: CategoryColor;
  error?: string;
  loading: boolean;
  saveLabel: string;
  onChangeName: (value: string) => void;
  onChangeType: (value: TransactionType) => void;
  onChangeColor: (value: CategoryColor) => void;
  onSave: () => void;
  onDelete?: () => void;
}

export function CategoryForm({
  title,
  name,
  type,
  color,
  error,
  loading,
  saveLabel,
  onChangeName,
  onChangeType,
  onChangeColor,
  onSave,
  onDelete,
}: CategoryFormProps) {
  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.kicker}>Categoría</Text>
        <Text style={styles.title}>{title}</Text>

        <Text style={styles.label}>Nombre</Text>
        <TextInput
          value={name}
          onChangeText={onChangeName}
          placeholder="Ej: Comida"
          style={[styles.input, error ? styles.inputError : undefined]}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Text style={styles.label}>Tipo</Text>
        <View style={styles.segmentedRow}>
          <Pressable
            style={[styles.segmentButton, type === 'income' ? styles.segmentButtonActive : undefined]}
            onPress={() => onChangeType('income')}
          >
            <Text style={[styles.segmentText, type === 'income' ? styles.segmentTextActive : undefined]}>Ingreso</Text>
          </Pressable>
          <Pressable
            style={[styles.segmentButton, type === 'expense' ? styles.segmentButtonActive : undefined]}
            onPress={() => onChangeType('expense')}
          >
            <Text style={[styles.segmentText, type === 'expense' ? styles.segmentTextActive : undefined]}>Egreso</Text>
          </Pressable>
        </View>

        <Text style={styles.label}>Color</Text>
        <View style={styles.paletteRow}>
          {Object.values(CATEGORY_COLORS).map((item) => (
            <Pressable
              key={item}
              accessibilityLabel={`Color ${item}`}
              style={[
                styles.colorSwatch,
                { backgroundColor: item },
                color === item ? styles.colorSwatchActive : undefined,
              ]}
              onPress={() => onChangeColor(item)}
            />
          ))}
        </View>
        <Text style={styles.helpText}>Paleta fija: morado, teal, verde éxito y lima suave.</Text>

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
  kicker: { color: colors.secondary, fontSize: 12, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase' },
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
  segmentedRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    padding: 4,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceCard,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  segmentButton: {
    flex: 1,
    minHeight: touchTarget.minHeight,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentButtonActive: { backgroundColor: colors.primary },
  segmentText: { color: colors.textSecondary, fontWeight: '700' },
  segmentTextActive: { color: colors.textOnPrimary },
  paletteRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xs },
  colorSwatch: {
    width: touchTarget.minHeight,
    height: touchTarget.minHeight,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.border,
  },
  colorSwatchActive: { borderColor: colors.primary, transform: [{ scale: 1.08 }] },
  helpText: { color: colors.textSecondary, fontSize: 12, marginBottom: spacing.md },
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
