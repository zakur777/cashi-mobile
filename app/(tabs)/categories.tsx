import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';

import { CategoryList } from '../../src/components/categories/CategoryList';
import { colors, spacing } from '../../src/design/tokens';
import { useCategories } from '../../src/hooks/useCategories';
import { useTransactions } from '../../src/hooks/useTransactions';

export default function CategoriesTab() {
  const router = useRouter();
  const { categories, loading, error, refresh, deleteCategory } = useCategories();
  const { transactions, refresh: refreshTransactions } = useTransactions({ categories });

  useFocusEffect(
    useCallback(() => {
      void refresh();
      void refreshTransactions();
    }, [refresh, refreshTransactions]),
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading ? <Text style={styles.stateText}>Cargando categorías...</Text> : null}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {!loading ? (
        <CategoryList
          categories={categories}
          transactions={transactions}
          onCreate={() => router.push('/(tabs)/category/new')}
          onEdit={(id) => router.push(`/(tabs)/category/${id}`)}
          onDelete={(id) => {
            void deleteCategory(id);
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
