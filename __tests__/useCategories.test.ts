import { act, renderHook, waitFor } from '@testing-library/react-native';

import { CATEGORY_COLORS } from '../src/domain/types';
import { useCategories } from '../src/hooks/useCategories';
import { categoriesStorage } from '../src/storage/categoriesStorage';

jest.mock('../src/storage/categoriesStorage', () => ({
  categoriesStorage: {
    getAll: jest.fn(),
    saveAll: jest.fn(),
  },
}));

jest.mock('../src/storage/demoSeed', () => ({
  seedDemoDataIfEmpty: jest.fn().mockResolvedValue(false),
}));

const mockedCategoriesStorage = categoriesStorage as jest.Mocked<typeof categoriesStorage>;

describe('useCategories', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads categories on mount', async () => {
    mockedCategoriesStorage.getAll.mockResolvedValueOnce([
      { id: '1', name: 'Comida', type: 'expense', color: CATEGORY_COLORS.lime },
    ]);

    const { result } = renderHook(() => useCategories());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.categories).toEqual([
      { id: '1', name: 'Comida', type: 'expense', color: CATEGORY_COLORS.lime },
    ]);
    expect(result.current.error).toBeNull();
  });

  it('applies safe defaults for legacy categories', async () => {
    mockedCategoriesStorage.getAll.mockResolvedValueOnce([{ id: 'legacy-1', name: 'Legacy' } as never]);

    const { result } = renderHook(() => useCategories());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.categories).toEqual([
      { id: 'legacy-1', name: 'Legacy', type: 'expense', color: CATEGORY_COLORS.lime },
    ]);
  });

  it('creates a category and persists the new list', async () => {
    mockedCategoriesStorage.getAll.mockResolvedValueOnce([]);
    mockedCategoriesStorage.saveAll.mockResolvedValueOnce();

    const { result } = renderHook(() => useCategories());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.createCategory({ name: 'Hogar', type: 'expense', color: CATEGORY_COLORS.teal });
    });

    expect(result.current.categories).toHaveLength(1);
    expect(result.current.categories[0].name).toBe('Hogar');
    expect(result.current.categories[0].type).toBe('expense');
    expect(result.current.categories[0].color).toBe(CATEGORY_COLORS.teal);
    expect(mockedCategoriesStorage.saveAll).toHaveBeenCalledTimes(1);
  });

  it('updates and deletes an existing category', async () => {
    mockedCategoriesStorage.getAll.mockResolvedValueOnce([
      { id: '1', name: 'Comida', type: 'expense', color: CATEGORY_COLORS.lime },
    ]);
    mockedCategoriesStorage.saveAll.mockResolvedValue();

    const { result } = renderHook(() => useCategories());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.updateCategory('1', {
        name: 'Supermercado',
        type: 'expense',
        color: CATEGORY_COLORS.lime,
      });
    });

    expect(result.current.categories).toEqual([
      { id: '1', name: 'Supermercado', type: 'expense', color: CATEGORY_COLORS.lime },
    ]);

    await act(async () => {
      await result.current.deleteCategory('1');
    });

    expect(result.current.categories).toEqual([]);
    expect(mockedCategoriesStorage.saveAll).toHaveBeenCalledTimes(2);
  });
});
