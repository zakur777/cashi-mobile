import { act, renderHook, waitFor } from '@testing-library/react-native';

import type { Category, Transaction } from '../src/domain/types';
import { useTransactions } from '../src/hooks/useTransactions';
import { transactionsStorage } from '../src/storage/transactionsStorage';

jest.mock('../src/storage/transactionsStorage', () => ({
  transactionsStorage: {
    getAll: jest.fn(),
    saveAll: jest.fn(),
  },
}));

const mockedTransactionsStorage = transactionsStorage as jest.Mocked<typeof transactionsStorage>;

describe('useTransactions', () => {
  const categories: Category[] = [
    { id: 'cat-1', name: 'Salario' },
    { id: 'cat-2', name: 'Comida' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads transactions and exposes category name for display', async () => {
    const seed: Transaction[] = [
      {
        id: 'tx-1',
        amount: 1500,
        type: 'income',
        description: 'Sueldo',
        date: '2026-05-11',
        categoryId: 'cat-1',
      },
    ];
    mockedTransactionsStorage.getAll.mockResolvedValueOnce(seed);

    const { result } = renderHook(() => useTransactions({ categories }));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.transactions).toEqual(seed);
    expect(result.current.transactionsWithCategory[0].categoryName).toBe('Salario');
  });

  it('creates, updates and deletes a transaction while persisting', async () => {
    mockedTransactionsStorage.getAll.mockResolvedValueOnce([]);
    mockedTransactionsStorage.saveAll.mockResolvedValue();

    const { result } = renderHook(() => useTransactions({ categories }));
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.createTransaction({
        amount: 350,
        type: 'expense',
        description: 'Supermercado',
        date: '2026-05-12',
        categoryId: 'cat-2',
      });
    });

    expect(result.current.transactions).toHaveLength(1);
    const createdId = result.current.transactions[0].id;

    await act(async () => {
      await result.current.updateTransaction(createdId, {
        amount: 370,
        type: 'expense',
        description: 'Supermercado extra',
        date: '2026-05-13',
        categoryId: 'cat-2',
      });
    });

    expect(result.current.transactions[0].amount).toBe(370);
    expect(result.current.transactions[0].description).toBe('Supermercado extra');

    await act(async () => {
      await result.current.deleteTransaction(createdId);
    });

    expect(result.current.transactions).toEqual([]);
    expect(mockedTransactionsStorage.saveAll).toHaveBeenCalledTimes(3);
  });

  it('returns fallback category name when relation is missing', async () => {
    mockedTransactionsStorage.getAll.mockResolvedValueOnce([
      {
        id: 'tx-7',
        amount: 90,
        type: 'expense',
        description: 'Peaje',
        date: '2026-05-10',
        categoryId: 'cat-404',
      },
    ]);

    const { result } = renderHook(() => useTransactions({ categories }));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.transactionsWithCategory[0].categoryName).toBe('Sin categoría');
  });
});
