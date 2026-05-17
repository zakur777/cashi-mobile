import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { GradientSurface } from '../ui/GradientSurface';
import { colors, componentSizes, layout, radius, spacing, touchTarget, typography } from '../../design/tokens';
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
  onCancel: () => void;
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
  onCancel,
  onSave,
  onDelete,
}: CategoryFormProps) {
  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.topbar}>
          <Pressable style={styles.backButton} onPress={onCancel} accessibilityRole="button" accessibilityLabel="Volver">
            <Text style={styles.backButtonText}>‹</Text>
          </Pressable>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Local</Text>
          </View>
        </View>

        <GradientSurface style={styles.previewCard} colors={['#281C59', '#151621', '#070811']}>
          <View style={[styles.previewIcon, { backgroundColor: color }]} />
          <View>
            <Text style={styles.kicker}>Categoría</Text>
            <Text style={styles.title}>{title}</Text>
          </View>
        </GradientSurface>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            value={name}
            onChangeText={onChangeName}
            placeholder="Ej: Comida"
            placeholderTextColor={colors.textMuted}
            style={[styles.input, error ? styles.inputError : undefined]}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>

        <View style={styles.fieldGroup}>
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
        </View>

        <View style={styles.fieldGroup}>
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
          <Text style={styles.helpText}>Paleta fija Cashi para reconocer ingresos y egresos al vuelo.</Text>
        </View>

        <Pressable style={styles.saveButtonShell} onPress={onSave} disabled={loading}>
          <GradientSurface style={styles.saveButton}>
            <Text style={styles.saveText}>{loading ? 'Guardando...' : saveLabel}</Text>
          </GradientSurface>
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
  keyboardContainer: { flex: 1, backgroundColor: 'transparent' },
  container: { flexGrow: 1, padding: layout.screenPadding, paddingBottom: 96, gap: spacing.md, backgroundColor: 'transparent' },
  topbar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  backButton: {
    width: componentSizes.iconButton,
    height: componentSizes.iconButton,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceSoft,
  },
  backButtonText: { color: colors.textPrimary, fontSize: 32, lineHeight: 34 },
  badge: {
    minHeight: 36,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.surfaceSoft,
  },
  badgeText: { color: colors.lime, fontFamily: typography.bodyBold, fontSize: 12, fontWeight: '800' },
  previewCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  previewIcon: { width: 56, height: 56, borderRadius: radius.md, opacity: 0.85 },
  kicker: {
    color: colors.lime,
    fontFamily: typography.bodyBold,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: { fontFamily: typography.display, fontSize: 24, fontWeight: '800', color: colors.textPrimary },
  fieldGroup: { gap: spacing.xs },
  label: { fontFamily: typography.bodyBold, fontSize: 13, fontWeight: '800', color: colors.textSecondary, textTransform: 'uppercase' },
  input: {
    minHeight: componentSizes.inputMinHeight,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    fontSize: 16,
    color: colors.textPrimary,
    fontFamily: typography.body,
    backgroundColor: colors.surfaceSoft,
  },
  inputError: { borderColor: colors.danger },
  error: { color: colors.danger, fontFamily: typography.body, fontSize: 12, lineHeight: 17, marginTop: 2 },
  segmentedRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    padding: 4,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border,
  },
  segmentButton: {
    flex: 1,
    minHeight: componentSizes.segmentMinHeight,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentButtonActive: { backgroundColor: colors.secondary },
  segmentText: { color: colors.textSecondary, fontFamily: typography.bodyBold, fontWeight: '800' },
  segmentTextActive: { color: colors.textOnAccent },
  paletteRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
    padding: spacing.xs,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceSoft,
  },
  colorSwatch: {
    width: touchTarget.minHeight,
    height: touchTarget.minHeight,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.border,
  },
  colorSwatchActive: { borderColor: colors.lime, transform: [{ scale: 1.08 }] },
  helpText: { color: colors.textSecondary, fontFamily: typography.body, fontSize: 12, lineHeight: 18 },
  saveButtonShell: { marginTop: spacing.sm, borderRadius: radius.pill, overflow: 'hidden' },
  saveButton: {
    borderRadius: radius.pill,
    minHeight: touchTarget.minHeight,
    justifyContent: 'center',
  },
  saveText: { color: colors.textOnAccent, fontFamily: typography.bodyBold, textAlign: 'center', fontWeight: '800' },
  deleteButton: {
    backgroundColor: colors.dangerSoft,
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: radius.pill,
    minHeight: touchTarget.minHeight,
    justifyContent: 'center',
  },
  deleteText: { color: colors.danger, fontFamily: typography.bodyBold, textAlign: 'center', fontWeight: '800' },
});
