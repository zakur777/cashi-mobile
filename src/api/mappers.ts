import { CATEGORY_COLORS, type BalanceSummary, type Category, type CategoryColor, type CategoryInput, type Transaction, type TransactionType } from '../domain/types';
import type {
  BackendBalanceDto,
  BackendCategoryDto,
  BackendTransactionDto,
  CreateCategoryRequestDto,
  CreateTransactionRequestDto,
  UpdateCategoryRequestDto,
  UpdateTransactionRequestDto,
} from './dto';
import { createConfigError } from './errors';

const transactionTypes: TransactionType[] = ['income', 'expense'];
const categoryColors = Object.values(CATEGORY_COLORS) as CategoryColor[];

export function mapMobileIdToBackendId(id: string): number {
  const trimmed = id.trim();
  const parsed = Number(trimmed);

  if (!trimmed || !Number.isSafeInteger(parsed) || parsed <= 0) {
    throw createConfigError('El id no es válido para el backend', { id });
  }

  return parsed;
}

function assertTransactionType(type: TransactionType): TransactionType {
  if (!transactionTypes.includes(type)) {
    throw createConfigError('El tipo de movimiento no es válido', { type });
  }

  return type;
}

function assertCategoryColor(color: CategoryColor): CategoryColor {
  if (!categoryColors.includes(color)) {
    throw createConfigError('El color de categoría no es válido', { color });
  }

  return color;
}

export function mapCategoryDtoToDomain(dto: BackendCategoryDto): Category {
  return {
    id: String(dto.id),
    name: dto.name,
    type: assertTransactionType(dto.type),
    color: assertCategoryColor(dto.color),
  };
}

export function mapCategoryDomainToCreateDto(input: CategoryInput): CreateCategoryRequestDto {
  return {
    name: input.name.trim(),
    type: input.type,
    color: input.color,
  };
}

export function mapCategoryDomainToUpdateDto(input: Partial<CategoryInput>): UpdateCategoryRequestDto {
  return {
    ...(input.name !== undefined ? { name: input.name.trim() } : {}),
    ...(input.type !== undefined ? { type: input.type } : {}),
    ...(input.color !== undefined ? { color: input.color } : {}),
  };
}

export function mapTransactionDtoToDomain(dto: BackendTransactionDto): Transaction {
  return {
    id: String(dto.id),
    amount: dto.amount,
    type: assertTransactionType(dto.type),
    description: dto.description ?? '',
    date: dto.date,
    categoryId: String(dto.categoryId),
  };
}

export function mapTransactionDomainToCreateDto(input: Omit<Transaction, 'id'>): CreateTransactionRequestDto {
  const description = input.description.trim();

  return {
    amount: input.amount,
    type: input.type,
    ...(description ? { description } : {}),
    date: input.date,
    categoryId: mapMobileIdToBackendId(input.categoryId),
  };
}

export function mapTransactionDomainToUpdateDto(input: Partial<Omit<Transaction, 'id'>>): UpdateTransactionRequestDto {
  const description = input.description?.trim();

  return {
    ...(input.amount !== undefined ? { amount: input.amount } : {}),
    ...(input.type !== undefined ? { type: input.type } : {}),
    ...(description ? { description } : {}),
    ...(input.date !== undefined ? { date: input.date } : {}),
    ...(input.categoryId !== undefined ? { categoryId: mapMobileIdToBackendId(input.categoryId) } : {}),
  };
}

export function mapBalanceDtoToDomain(dto: BackendBalanceDto): BalanceSummary {
  return {
    totalIncome: dto.totalIncome,
    totalExpense: dto.totalExpense,
    balance: dto.balance,
  };
}
