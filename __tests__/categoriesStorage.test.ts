import AsyncStorage from '@react-native-async-storage/async-storage';

import { CATEGORY_COLORS, type Category } from '../src/domain/types';
import { categoriesStorage } from '../src/storage/categoriesStorage';
import { STORAGE_KEYS } from '../src/storage/keys';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

const mockedStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('categoriesStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns empty array when key is missing', async () => {
    mockedStorage.getItem.mockResolvedValueOnce(null);

    await expect(categoriesStorage.getAll()).resolves.toEqual([]);
    expect(mockedStorage.getItem).toHaveBeenCalledWith(STORAGE_KEYS.categories);
  });

  it('returns parsed categories when payload exists', async () => {
    const payload: Category[] = [{ id: 'c-1', name: 'Comida', type: 'expense', color: CATEGORY_COLORS.lime }];
    mockedStorage.getItem.mockResolvedValueOnce(JSON.stringify(payload));

    await expect(categoriesStorage.getAll()).resolves.toEqual(payload);
  });

  it('returns empty array when AsyncStorage get fails', async () => {
    mockedStorage.getItem.mockRejectedValueOnce(new Error('read failed'));

    await expect(categoriesStorage.getAll()).resolves.toEqual([]);
  });

  it('saves serialized categories in categories key', async () => {
    const payload: Category[] = [{ id: 'c-2', name: 'Salud', type: 'expense', color: CATEGORY_COLORS.green }];

    await categoriesStorage.saveAll(payload);

    expect(mockedStorage.setItem).toHaveBeenCalledWith(
      STORAGE_KEYS.categories,
      JSON.stringify(payload),
    );
  });
});
