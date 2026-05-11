import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';

import { BalanceSummary } from '../../src/components/balance/BalanceSummary';
import { colors, spacing } from '../../src/design/tokens';
import { useTransactions } from '../../src/hooks/useTransactions';

export default function BalanceTab() {
  const { transactions, totalIncome, totalExpense, balance, loading, error, refresh } = useTransactions();

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading ? <Text style={styles.text}>Cargando balance...</Text> : null}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {!loading ? <BalanceSummary totalIncome={totalIncome} totalExpense={totalExpense} balance={balance} /> : null}
      {!loading && transactions.length === 0 ? (
        <Text style={styles.emptyState}>Todavía no hay movimientos para mostrar balance.</Text>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  text: { fontSize: 16, color: colors.textPrimary, padding: spacing.md },
  errorText: { fontSize: 14, color: colors.danger, paddingHorizontal: spacing.md },
  emptyState: {
    fontSize: 14,
    color: colors.textSecondary,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
});
