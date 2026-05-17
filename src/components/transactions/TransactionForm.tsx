import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { GradientSurface } from '../ui/GradientSurface';
import { colors, radius, spacing, touchTarget, typography } from '../../design/tokens';
import type { Category, TransactionType } from '../../domain/types';

interface TransactionFormProps {
  title: string;
  amount: string;
  type: TransactionType;
  description: string;
  date: string;
  categoryId: string;
  categories: Category[];
  errors: {
    amount?: string;
    type?: string;
    description?: string;
    date?: string;
    categoryId?: string;
  };
  loading: boolean;
  saveLabel: string;
  onChangeAmount: (value: string) => void;
  onChangeType: (value: TransactionType) => void;
  onChangeDescription: (value: string) => void;
  onChangeDate: (value: string) => void;
  onChangeCategoryId: (value: string) => void;
  onSave: () => void;
  onDelete?: () => void;
}

export function TransactionForm(props: TransactionFormProps) {
  const {
    title,
    amount,
    type,
    description,
    date,
    categoryId,
    categories,
    errors,
    loading,
    saveLabel,
    onChangeAmount,
    onChangeType,
    onChangeDescription,
    onChangeDate,
    onChangeCategoryId,
    onSave,
    onDelete,
  } = props;

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <GradientSurface style={styles.heroCard} colors={['#281C59', '#151621', '#070811']}>
          <Text style={styles.kicker}>Movimiento</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.heroHelp}>Registrá ingresos y egresos en pesos chilenos.</Text>
        </GradientSurface>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Monto</Text>
          <TextInput
            value={amount}
            onChangeText={onChangeAmount}
            keyboardType="decimal-pad"
            placeholder="Ej: 1500"
            placeholderTextColor={colors.textMuted}
            style={[styles.input, errors.amount ? styles.inputError : undefined]}
          />
          {errors.amount ? <Text style={styles.error}>{errors.amount}</Text> : null}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Tipo</Text>
          <View style={styles.typeRow}>
            <Pressable
              style={[styles.typeButton, type === 'income' ? styles.typeButtonActive : undefined]}
              onPress={() => onChangeType('income')}
            >
              <Text style={[styles.typeButtonText, type === 'income' ? styles.typeButtonTextActive : undefined]}>
                Ingreso
              </Text>
            </Pressable>
            <Pressable
              style={[styles.typeButton, type === 'expense' ? styles.typeButtonActive : undefined]}
              onPress={() => onChangeType('expense')}
            >
              <Text style={[styles.typeButtonText, type === 'expense' ? styles.typeButtonTextActive : undefined]}>
                Egreso
              </Text>
            </Pressable>
          </View>
          {errors.type ? <Text style={styles.error}>{errors.type}</Text> : null}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            value={description}
            onChangeText={onChangeDescription}
            placeholder="Ej: Supermercado"
            placeholderTextColor={colors.textMuted}
            style={[styles.input, errors.description ? styles.inputError : undefined]}
          />
          {errors.description ? <Text style={styles.error}>{errors.description}</Text> : null}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Fecha (YYYY-MM-DD)</Text>
          <TextInput
            value={date}
            onChangeText={onChangeDate}
            placeholder="2026-05-11"
            placeholderTextColor={colors.textMuted}
            style={[styles.input, errors.date ? styles.inputError : undefined]}
          />
          {errors.date ? <Text style={styles.error}>{errors.date}</Text> : null}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Categoría</Text>
          <View style={styles.categoriesWrap}>
            {categories.map((category) => (
              <Pressable
                key={category.id}
                onPress={() => onChangeCategoryId(category.id)}
                style={[
                  styles.categoryChip,
                  categoryId === category.id ? styles.categoryChipActive : undefined,
                  categoryId === category.id ? { borderColor: category.color } : undefined,
                ]}
              >
                <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
                <Text style={styles.categoryChipText}>{category.name}</Text>
              </Pressable>
            ))}
          </View>
          {errors.categoryId ? <Text style={styles.error}>{errors.categoryId}</Text> : null}
        </View>

        <Pressable style={styles.saveButtonShell} onPress={onSave} disabled={loading}>
          <GradientSurface style={styles.saveButton}>
            <Text style={styles.saveText}>{loading ? 'Guardando...' : saveLabel}</Text>
          </GradientSurface>
        </Pressable>

        {onDelete ? (
          <Pressable style={styles.deleteButton} onPress={onDelete} disabled={loading}>
            <Text style={styles.deleteText}>Eliminar transacción</Text>
          </Pressable>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: { flex: 1, backgroundColor: 'transparent' },
  container: { padding: spacing.md, paddingBottom: 96, gap: spacing.md, backgroundColor: 'transparent' },
  heroCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    padding: spacing.md,
    gap: spacing.xs,
  },
  kicker: {
    color: colors.lime,
    fontFamily: typography.bodyBold,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: { fontFamily: typography.display, fontSize: 24, fontWeight: '800', color: colors.textPrimary },
  heroHelp: { color: colors.textSecondary, fontFamily: typography.body, fontSize: 13, lineHeight: 18 },
  fieldGroup: { gap: spacing.xs },
  label: { fontFamily: typography.bodyBold, fontSize: 13, fontWeight: '800', color: colors.textSecondary, textTransform: 'uppercase' },
  input: {
    minHeight: 52,
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
  error: { color: colors.danger, marginTop: 2 },
  typeRow: { flexDirection: 'row', gap: spacing.xs, padding: 4, borderRadius: radius.md, backgroundColor: colors.surfaceSoft },
  typeButton: {
    flex: 1,
    borderRadius: radius.sm,
    minHeight: touchTarget.minHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeButtonActive: { backgroundColor: colors.secondary },
  typeButtonText: { fontFamily: typography.bodyBold, fontWeight: '800', color: colors.textSecondary },
  typeButtonTextActive: { color: colors.textOnAccent },
  categoriesWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  categoryChip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    minHeight: touchTarget.minHeight,
    paddingHorizontal: spacing.sm,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surfaceCard,
  },
  categoryChipActive: { backgroundColor: colors.surfaceSoft, borderWidth: 2 },
  categoryDot: { width: 10, height: 10, borderRadius: 5 },
  categoryChipText: { color: colors.textPrimary, fontFamily: typography.bodyBold, fontWeight: '800' },
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
