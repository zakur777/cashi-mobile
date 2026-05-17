import { useCallback, useEffect, useMemo, useState } from 'react';

import { CATEGORY_COLORS, type Category, type Transaction, type TransactionType } from '../domain/types';
import { seedDemoDataIfEmpty } from '../storage/demoSeed';
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
      await seedDemoDataIfEmpty();
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
      transactions.map((transaction) => {
        const category = categories.find((item) => item.id === transaction.categoryId);

        return {
          ...transaction,
          categoryName: category?.name ?? 'Sin categoría',
          categoryColor: category?.color ?? CATEGORY_COLORS.lime,
        };
      }),
    [categories, transactions],
  );

  const { totalIncome, totalExpense, balance, primaryExpenseCategory } = useMemo(() => {
    const income = transactions.reduce((acc, transaction) => {
      if (transaction.type !== 'income') {
        return acc;
      }

      return acc + transaction.amount;
    }, 0);

    const expense = transactions.reduce((acc, transaction) => {
      if (transaction.type !== 'expense') {
        return acc;
      }

      return acc + transaction.amount;
    }, 0);

    const expenseByCategory = transactions.reduce<Record<string, number>>((acc, transaction) => {
      if (transaction.type !== 'expense') {
        return acc;
      }

      acc[transaction.categoryId] = (acc[transaction.categoryId] ?? 0) + transaction.amount;
      return acc;
    }, {});

    const [primaryCategoryId, primaryAmount] = Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1])[0] ?? [];
    const primaryCategory = categories.find((category) => category.id === primaryCategoryId);

    return {
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense,
      primaryExpenseCategory: primaryCategoryId && primaryAmount
        ? {
            id: primaryCategoryId,
            name: primaryCategory?.name ?? 'Sin categoría',
            color: primaryCategory?.color ?? CATEGORY_COLORS.lime,
            amount: primaryAmount,
          }
        : null,
    };
  }, [categories, transactions]);

  return {
    transactions,
    transactionsWithCategory,
    loading,
    error,
    totalIncome,
    totalExpense,
    balance,
    primaryExpenseCategory,
    refresh,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  };
}
