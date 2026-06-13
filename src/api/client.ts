import { normalizeApiBaseUrl, requireApiBaseUrl } from './config';
import type {
  AuthRequestDto,
  AuthResponseDto,
  BackendBalanceDto,
  BackendCategoryDto,
  BackendTransactionDto,
  CreateCategoryRequestDto,
  CreateTransactionRequestDto,
  HealthDto,
  ReceiptUploadFileDto,
  ReceiptUploadResponseDto,
  UpdateCategoryRequestDto,
  UpdateTransactionRequestDto,
} from './dto';
import { createHttpError, createNetworkError, createParseError } from './errors';

export interface CashiApiClientOptions {
  baseUrl: string;
  fetchImpl?: typeof fetch;
  token?: string | null;
}

export interface CashiApiClient {
  health(): Promise<HealthDto>;
  login(input: AuthRequestDto): Promise<AuthResponseDto>;
  register(input: AuthRequestDto): Promise<AuthResponseDto>;
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
  uploadReceipt(input: ReceiptUploadFileDto): Promise<ReceiptUploadResponseDto>;
}

type JsonMethod = 'POST' | 'PATCH';
type RequestMethod = 'GET' | 'DELETE' | JsonMethod;

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

interface ApiRequestOptions {
  method?: RequestMethod;
  body?: unknown;
  authenticated?: boolean;
}

interface MultipartRequestOptions {
  authenticated?: boolean;
  body: FormData;
}

function createHeaders(hasBody: boolean, token: string | null, authenticated: boolean): Record<string, string> {
  const headers: Record<string, string> = { Accept: 'application/json' };

  if (hasBody) {
    headers['Content-Type'] = 'application/json';
  }

  if (authenticated && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

function createMultipartHeaders(token: string | null, authenticated: boolean): Record<string, string> {
  const headers: Record<string, string> = { Accept: 'application/json' };

  if (authenticated && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
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

export function createCashiApiClient({ baseUrl, fetchImpl = globalThis.fetch, token = null }: CashiApiClientOptions): CashiApiClient {
  const normalizedBaseUrl = normalizeApiBaseUrl(baseUrl);
  const normalizedToken = token?.trim() ? token.trim() : null;
  const request = async <T>(path: string, options: ApiRequestOptions = {}): Promise<T> => {
    const method = options.method ?? 'GET';
    const hasBody = options.body !== undefined;
    const authenticated = options.authenticated ?? true;
    let response: Response;

    try {
      response = await (fetchImpl as FetchLike)(joinPath(normalizedBaseUrl, path), {
        method,
        headers: createHeaders(hasBody, normalizedToken, authenticated),
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

  const multipartRequest = async <T>(path: string, options: MultipartRequestOptions): Promise<T> => {
    const authenticated = options.authenticated ?? true;
    let response: Response;

    try {
      response = await (fetchImpl as FetchLike)(joinPath(normalizedBaseUrl, path), {
        method: 'POST',
        headers: createMultipartHeaders(normalizedToken, authenticated),
        body: options.body,
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
    login: (input) => request<AuthResponseDto>('/auth/login', { method: 'POST', body: input, authenticated: false }),
    register: (input) => request<AuthResponseDto>('/auth/register', { method: 'POST', body: input, authenticated: false }),
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
    uploadReceipt: (input) => {
      const body = new FormData();
      body.append('receipt', input as unknown as Blob);
      return multipartRequest<ReceiptUploadResponseDto>('/transactions/upload', { body });
    },
  };
}

export function createDefaultCashiApiClient(fetchImpl?: typeof fetch, token?: string | null): CashiApiClient {
  return createCashiApiClient({ baseUrl: requireApiBaseUrl(), fetchImpl, token });
}
