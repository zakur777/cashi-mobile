import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { GradientSurface } from '../ui/GradientSurface';
import { colors, radius, spacing } from '../../design/tokens';
import { formatCLP, formatSignedCLP } from '../../domain/money';
import type { TransactionType } from '../../domain/types';

interface TransactionItem {
  id: string;
  amount: number;
  type: TransactionType;
  description: string;
  date: string;
  categoryId: string;
  categoryName: string;
  categoryColor?: string;
}

interface TransactionListProps {
  transactions: TransactionItem[];
  onCreate: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TransactionList({ transactions, onCreate, onEdit, onDelete }: TransactionListProps) {
  const totalIncome = transactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const totalExpense = transactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const periodResult = totalIncome - totalExpense;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.kicker}>Mayo 2026</Text>
          <Text style={styles.title}>Movimientos</Text>
        </View>
        <Pressable style={styles.iconButton} onPress={onCreate}>
          <Text style={styles.iconButtonText}>+</Text>
        </Pressable>
      </View>

      {transactions.length > 0 ? (
        <GradientSurface style={styles.periodCard} colors={['#281C59', '#151621', '#070811']}>
          <View style={styles.periodHeader}>
            <Text style={styles.periodLabel}>Resultado del período</Text>
            <Text style={styles.periodAmount}>
              {formatSignedCLP(Math.abs(periodResult), periodResult >= 0 ? 'income' : 'expense')}
            </Text>
          </View>
          <Text style={styles.periodMeta}>
            {transactions.length} movimientos locales · ingresos {formatCLP(totalIncome)} · egresos {formatCLP(totalExpense)}
          </Text>
        </GradientSurface>
      ) : null}

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={transactions.length === 0 ? styles.emptyContainer : styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>Todavía no hay transacciones.</Text>}
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => onEdit(item.id)}>
            <View style={[styles.iconBadge, { backgroundColor: item.categoryColor ?? colors.surfaceSoft }]} />
            <View style={styles.cardContent}>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={styles.meta}>{item.categoryName} · {item.date}</Text>
            </View>
            <View style={styles.amountColumn}>
              <Text style={[styles.amount, item.type === 'income' ? styles.incomeAmount : styles.expenseAmount]}>
                {formatSignedCLP(item.amount, item.type)}
              </Text>
              <Pressable onPress={() => onDelete(item.id)} hitSlop={8}>
                <Text style={styles.deleteText}>Eliminar</Text>
              </Pressable>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.md, paddingBottom: 96, backgroundColor: colors.surface },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  kicker: { color: colors.lime, fontSize: 12, fontWeight: '800', letterSpacing: 1.2, textTransform: 'uppercase' },
  title: { color: colors.textPrimary, fontSize: 30, fontWeight: '800' },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceSoft,
  },
  iconButtonText: { color: colors.textPrimary, fontSize: 28, lineHeight: 30 },
  periodCard: {
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  periodHeader: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm },
  periodLabel: { color: colors.textSecondary, fontSize: 12, fontWeight: '800', textTransform: 'uppercase' },
  periodAmount: { color: colors.success, fontSize: 18, fontWeight: '800' },
  periodMeta: { color: colors.textSecondary, fontSize: 13, marginTop: spacing.xs, lineHeight: 18 },
  listContainer: { paddingBottom: spacing.xl },
  emptyContainer: { flexGrow: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: colors.textSecondary, fontSize: 16 },
  card: {
    minHeight: 72,
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
  iconBadge: { width: 46, height: 46, borderRadius: radius.sm, opacity: 0.45 },
  cardContent: { flex: 1 },
  description: { fontSize: 15, fontWeight: '800', color: colors.textPrimary },
  meta: { marginTop: 4, color: colors.textSecondary, fontSize: 12 },
  amountColumn: { alignItems: 'flex-end', gap: 6 },
  amount: { fontSize: 16, fontWeight: '800' },
  incomeAmount: { color: colors.success },
  expenseAmount: { color: colors.textPrimary },
  deleteText: { color: colors.danger, fontSize: 11, fontWeight: '700' },
});
