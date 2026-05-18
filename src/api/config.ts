import Constants from 'expo-constants';

import { createConfigError } from './errors';

export interface ApiConfigInput {
  baseUrl?: string | null;
}

const allowedProtocols = ['http:', 'https:'];

export function normalizeApiBaseUrl(baseUrl: string): string {
  const trimmed = baseUrl.trim();

  if (!trimmed) {
    throw createConfigError('La URL del backend es obligatoria');
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw createConfigError('La URL del backend no es válida', { baseUrl });
  }

  if (!allowedProtocols.includes(parsed.protocol)) {
    throw createConfigError('La URL del backend debe usar http o https', { baseUrl });
  }

  return trimmed.replace(/\/+$/, '');
}

function readExpoExtraBaseUrl(): string | null {
  const extra = Constants.expoConfig?.extra;
  const value = extra?.cashiApiBaseUrl;
  return typeof value === 'string' ? value : null;
}

export function resolveApiBaseUrl(input: ApiConfigInput = {}): string | null {
  const configured = input.baseUrl ?? process.env.EXPO_PUBLIC_CASHI_API_BASE_URL ?? readExpoExtraBaseUrl();

  if (configured == null) {
    return null;
  }

  return normalizeApiBaseUrl(configured);
}

export function requireApiBaseUrl(input: ApiConfigInput = {}): string {
  const baseUrl = resolveApiBaseUrl(input);

  if (!baseUrl) {
    throw createConfigError('Configurá EXPO_PUBLIC_CASHI_API_BASE_URL para usar el backend');
  }

  return baseUrl;
}
