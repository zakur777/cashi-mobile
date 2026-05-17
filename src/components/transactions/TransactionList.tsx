import { Ionicons } from '@expo/vector-icons';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { GradientSurface } from '../ui/GradientSurface';
import {
  colors,
  componentSizes,
  layout,
  radius,
  spacing,
  typography,
} from '../../design/tokens';
import { formatCLP, formatSignedCLP } from '../../domain/money';
import { CATEGORY_COLORS, type TransactionType } from '../../domain/types';

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

const purpleIconColor = '#C9C4FF';

const getVisibleCategoryIconColor = (color?: string) =>
  color === CATEGORY_COLORS.purple ? purpleIconColor : (color ?? colors.lime);

export function TransactionList({
  transactions,
  onCreate,
  onEdit,
  onDelete,
}: TransactionListProps) {
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
        <Pressable
          accessibilityRole='button'
          accessibilityLabel='Agregar movimiento'
          style={styles.iconButton}
          onPress={onCreate}
        >
          <Text style={styles.iconButtonText}>＋</Text>
        </Pressable>
      </View>

      {transactions.length > 0 ? (
        <GradientSurface
          style={styles.periodCard}
          colors={['#281C59', '#151621', '#070811']}
        >
          <View style={styles.periodHeader}>
            <Text style={styles.periodLabel}>Resultado del período</Text>
            <Text style={styles.periodAmount}>
              {formatSignedCLP(
                Math.abs(periodResult),
                periodResult >= 0 ? 'income' : 'expense',
              )}
            </Text>
          </View>
          <Text style={styles.periodMeta}>
            {transactions.length} movimientos locales · ingresos{' '}
            {formatCLP(totalIncome)} · egresos {formatCLP(totalExpense)}
          </Text>
        </GradientSurface>
      ) : null}

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={
          transactions.length === 0
            ? styles.emptyContainer
            : styles.listContainer
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>Todavía no hay transacciones.</Text>
        }
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole='button'
            accessibilityLabel={`Editar ${item.description}`}
            style={styles.card}
            onPress={() => onEdit(item.id)}
          >
            <View style={styles.iconBadge}>
              <Ionicons
                name={
                  item.type === 'income'
                    ? 'card-outline'
                    : item.categoryName.toLowerCase().includes('comida')
                      ? 'bag-outline'
                      : 'briefcase-outline'
                }
                size={18}
                color={getVisibleCategoryIconColor(item.categoryColor)}
              />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={styles.meta}>
                {item.categoryName} · {item.date}
              </Text>
            </View>
            <View style={styles.amountColumn}>
              <Text
                style={[
                  styles.amount,
                  item.type === 'income'
                    ? styles.incomeAmount
                    : styles.expenseAmount,
                ]}
              >
                {formatSignedCLP(item.amount, item.type)}
              </Text>
              <Pressable
                accessibilityRole='button'
                accessibilityLabel={`Eliminar ${item.description}`}
                onPress={() => onDelete(item.id)}
                hitSlop={8}
              >
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
  container: {
    flex: 1,
    padding: layout.screenPadding,
    paddingBottom: 96,
    backgroundColor: 'transparent',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  kicker: {
    color: colors.lime,
    fontFamily: typography.bodyBold,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.textPrimary,
    fontFamily: typography.display,
    fontSize: 30,
    fontWeight: '800',
  },
  iconButton: {
    width: componentSizes.iconButton,
    height: componentSizes.iconButton,
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
  periodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  periodLabel: {
    color: colors.textSecondary,
    fontFamily: typography.bodyBold,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  periodAmount: {
    color: colors.success,
    fontFamily: typography.bodyBold,
    fontSize: 18,
    fontWeight: '800',
  },
  periodMeta: {
    color: colors.textSecondary,
    fontFamily: typography.body,
    fontSize: 13,
    marginTop: spacing.xs,
    lineHeight: 18,
  },
  listContainer: { paddingBottom: spacing.xl },
  emptyContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: { color: colors.textSecondary, fontSize: 16 },
  card: {
    minHeight: componentSizes.listRowMinHeight,
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
  iconBadge: {
    width: componentSizes.listIcon,
    height: componentSizes.listIcon,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.055)',
  },
  cardContent: { flex: 1 },
  description: {
    fontFamily: typography.bodyBold,
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  meta: {
    marginTop: 4,
    color: colors.textSecondary,
    fontFamily: typography.body,
    fontSize: 12,
    lineHeight: 17,
  },
  amountColumn: { alignItems: 'flex-end', gap: 6 },
  amount: { fontFamily: typography.bodyBold, fontSize: 16, fontWeight: '800' },
  incomeAmount: { color: colors.success },
  expenseAmount: { color: colors.textPrimary },
  deleteText: { color: colors.danger, fontSize: 11, fontWeight: '700' },
});
