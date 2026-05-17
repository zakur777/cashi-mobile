import { useCallback, useEffect, useState } from 'react';

import type { Category } from '../domain/types';
import { categoriesStorage } from '../storage/categoriesStorage';
import { seedDemoDataIfEmpty } from '../storage/demoSeed';

const buildCategory = (name: string): Category => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  name: name.trim(),
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
      setCategories(items);
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

  const createCategory = useCallback(async (name: string) => {
    const next = [...categories, buildCategory(name)];
    await categoriesStorage.saveAll(next);
    setCategories(next);
    setError(null);
  }, [categories]);

  const updateCategory = useCallback(async (id: string, name: string) => {
    const next = categories.map((item) =>
      item.id === id ? { ...item, name: name.trim() } : item,
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
