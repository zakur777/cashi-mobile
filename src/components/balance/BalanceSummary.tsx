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
  return (
    <View style={styles.container}>
      <View style={styles.mainCard}>
        <Text style={styles.mainLabel}>Balance actual</Text>
        <Text style={styles.mainAmount}>{formatCLP(balance)}</Text>
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

      {primaryExpenseCategory ? (
        <View style={[styles.principalCard, { borderLeftColor: primaryExpenseCategory.color }]}> 
          <View>
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
  mainCard: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  mainLabel: {
    color: colors.textOnPrimary,
    fontSize: 14,
    marginBottom: spacing.xs,
  },
  mainAmount: {
    color: colors.textOnPrimary,
    fontSize: 30,
    fontWeight: '700',
  },
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
    fontSize: 13,
    marginBottom: spacing.xs,
  },
  incomeAmount: {
    color: colors.success,
    fontWeight: '700',
    fontSize: 18,
  },
  expenseAmount: {
    color: colors.danger,
    fontWeight: '700',
    fontSize: 18,
  },
  principalCard: {
    backgroundColor: colors.surfaceCard,
    borderColor: colors.border,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  principalName: { color: colors.textPrimary, fontSize: 18, fontWeight: '700' },
  principalHelp: { color: colors.textSecondary, fontSize: 13 },
});
