import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';

import { BalanceSummary } from '../../src/components/balance/BalanceSummary';
import { AppBackground } from '../../src/components/ui/AppBackground';
import { colors, spacing } from '../../src/design/tokens';
import { useCategories } from '../../src/hooks/useCategories';
import { useTransactions } from '../../src/hooks/useTransactions';

export default function BalanceTab() {
  const { categories, refresh: refreshCategories } = useCategories();
  const {
    transactions,
    totalIncome,
    totalExpense,
    balance,
    primaryExpenseCategory,
    loading,
    error,
    refresh,
  } = useTransactions({ categories });

  useFocusEffect(
    useCallback(() => {
      void refreshCategories();
      void refresh();
    }, [refresh, refreshCategories]),
  );

  return (
    <AppBackground>
      <SafeAreaView style={styles.container}>
        {loading ? <Text style={styles.text}>Cargando balance...</Text> : null}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {!loading ? (
          <BalanceSummary
            totalIncome={totalIncome}
            totalExpense={totalExpense}
            balance={balance}
            primaryExpenseCategory={primaryExpenseCategory}
          />
        ) : null}
        {!loading && transactions.length === 0 ? (
          <Text style={styles.emptyState}>Todavía no hay movimientos para mostrar balance.</Text>
        ) : null}
      </SafeAreaView>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  text: { fontSize: 16, color: colors.textPrimary, padding: spacing.md },
  errorText: { fontSize: 14, color: colors.danger, paddingHorizontal: spacing.md },
  emptyState: {
    fontSize: 14,
    color: colors.textSecondary,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
});
