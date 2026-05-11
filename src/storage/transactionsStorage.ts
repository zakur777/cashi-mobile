import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Transaction } from '../domain/types';
import { STORAGE_KEYS } from './keys';

export const transactionsStorage = {
  async getAll(): Promise<Transaction[]> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEYS.transactions);
      if (!raw) {
        return [];
      }

      const parsed = JSON.parse(raw) as Transaction[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  async saveAll(items: Transaction[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify(items));
  },
};
