import AsyncStorage from '@react-native-async-storage/async-storage';

import { seedDemoDataIfEmpty, DEMO_CATEGORIES, DEMO_TRANSACTIONS } from '../src/storage/demoSeed';
import { STORAGE_KEYS } from '../src/storage/keys';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

const mockedStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('seedDemoDataIfEmpty', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('seeds demo categories and transactions when both stores are empty', async () => {
    mockedStorage.getItem.mockResolvedValueOnce(null).mockResolvedValueOnce(null);

    await expect(seedDemoDataIfEmpty()).resolves.toBe(true);

    expect(mockedStorage.setItem).toHaveBeenCalledWith(STORAGE_KEYS.categories, JSON.stringify(DEMO_CATEGORIES));
    expect(mockedStorage.setItem).toHaveBeenCalledWith(
      STORAGE_KEYS.transactions,
      JSON.stringify(DEMO_TRANSACTIONS),
    );
  });

  it('does not overwrite existing categories', async () => {
    mockedStorage.getItem
      .mockResolvedValueOnce(JSON.stringify([{ id: 'cat-existing', name: 'Existente' }]))
      .mockResolvedValueOnce(null);

    await expect(seedDemoDataIfEmpty()).resolves.toBe(false);

    expect(mockedStorage.setItem).not.toHaveBeenCalled();
  });

  it('does not overwrite existing transactions', async () => {
    mockedStorage.getItem.mockResolvedValueOnce(null).mockResolvedValueOnce(
      JSON.stringify([
        {
          id: 'tx-existing',
          amount: 100,
          type: 'expense',
          description: 'Existente',
          date: '2026-05-16',
          categoryId: 'cat-existing',
        },
      ]),
    );

    await expect(seedDemoDataIfEmpty()).resolves.toBe(false);

    expect(mockedStorage.setItem).not.toHaveBeenCalled();
  });

  it('is idempotent across repeated initialization', async () => {
    mockedStorage.getItem
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(JSON.stringify(DEMO_CATEGORIES))
      .mockResolvedValueOnce(JSON.stringify(DEMO_TRANSACTIONS));

    await expect(seedDemoDataIfEmpty()).resolves.toBe(true);
    await expect(seedDemoDataIfEmpty()).resolves.toBe(false);

    expect(mockedStorage.setItem).toHaveBeenCalledTimes(2);
  });

  it('uses category ids that exist in demo categories', () => {
    const categoryIds = new Set(DEMO_CATEGORIES.map((category) => category.id));

    for (const transaction of DEMO_TRANSACTIONS) {
      expect(categoryIds.has(transaction.categoryId)).toBe(true);
    }
  });
});
