import { useCallback, useEffect, useState } from 'react';

import { CATEGORY_COLORS, type Category, type CategoryInput } from '../domain/types';
import { categoriesStorage } from '../storage/categoriesStorage';
import { seedDemoDataIfEmpty } from '../storage/demoSeed';

const normalizeCategory = (category: Category): Category => ({
  ...category,
  type: category.type ?? 'expense',
  color: category.color ?? CATEGORY_COLORS.lime,
});

const buildCategory = (input: CategoryInput): Category => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  ...input,
  name: input.name.trim(),
});

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      await seedDemoDataIfEmpty();
      const items = await categoriesStorage.getAll();
      setCategories(items.map(normalizeCategory));
      setError(null);
    } catch {
      setError('No se pudieron cargar las categorías');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const createCategory = useCallback(async (input: CategoryInput) => {
    const next = [...categories, buildCategory(input)];
    await categoriesStorage.saveAll(next);
    setCategories(next);
    setError(null);
  }, [categories]);

  const updateCategory = useCallback(async (id: string, input: CategoryInput) => {
    const next = categories.map((item) =>
      item.id === id ? { ...item, ...input, name: input.name.trim() } : item,
    );
    await categoriesStorage.saveAll(next);
    setCategories(next);
    setError(null);
  }, [categories]);

  const deleteCategory = useCallback(async (id: string) => {
    const next = categories.filter((item) => item.id !== id);
    await categoriesStorage.saveAll(next);
    setCategories(next);
    setError(null);
  }, [categories]);

  return {
    categories,
    loading,
    error,
    refresh,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
