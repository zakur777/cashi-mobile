import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BalanceSummary } from '../../src/components/balance/BalanceSummary';
import { AppBackground } from '../../src/components/ui/AppBackground';
import { colors, spacing } from '../../src/design/tokens';
import { useCategories } from '../../src/hooks/useCategories';
import { useAuth } from '../../src/hooks/useAuth';
import { useTransactions } from '../../src/hooks/useTransactions';

export default function BalanceTab() {
  const router = useRouter();
  const auth = useAuth();
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
        <View style={styles.headerRow}>
          <Text style={styles.text}>Balance</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              void auth.logout().then(() => router.replace('/'));
            }}
            style={styles.logoutButton}
          >
            <Text style={styles.logoutText}>Cerrar sesión</Text>
          </Pressable>
        </View>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  text: { fontSize: 16, color: colors.textPrimary, padding: spacing.md },
  logoutButton: { paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
  logoutText: { color: colors.lime, fontSize: 13, fontWeight: '700' },
  errorText: { fontSize: 14, color: colors.danger, paddingHorizontal: spacing.md },
  emptyState: {
    fontSize: 14,
    color: colors.textSecondary,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
});
