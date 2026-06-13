export type ApiErrorKind = 'config' | 'network' | 'http' | 'parse';

export type ApiErrorCode =
  | 'bad_request'
  | 'not_found'
  | 'conflict'
  | 'unprocessable_entity'
  | 'server_error'
  | 'unknown_http_error';

export interface NormalizedApiError {
  kind: ApiErrorKind;
  message: string;
  status?: number;
  code?: ApiErrorCode;
  details?: unknown;
}

export class ApiClientError extends Error {
  readonly error: NormalizedApiError;

  constructor(error: NormalizedApiError) {
    super(error.message);
    this.name = 'ApiClientError';
    this.error = error;
  }
}

const statusMessages: Record<ApiErrorCode, string> = {
  bad_request: 'Solicitud inválida',
  not_found: 'Recurso no encontrado',
  conflict: 'El recurso ya existe o está en conflicto',
  unprocessable_entity: 'No se pudo procesar la solicitud',
  server_error: 'El servidor no pudo completar la solicitud',
  unknown_http_error: 'No se pudo completar la solicitud',
};

export function getHttpErrorCode(status: number): ApiErrorCode {
  if (status === 400) return 'bad_request';
  if (status === 404) return 'not_found';
  if (status === 409) return 'conflict';
  if (status === 422) return 'unprocessable_entity';
  if (status >= 500 && status <= 599) return 'server_error';
  return 'unknown_http_error';
}

export function createConfigError(message: string, details?: unknown) {
  return new ApiClientError({ kind: 'config', message, details });
}

export function createNetworkError(details?: unknown) {
  return new ApiClientError({ kind: 'network', message: 'Error de conexión', details });
}

export function createParseError(details?: unknown) {
  return new ApiClientError({ kind: 'parse', message: 'La respuesta del servidor no tiene el formato esperado', details });
}

export function createHttpError(status: number, details?: unknown) {
  const code = getHttpErrorCode(status);
  const serverMessage = extractServerErrorMessage(details);
  return new ApiClientError({ kind: 'http', status, code, message: serverMessage ?? statusMessages[code], details });
}

function extractServerErrorMessage(details: unknown): string | null {
  if (typeof details !== 'object' || details === null || !('error' in details)) {
    return null;
  }

  const error = details.error;
  return typeof error === 'string' && error.trim() ? error : null;
}
