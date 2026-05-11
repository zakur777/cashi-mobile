import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';

import { BalanceSummary } from '../../src/components/balance/BalanceSummary';
import { colors } from '../../src/design/tokens';
import { useTransactions } from '../../src/hooks/useTransactions';

export default function BalanceTab() {
  const { totalIncome, totalExpense, balance, loading, error, refresh } = useTransactions();

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  text: { fontSize: 16, color: colors.textPrimary, padding: 16 },
  errorText: { fontSize: 14, color: colors.danger, paddingHorizontal: 16 },
});
