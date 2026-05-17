import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { GradientSurface } from '../ui/GradientSurface';
import { colors, radius, spacing, touchTarget, typography } from '../../design/tokens';
import { formatSignedCLP } from '../../domain/money';
import type { Category, Transaction } from '../../domain/types';

interface CategoryListProps {
  categories: Category[];
  transactions?: Transaction[];
  onCreate: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const getCategorySummary = (category: Category, transactions: Transaction[]) => {
  const related = transactions.filter((transaction) => transaction.categoryId === category.id);
  const total = related.reduce((sum, transaction) => sum + transaction.amount, 0);

  return `${related.length} movimiento${related.length === 1 ? '' : 's'} · ${formatSignedCLP(total, category.type)}`;
};

export function CategoryList({ categories, transactions = [], onCreate, onEdit, onDelete }: CategoryListProps) {
  const incomeCount = categories.filter((category) => category.type === 'income').length;
  const expenseCount = categories.filter((category) => category.type === 'expense').length;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.kicker}>Organización</Text>
          <Text style={styles.title}>Categorías</Text>
        </View>
        <Pressable style={styles.createButtonShell} onPress={onCreate}>
          <GradientSurface style={styles.createButton}>
            <Text style={styles.createButtonText}>Nueva categoría</Text>
          </GradientSurface>
        </Pressable>
      </View>

      {categories.length > 0 ? (
        <GradientSurface style={styles.summaryCard} colors={['#281C59', '#151621', '#070811']}>
          <Text style={styles.summaryLabel}>Paleta Cashi activa</Text>
          <Text style={styles.summaryText}>
            {categories.length} categorías · {incomeCount} ingreso{incomeCount === 1 ? '' : 's'} · {expenseCount} egreso
            {expenseCount === 1 ? '' : 's'}
          </Text>
        </GradientSurface>
      ) : null}

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        contentContainerStyle={categories.length === 0 ? styles.emptyContainer : styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>Todavía no hay categorías.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={[styles.iconBadge, { backgroundColor: item.color }]} />
            <View style={styles.content}>
              <View style={styles.categoryHeader}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={[styles.type, item.type === 'income' ? styles.incomeType : styles.expenseType]}>
                  {item.type === 'income' ? 'Ingreso' : 'Egreso'}
                </Text>
              </View>
              <Text style={styles.meta}>{getCategorySummary(item, transactions)}</Text>
            </View>
            <View style={styles.actionsColumn}>
              <Pressable onPress={() => onEdit(item.id)} hitSlop={8}>
                <Text style={styles.editText}>Editar</Text>
              </Pressable>
              <Pressable onPress={() => onDelete(item.id)} hitSlop={8}>
                <Text style={styles.deleteText}>Eliminar</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.md, paddingBottom: 96, backgroundColor: 'transparent' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  kicker: {
    color: colors.lime,
    fontFamily: typography.bodyBold,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: { color: colors.textPrimary, fontFamily: typography.display, fontSize: 30, fontWeight: '800' },
  createButtonShell: { borderRadius: radius.pill, overflow: 'hidden' },
  createButton: {
    borderRadius: radius.pill,
    minHeight: touchTarget.minHeight,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
  },
  createButtonText: { color: colors.textOnAccent, fontFamily: typography.bodyBold, fontWeight: '800', textAlign: 'center' },
  summaryCard: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  summaryLabel: {
    color: colors.textSecondary,
    fontFamily: typography.bodyBold,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  summaryText: { color: colors.textPrimary, fontFamily: typography.bodyBold, fontSize: 15, fontWeight: '700', marginTop: spacing.xs },
  listContainer: { paddingBottom: spacing.xl },
  emptyContainer: { flexGrow: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: colors.textSecondary, fontSize: 16 },
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    backgroundColor: colors.surfaceCard,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconBadge: { width: 46, height: 46, borderRadius: radius.sm, opacity: 0.75 },
  content: { flex: 1, gap: 4 },
  categoryHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, flexWrap: 'wrap' },
  type: {
    overflow: 'hidden',
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  incomeType: { color: colors.textOnAccent, backgroundColor: colors.success },
  expenseType: { color: colors.danger, backgroundColor: colors.dangerSoft },
  name: { fontFamily: typography.bodyBold, fontSize: 17, fontWeight: '800', color: colors.textPrimary },
  meta: { color: colors.textSecondary, fontFamily: typography.body, fontSize: 12 },
  actionsColumn: { gap: spacing.xs, alignItems: 'flex-end' },
  editText: { color: colors.lime, fontWeight: '800', fontSize: 12 },
  deleteText: { color: colors.danger, fontWeight: '800', fontSize: 12 },
});
