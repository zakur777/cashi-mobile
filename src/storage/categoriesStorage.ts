import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Category } from '../domain/types';
import { STORAGE_KEYS } from './keys';

export const categoriesStorage = {
  async getAll(): Promise<Category[]> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEYS.categories);
      if (!raw) {
        return [];
      }

      const parsed = JSON.parse(raw) as Category[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  async saveAll(items: Category[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.categories, JSON.stringify(items));
  },
};
