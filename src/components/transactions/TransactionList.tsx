import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, touchTarget } from '../../design/tokens';
import type { TransactionType } from '../../domain/types';

interface TransactionItem {
  id: string;
  amount: number;
  type: TransactionType;
  description: string;
  date: string;
  categoryId: string;
  categoryName: string;
}

interface TransactionListProps {
  transactions: TransactionItem[];
  onCreate: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const formatAmount = (amount: number, type: TransactionType) => `${type === 'income' ? '+' : '-'}$${amount.toFixed(2)}`;

export function TransactionList({ transactions, onCreate, onEdit, onDelete }: TransactionListProps) {
  return (
    <View style={styles.container}>
      <Pressable style={styles.createButton} onPress={onCreate}>
        <Text style={styles.createButtonText}>Nueva transacción</Text>
      </Pressable>

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={transactions.length === 0 ? styles.emptyContainer : styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>Todavía no hay transacciones.</Text>}
        renderItem={({ item }) => {
          const typeLabel = item.type === 'income' ? 'Ingreso' : 'Egreso';
          return (
            <View style={styles.card}>
              <View style={styles.mainRow}>
                <Text style={styles.amount}>{formatAmount(item.amount, item.type)}</Text>
                <Text style={[styles.typeBadge, item.type === 'income' ? styles.incomeBadge : styles.expenseBadge]}>
                  {typeLabel}
                </Text>
              </View>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={styles.meta}>Categoría: {item.categoryName}</Text>
              <Text style={styles.meta}>Fecha: {item.date}</Text>

              <View style={styles.actionsRow}>
                <Pressable style={styles.actionButton} onPress={() => onEdit(item.id)}>
                  <Text style={styles.actionText}>Editar</Text>
                </Pressable>
                <Pressable style={[styles.actionButton, styles.deleteButton]} onPress={() => onDelete(item.id)}>
                  <Text style={styles.actionText}>Eliminar</Text>
                </Pressable>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.md, backgroundColor: colors.surface },
  createButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    minHeight: touchTarget.minHeight,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    justifyContent: 'center',
  },
  createButtonText: { color: colors.textOnPrimary, fontWeight: '700', textAlign: 'center' },
  listContainer: { paddingBottom: 20 },
  emptyContainer: { flexGrow: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: colors.textSecondary, fontSize: 16 },
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.sm,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  mainRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  amount: { fontSize: 24, fontWeight: '700', color: colors.textPrimary },
  typeBadge: { fontSize: 12, fontWeight: '700', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  incomeBadge: { backgroundColor: colors.success, color: colors.primary },
  expenseBadge: { backgroundColor: colors.dangerSoft, color: colors.danger },
  description: { marginTop: 10, fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  meta: { marginTop: 4, color: colors.textSecondary, fontSize: 14 },
  actionsRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
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
