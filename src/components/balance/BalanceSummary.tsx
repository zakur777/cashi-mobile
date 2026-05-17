import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '../../design/tokens';
import { formatCLP } from '../../domain/money';

interface PrimaryExpenseCategory {
  id: string;
  name: string;
  color: string;
  amount: number;
}

interface BalanceSummaryProps {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  primaryExpenseCategory?: PrimaryExpenseCategory | null;
}

export function BalanceSummary({ totalIncome, totalExpense, balance, primaryExpenseCategory }: BalanceSummaryProps) {
  const expenseRatio = totalIncome > 0 ? Math.min(totalExpense / totalIncome, 1) : 0;

  return (
    <View style={styles.container}>
      <View style={styles.heroCard}>
        <View style={styles.heroTopRow}>
          <Text style={styles.heroKicker}>Balance actual</Text>
          <View style={styles.statusPill}>
            <Text style={styles.statusText}>{balance >= 0 ? 'Saludable' : 'Atención'}</Text>
          </View>
        </View>
        <Text style={styles.mainAmount}>{formatCLP(balance)}</Text>
        <Text style={styles.heroHelp}>Resumen local de ingresos, egresos y categoría de mayor gasto.</Text>
      </View>

      <View style={styles.row}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Ingresos</Text>
          <Text style={styles.incomeAmount}>{formatCLP(totalIncome)}</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Egresos</Text>
          <Text style={styles.expenseAmount}>{formatCLP(totalExpense)}</Text>
        </View>
      </View>

      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.metricLabel}>Uso de ingresos</Text>
          <Text style={styles.progressValue}>{Math.round(expenseRatio * 100)}%</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${expenseRatio * 100}%` }]} />
        </View>
      </View>

      {primaryExpenseCategory ? (
        <View style={styles.principalCard}>
          <View style={[styles.principalIcon, { backgroundColor: primaryExpenseCategory.color }]} />
          <View style={styles.principalContent}>
            <Text style={styles.metricLabel}>Categoría principal</Text>
            <Text style={styles.principalName}>{primaryExpenseCategory.name}</Text>
            <Text style={styles.principalHelp}>Mayor gasto del período.</Text>
          </View>
          <Text style={styles.expenseAmount}>{formatCLP(primaryExpenseCategory.amount)}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    gap: spacing.md,
  },
  heroCard: {
    backgroundColor: colors.surfaceStrong,
    borderColor: colors.borderStrong,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  heroTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.sm },
  heroKicker: {
    color: colors.lime,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  statusPill: { borderRadius: radius.pill, backgroundColor: colors.surfaceSoft, paddingHorizontal: spacing.sm, paddingVertical: 5 },
  statusText: { color: colors.success, fontSize: 12, fontWeight: '800' },
  mainAmount: {
    color: colors.textPrimary,
    fontSize: 36,
    fontWeight: '800',
  },
  heroHelp: { color: colors.textSecondary, fontSize: 13, lineHeight: 18 },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.surfaceCard,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  metricLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '800',
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
  },
  incomeAmount: {
    color: colors.success,
    fontWeight: '800',
    fontSize: 18,
  },
  expenseAmount: {
    color: colors.danger,
    fontWeight: '800',
    fontSize: 18,
  },
  progressCard: {
    backgroundColor: colors.surfaceCard,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  progressValue: { color: colors.textPrimary, fontWeight: '800' },
  progressTrack: { height: 10, borderRadius: radius.pill, backgroundColor: colors.surfaceSoft, overflow: 'hidden' },
  progressFill: { height: 10, borderRadius: radius.pill, backgroundColor: colors.secondary },
  principalCard: {
    backgroundColor: colors.surfaceCard,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  principalIcon: { width: 44, height: 44, borderRadius: radius.sm, opacity: 0.75 },
  principalContent: { flex: 1 },
  principalName: { color: colors.textPrimary, fontSize: 18, fontWeight: '800' },
  principalHelp: { color: colors.textSecondary, fontSize: 13 },
});
