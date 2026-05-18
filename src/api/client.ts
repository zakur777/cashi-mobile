import { normalizeApiBaseUrl, requireApiBaseUrl } from './config';
import type {
  BackendBalanceDto,
  BackendCategoryDto,
  BackendTransactionDto,
  CreateCategoryRequestDto,
  CreateTransactionRequestDto,
  HealthDto,
  UpdateCategoryRequestDto,
  UpdateTransactionRequestDto,
} from './dto';
import { createHttpError, createNetworkError, createParseError } from './errors';

export interface CashiApiClientOptions {
  baseUrl: string;
  fetchImpl?: typeof fetch;
}

export interface CashiApiClient {
  health(): Promise<HealthDto>;
  getCategories(): Promise<BackendCategoryDto[]>;
  getCategory(id: number): Promise<BackendCategoryDto>;
  createCategory(input: CreateCategoryRequestDto): Promise<BackendCategoryDto>;
  updateCategory(id: number, input: UpdateCategoryRequestDto): Promise<BackendCategoryDto>;
  deleteCategory(id: number): Promise<BackendCategoryDto>;
  getTransactions(): Promise<BackendTransactionDto[]>;
  getTransaction(id: number): Promise<BackendTransactionDto>;
  createTransaction(input: CreateTransactionRequestDto): Promise<BackendTransactionDto>;
  updateTransaction(id: number, input: UpdateTransactionRequestDto): Promise<BackendTransactionDto>;
  deleteTransaction(id: number): Promise<BackendTransactionDto>;
  getBalance(): Promise<BackendBalanceDto>;
}

type JsonMethod = 'POST' | 'PATCH';
type RequestMethod = 'GET' | 'DELETE' | JsonMethod;

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

interface ApiRequestOptions {
  method?: RequestMethod;
  body?: unknown;
}

function createHeaders(hasBody: boolean): Record<string, string> {
  return hasBody
    ? { Accept: 'application/json', 'Content-Type': 'application/json' }
    : { Accept: 'application/json' };
}

function joinPath(baseUrl: string, path: string) {
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

async function parseJson<T>(response: Response): Promise<T> {
  try {
    return (await response.json()) as T;
  } catch (error) {
    throw createParseError(error);
  }
}

export function createCashiApiClient({ baseUrl, fetchImpl = globalThis.fetch }: CashiApiClientOptions): CashiApiClient {
  const normalizedBaseUrl = normalizeApiBaseUrl(baseUrl);
  const request = async <T>(path: string, options: ApiRequestOptions = {}): Promise<T> => {
    const method = options.method ?? 'GET';
    const hasBody = options.body !== undefined;
    let response: Response;

    try {
      response = await (fetchImpl as FetchLike)(joinPath(normalizedBaseUrl, path), {
        method,
        headers: createHeaders(hasBody),
        ...(hasBody ? { body: JSON.stringify(options.body) } : {}),
      });
    } catch (error) {
      throw createNetworkError(error);
    }

    if (!response.ok) {
      let details: unknown;
      try {
        details = await response.json();
      } catch {
        details = undefined;
      }
      throw createHttpError(response.status, details);
    }

    return parseJson<T>(response);
  };

  return {
    health: () => request<HealthDto>('/health'),
    getCategories: () => request<BackendCategoryDto[]>('/categories'),
    getCategory: (id) => request<BackendCategoryDto>(`/categories/${id}`),
    createCategory: (input) => request<BackendCategoryDto>('/categories', { method: 'POST', body: input }),
    updateCategory: (id, input) => request<BackendCategoryDto>(`/categories/${id}`, { method: 'PATCH', body: input }),
    deleteCategory: (id) => request<BackendCategoryDto>(`/categories/${id}`, { method: 'DELETE' }),
    getTransactions: () => request<BackendTransactionDto[]>('/transactions'),
    getTransaction: (id) => request<BackendTransactionDto>(`/transactions/${id}`),
    createTransaction: (input) => request<BackendTransactionDto>('/transactions', { method: 'POST', body: input }),
    updateTransaction: (id, input) => request<BackendTransactionDto>(`/transactions/${id}`, { method: 'PATCH', body: input }),
    deleteTransaction: (id) => request<BackendTransactionDto>(`/transactions/${id}`, { method: 'DELETE' }),
    getBalance: () => request<BackendBalanceDto>('/transactions/balance'),
  };
}

export function createDefaultCashiApiClient(fetchImpl?: typeof fetch): CashiApiClient {
  return createCashiApiClient({ baseUrl: requireApiBaseUrl(), fetchImpl });
}
