import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Transaction } from '../src/domain/types';
import { transactionsStorage } from '../src/storage/transactionsStorage';
import { STORAGE_KEYS } from '../src/storage/keys';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

const mockedAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('transactionsStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns empty array when key has no data', async () => {
    mockedAsyncStorage.getItem.mockResolvedValueOnce(null);

    const result = await transactionsStorage.getAll();

    expect(result).toEqual([]);
    expect(mockedAsyncStorage.getItem).toHaveBeenCalledWith(STORAGE_KEYS.transactions);
  });

  it('returns parsed transactions when storage has data', async () => {
    const stored: Transaction[] = [
      {
        id: 'tx-1',
        amount: 1200,
        type: 'income',
        description: 'Sueldo',
        date: '2026-05-11',
        categoryId: 'cat-1',
      },
    ];
    mockedAsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(stored));

    const result = await transactionsStorage.getAll();

    expect(result).toEqual(stored);
  });

  it('returns empty array on JSON parse error', async () => {
    mockedAsyncStorage.getItem.mockResolvedValueOnce('not-json');

    const result = await transactionsStorage.getAll();

    expect(result).toEqual([]);
  });

  it('persists transactions using transactions key', async () => {
    const payload: Transaction[] = [
      {
        id: 'tx-2',
        amount: 300,
        type: 'expense',
        description: 'Taxi',
        date: '2026-05-10',
        categoryId: 'cat-2',
      },
    ];

    await transactionsStorage.saveAll(payload);

    expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith(
      STORAGE_KEYS.transactions,
      JSON.stringify(payload),
    );
  });
});
