import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '../../design/tokens';

interface BalanceSummaryProps {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

const formatMoney = (amount: number) => `$${amount.toFixed(2)}`;

export function BalanceSummary({ totalIncome, totalExpense, balance }: BalanceSummaryProps) {
  return (
    <View style={styles.container}>
      <View style={styles.mainCard}>
        <Text style={styles.mainLabel}>Balance actual</Text>
        <Text style={styles.mainAmount}>{formatMoney(balance)}</Text>
      </View>

      <View style={styles.row}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Ingresos</Text>
          <Text style={styles.incomeAmount}>{`+${formatMoney(totalIncome)}`}</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Egresos</Text>
          <Text style={styles.expenseAmount}>{`-${formatMoney(totalExpense)}`}</Text>
        </View>
      </View>
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
});
