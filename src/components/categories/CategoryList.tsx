import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, touchTarget } from '../../design/tokens';
import { formatSignedCLP } from '../../domain/money';
import type { Category, Transaction } from '../../domain/types';

interface CategoryListProps {
  categories: Category[];
  transactions?: Transaction[];
  onCreate: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const getCategorySummary = (category: Category, transactions: Transaction[]) => {
  const related = transactions.filter((transaction) => transaction.categoryId === category.id);
  const total = related.reduce((sum, transaction) => sum + transaction.amount, 0);

  return `${related.length} movimiento${related.length === 1 ? '' : 's'} · ${formatSignedCLP(total, category.type)}`;
};

export function CategoryList({ categories, transactions = [], onCreate, onEdit, onDelete }: CategoryListProps) {
  return (
    <View style={styles.container}>
      <Pressable style={styles.createButton} onPress={onCreate}>
        <Text style={styles.createButtonText}>Nueva categoría</Text>
      </Pressable>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        contentContainerStyle={categories.length === 0 ? styles.emptyContainer : styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>Todavía no hay categorías.</Text>}
        renderItem={({ item }) => (
          <View style={[styles.card, { borderLeftColor: item.color }]}> 
            <View style={[styles.iconBadge, { backgroundColor: item.color }]} />
            <View style={styles.content}>
              <Text style={styles.type}>{item.type === 'income' ? 'Ingreso' : 'Egreso'}</Text>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.meta}>{getCategorySummary(item, transactions)}</Text>
            </View>
            <View style={styles.actionsColumn}>
              <Pressable onPress={() => onEdit(item.id)}>
                <Text style={styles.editText}>Editar</Text>
              </Pressable>
              <Pressable onPress={() => onDelete(item.id)}>
                <Text style={styles.deleteText}>Eliminar</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.md, backgroundColor: colors.surface },
  createButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    minHeight: touchTarget.minHeight,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    justifyContent: 'center',
  },
  createButtonText: { color: colors.textOnPrimary, fontWeight: '600', textAlign: 'center' },
  listContainer: { paddingBottom: spacing.md },
  emptyContainer: { flexGrow: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: colors.textSecondary, fontSize: 16 },
  card: {
    borderWidth: 1,
    borderLeftWidth: 4,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: 12,
    backgroundColor: colors.surfaceCard,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconBadge: { width: 34, height: 34, borderRadius: radius.md, opacity: 0.8 },
  content: { flex: 1 },
  type: { color: colors.secondary, fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  name: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  meta: { color: colors.textSecondary, fontSize: 12, marginTop: 4 },
  actionsColumn: { gap: spacing.xs, alignItems: 'flex-end' },
  editText: { color: colors.secondary, fontWeight: '700' },
  deleteText: { color: colors.danger, fontWeight: '700' },
});
