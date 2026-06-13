import type { CategoryColor, TransactionType } from '../domain/types';

export interface HealthDto {
  status: 'ok';
}

export interface AuthRequestDto {
  email: string;
  password: string;
}

export interface AuthResponseDto {
  token: string;
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
  imageUrl?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface CreateTransactionRequestDto {
  amount: number;
  type: TransactionType;
  description?: string;
  date: string;
  categoryId: number;
  imageUrl?: string;
  latitude?: number;
  longitude?: number;
}

export type UpdateTransactionRequestDto = Partial<CreateTransactionRequestDto>;

export interface BackendBalanceDto {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export interface ReceiptUploadFileDto {
  uri: string;
  name: string;
  type: string;
}

export interface ReceiptUploadResponseDto {
  imageUrl: string;
}

export interface BackendErrorDto {
  error?: string;
  message?: string;
  issues?: unknown;
  errors?: unknown;
}
