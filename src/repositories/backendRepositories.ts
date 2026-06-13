import { createDefaultCashiApiClient, type CashiApiClient } from '../api/client';
import {
  mapBalanceDtoToDomain,
  mapCategoryDomainToCreateDto,
  mapCategoryDomainToUpdateDto,
  mapCategoryDtoToDomain,
  mapMobileIdToBackendId,
  mapTransactionDomainToCreateDto,
  mapTransactionDomainToUpdateDto,
  mapTransactionDtoToDomain,
} from '../api/mappers';
import type { CategoryRepository, TransactionRepository } from './types';

const RECEIPT_FILE_NAME = 'receipt.jpg';
const RECEIPT_FILE_TYPE = 'image/jpeg';

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

    async getBalance() {
      return mapBalanceDtoToDomain(await client.getBalance());
    },

    async create(input) {
      const imageUrl = input.photoUri
        ? (await client.uploadReceipt({ uri: input.photoUri, name: RECEIPT_FILE_NAME, type: RECEIPT_FILE_TYPE })).imageUrl
        : input.imageUrl;
      const transaction = await client.createTransaction(mapTransactionDomainToCreateDto({ ...input, ...(imageUrl ? { imageUrl } : {}) }));
      return mapTransactionDtoToDomain(transaction);
    },

    async update(id, input) {
      const imageUrl = input.photoUri
        ? (await client.uploadReceipt({ uri: input.photoUri, name: RECEIPT_FILE_NAME, type: RECEIPT_FILE_TYPE })).imageUrl
        : input.imageUrl;
      const transaction = await client.updateTransaction(mapMobileIdToBackendId(id), mapTransactionDomainToUpdateDto({ ...input, ...(imageUrl ? { imageUrl } : {}) }));
      return mapTransactionDtoToDomain(transaction);
    },

    async delete(id) {
      await client.deleteTransaction(mapMobileIdToBackendId(id));
    },
  };
}
