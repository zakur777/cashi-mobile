import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, touchTarget } from '../../design/tokens';
import type { Category } from '../../domain/types';

interface CategoryListProps {
  categories: Category[];
  onCreate: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function CategoryList({ categories, onCreate, onEdit, onDelete }: CategoryListProps) {
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
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <View style={styles.actionsRow}>
              <Pressable style={styles.actionButton} onPress={() => onEdit(item.id)}>
                <Text style={styles.actionText}>Editar</Text>
              </Pressable>
              <Pressable style={[styles.actionButton, styles.deleteButton]} onPress={() => onDelete(item.id)}>
                <Text style={styles.actionText}>Eliminar</Text>
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
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  name: { fontSize: 16, fontWeight: '600', marginBottom: 10, color: colors.textPrimary },
  actionsRow: { flexDirection: 'row', gap: 8 },
  actionButton: {
    flex: 1,
    borderRadius: radius.sm,
    backgroundColor: colors.secondary,
    minHeight: touchTarget.minHeight,
    justifyContent: 'center',
  },
  deleteButton: { backgroundColor: colors.danger },
  actionText: { color: colors.textOnPrimary, textAlign: 'center', fontWeight: '600' },
});
