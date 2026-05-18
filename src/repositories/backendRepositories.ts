import { createDefaultCashiApiClient, type CashiApiClient } from '../api/client';
import {
  mapCategoryDomainToCreateDto,
  mapCategoryDomainToUpdateDto,
  mapCategoryDtoToDomain,
  mapMobileIdToBackendId,
  mapTransactionDomainToCreateDto,
  mapTransactionDomainToUpdateDto,
  mapTransactionDtoToDomain,
} from '../api/mappers';
import type { CategoryRepository, TransactionRepository } from './types';

export function createBackendCategoryRepository(client: CashiApiClient = createDefaultCashiApiClient()): CategoryRepository {
  return {
    async getAll() {
      const categories = await client.getCategories();
      return categories.map(mapCategoryDtoToDomain);
    },

    async create(input) {
      const category = await client.createCategory(mapCategoryDomainToCreateDto(input));
      return mapCategoryDtoToDomain(category);
    },

    async update(id, input) {
      const category = await client.updateCategory(mapMobileIdToBackendId(id), mapCategoryDomainToUpdateDto(input));
      return mapCategoryDtoToDomain(category);
    },

    async delete(id) {
      await client.deleteCategory(mapMobileIdToBackendId(id));
    },
  };
}

export function createBackendTransactionRepository(client: CashiApiClient = createDefaultCashiApiClient()): TransactionRepository {
  return {
    async getAll() {
      const transactions = await client.getTransactions();
      return transactions.map(mapTransactionDtoToDomain);
    },

    async create(input) {
      const transaction = await client.createTransaction(mapTransactionDomainToCreateDto(input));
      return mapTransactionDtoToDomain(transaction);
    },

    async update(id, input) {
      const transaction = await client.updateTransaction(mapMobileIdToBackendId(id), mapTransactionDomainToUpdateDto(input));
      return mapTransactionDtoToDomain(transaction);
    },

    async delete(id) {
      await client.deleteTransaction(mapMobileIdToBackendId(id));
    },
  };
}
