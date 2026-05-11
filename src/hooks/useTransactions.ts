import { useCallback, useEffect, useMemo, useState } from 'react';

import type { Category, Transaction, TransactionType } from '../domain/types';
import { transactionsStorage } from '../storage/transactionsStorage';

interface TransactionInput {
  amount: number;
  type: TransactionType;
  description: string;
  date: string;
  categoryId: string;
}

interface UseTransactionsOptions {
  categories?: Category[];
}

const buildTransaction = (input: TransactionInput): Transaction => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  ...input,
});

export function useTransactions({ categories = [] }: UseTransactionsOptions = {}) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const items = await transactionsStorage.getAll();
      setTransactions(items);
      setError(null);
    } catch {
      setError('No se pudieron cargar las transacciones');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const createTransaction = useCallback(async (input: TransactionInput) => {
    const next = [...transactions, buildTransaction(input)];
    await transactionsStorage.saveAll(next);
    setTransactions(next);
    setError(null);
  }, [transactions]);

  const updateTransaction = useCallback(async (id: string, input: TransactionInput) => {
    const next = transactions.map((item) => (item.id === id ? { ...item, ...input } : item));
    await transactionsStorage.saveAll(next);
    setTransactions(next);
    setError(null);
  }, [transactions]);

  const deleteTransaction = useCallback(async (id: string) => {
    const next = transactions.filter((item) => item.id !== id);
    await transactionsStorage.saveAll(next);
    setTransactions(next);
    setError(null);
  }, [transactions]);

  const transactionsWithCategory = useMemo(
    () =>
      transactions.map((transaction) => ({
        ...transaction,
        categoryName:
          categories.find((category) => category.id === transaction.categoryId)?.name ?? 'Sin categoría',
      })),
    [categories, transactions],
  );

  return {
    transactions,
    transactionsWithCategory,
    loading,
    error,
    refresh,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  };
}
