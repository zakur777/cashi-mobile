import { act, renderHook, waitFor } from '@testing-library/react-native';

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
    mockedCategoriesStorage.getAll.mockResolvedValueOnce([{ id: '1', name: 'Comida' }]);

    const { result } = renderHook(() => useCategories());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.categories).toEqual([{ id: '1', name: 'Comida' }]);
    expect(result.current.error).toBeNull();
  });

  it('creates a category and persists the new list', async () => {
    mockedCategoriesStorage.getAll.mockResolvedValueOnce([]);
    mockedCategoriesStorage.saveAll.mockResolvedValueOnce();

    const { result } = renderHook(() => useCategories());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.createCategory('Hogar');
    });

    expect(result.current.categories).toHaveLength(1);
    expect(result.current.categories[0].name).toBe('Hogar');
    expect(mockedCategoriesStorage.saveAll).toHaveBeenCalledTimes(1);
  });

  it('updates and deletes an existing category', async () => {
    mockedCategoriesStorage.getAll.mockResolvedValueOnce([{ id: '1', name: 'Comida' }]);
    mockedCategoriesStorage.saveAll.mockResolvedValue();

    const { result } = renderHook(() => useCategories());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.updateCategory('1', 'Supermercado');
    });

    expect(result.current.categories).toEqual([{ id: '1', name: 'Supermercado' }]);

    await act(async () => {
      await result.current.deleteCategory('1');
    });

    expect(result.current.categories).toEqual([]);
    expect(mockedCategoriesStorage.saveAll).toHaveBeenCalledTimes(2);
  });
});
