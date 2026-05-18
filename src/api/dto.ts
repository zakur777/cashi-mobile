import type { CategoryColor, TransactionType } from '../domain/types';

export interface HealthDto {
  status: 'ok';
}

export interface BackendCategoryDto {
  id: number;
  name: string;
  type: TransactionType;
  color: CategoryColor;
}

export interface CreateCategoryRequestDto {
  name: string;
  type: TransactionType;
  color: CategoryColor;
}

export type UpdateCategoryRequestDto = Partial<CreateCategoryRequestDto>;

export interface BackendTransactionDto {
  id: number;
  amount: number;
  type: TransactionType;
  description: string | null;
  date: string;
  categoryId: number;
  category: BackendCategoryDto;
}

export interface CreateTransactionRequestDto {
  amount: number;
  type: TransactionType;
  description?: string;
  date: string;
  categoryId: number;
}

export type UpdateTransactionRequestDto = Partial<CreateTransactionRequestDto>;

export interface BackendBalanceDto {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export interface BackendErrorDto {
  error?: string;
  message?: string;
  issues?: unknown;
  errors?: unknown;
}
