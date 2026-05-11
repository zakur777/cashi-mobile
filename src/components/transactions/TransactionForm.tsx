import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, radius, spacing, touchTarget } from '../../design/tokens';
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
        <Text style={styles.title}>{title}</Text>

        <Text style={styles.label}>Monto</Text>
        <TextInput
          value={amount}
          onChangeText={onChangeAmount}
          keyboardType="decimal-pad"
          placeholder="Ej: 1500"
          style={[styles.input, errors.amount ? styles.inputError : undefined]}
        />
        {errors.amount ? <Text style={styles.error}>{errors.amount}</Text> : null}

        <Text style={styles.label}>Tipo</Text>
        <View style={styles.typeRow}>
          <Pressable
            style={[styles.typeButton, type === 'income' ? styles.typeButtonActive : undefined]}
            onPress={() => onChangeType('income')}
          >
            <Text style={styles.typeButtonText}>Ingreso</Text>
          </Pressable>
          <Pressable
            style={[styles.typeButton, type === 'expense' ? styles.typeButtonActive : undefined]}
            onPress={() => onChangeType('expense')}
          >
            <Text style={styles.typeButtonText}>Egreso</Text>
          </Pressable>
        </View>
        {errors.type ? <Text style={styles.error}>{errors.type}</Text> : null}

        <Text style={styles.label}>Descripción</Text>
        <TextInput
          value={description}
          onChangeText={onChangeDescription}
          placeholder="Ej: Supermercado"
          style={[styles.input, errors.description ? styles.inputError : undefined]}
        />
        {errors.description ? <Text style={styles.error}>{errors.description}</Text> : null}

        <Text style={styles.label}>Fecha (YYYY-MM-DD)</Text>
        <TextInput
          value={date}
          onChangeText={onChangeDate}
          placeholder="2026-05-11"
          style={[styles.input, errors.date ? styles.inputError : undefined]}
        />
        {errors.date ? <Text style={styles.error}>{errors.date}</Text> : null}

        <Text style={styles.label}>Categoría</Text>
        <View style={styles.categoriesWrap}>
          {categories.map((category) => (
            <Pressable
              key={category.id}
              onPress={() => onChangeCategoryId(category.id)}
              style={[
                styles.categoryChip,
                categoryId === category.id ? styles.categoryChipActive : undefined,
              ]}
            >
              <Text style={styles.categoryChipText}>{category.name}</Text>
            </Pressable>
          ))}
        </View>
        {errors.categoryId ? <Text style={styles.error}>{errors.categoryId}</Text> : null}

        <Pressable style={styles.saveButton} onPress={onSave} disabled={loading}>
          <Text style={styles.saveText}>{loading ? 'Guardando...' : saveLabel}</Text>
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
  keyboardContainer: { flex: 1, backgroundColor: colors.surface },
  container: { padding: spacing.md, paddingBottom: spacing.xl, backgroundColor: colors.surface },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 18, color: colors.textPrimary },
  label: { fontSize: 14, fontWeight: '600', marginBottom: spacing.xs, marginTop: 10, color: colors.textPrimary },
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
  error: { color: colors.danger, marginTop: 6 },
  typeRow: { flexDirection: 'row', gap: 8 },
  typeButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    minHeight: touchTarget.minHeight,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceCard,
  },
  typeButtonActive: { backgroundColor: colors.success, borderColor: colors.secondary },
  typeButtonText: { fontWeight: '600', color: colors.textPrimary },
  categoriesWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  categoryChip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    minHeight: touchTarget.minHeight,
    paddingHorizontal: spacing.sm,
    justifyContent: 'center',
    backgroundColor: colors.surfaceCard,
  },
  categoryChipActive: { borderColor: colors.secondary, backgroundColor: colors.success },
  categoryChipText: { color: colors.textPrimary, fontWeight: '600' },
  saveButton: {
    marginTop: 20,
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    minHeight: touchTarget.minHeight,
    justifyContent: 'center',
  },
  saveText: { color: colors.textOnPrimary, textAlign: 'center', fontWeight: '700' },
  deleteButton: {
    marginTop: 12,
    backgroundColor: colors.danger,
    borderRadius: radius.sm,
    minHeight: touchTarget.minHeight,
    justifyContent: 'center',
  },
  deleteText: { color: colors.textOnPrimary, textAlign: 'center', fontWeight: '700' },
});
