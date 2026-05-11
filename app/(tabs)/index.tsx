import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';

import { colors, spacing } from '../../src/design/tokens';
import { TransactionList } from '../../src/components/transactions/TransactionList';
import { useCategories } from '../../src/hooks/useCategories';
import { useTransactions } from '../../src/hooks/useTransactions';

export default function TransactionsTab() {
  const router = useRouter();
  const { categories, refresh: refreshCategories } = useCategories();
  const { transactionsWithCategory, loading, error, refresh, deleteTransaction } = useTransactions({ categories });

  useFocusEffect(
    useCallback(() => {
      void refreshCategories();
      void refresh();
    }, [refresh, refreshCategories]),
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading ? <Text style={styles.stateText}>Cargando transacciones...</Text> : null}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {!loading ? (
        <TransactionList
          transactions={transactionsWithCategory}
          onCreate={() => router.push('/(tabs)/transaction/new')}
          onEdit={(id) => router.push(`/(tabs)/transaction/${id}`)}
          onDelete={(id) => {
            void deleteTransaction(id);
          }}
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  stateText: { paddingHorizontal: spacing.md, paddingTop: spacing.md, color: colors.textSecondary },
  errorText: { paddingHorizontal: spacing.md, paddingTop: spacing.xs, color: colors.danger },
});
