import { ApiClientError } from '../src/api/errors';
import { normalizeApiBaseUrl, requireApiBaseUrl, resolveApiBaseUrl } from '../src/api/config';

describe('API config', () => {
  const originalEnv = process.env.EXPO_PUBLIC_CASHI_API_BASE_URL;
  const originalPublicEnv = process.env.EXPO_PUBLIC_API_URL;

  afterEach(() => {
    if (originalEnv === undefined) {
      delete process.env.EXPO_PUBLIC_CASHI_API_BASE_URL;
    } else {
      process.env.EXPO_PUBLIC_CASHI_API_BASE_URL = originalEnv;
    }
    if (originalPublicEnv === undefined) {
      delete process.env.EXPO_PUBLIC_API_URL;
    } else {
      process.env.EXPO_PUBLIC_API_URL = originalPublicEnv;
    }
  });

  it('normalizes explicit base URL by trimming and removing trailing slashes', () => {
    expect(normalizeApiBaseUrl('  http://10.0.2.2:3000///  ')).toBe('http://10.0.2.2:3000');
    expect(resolveApiBaseUrl({ baseUrl: ' https://api.cashi.test/ ' })).toBe('https://api.cashi.test');
  });

  it('does not fall back to localhost when no configuration exists', () => {
    delete process.env.EXPO_PUBLIC_CASHI_API_BASE_URL;

    expect(resolveApiBaseUrl({ baseUrl: null })).toBeNull();
  });

  it('reads Expo public env when explicit input is absent', () => {
    process.env.EXPO_PUBLIC_API_URL = 'https://cashi-api-pphe.onrender.com/';

    expect(resolveApiBaseUrl()).toBe('https://cashi-api-pphe.onrender.com');
  });

  it('prefers EXPO_PUBLIC_API_URL over the legacy Cashi env and exposes no demo credentials', () => {
    process.env.EXPO_PUBLIC_API_URL = 'https://cashi-api-pphe.onrender.com/';
    process.env.EXPO_PUBLIC_CASHI_API_BASE_URL = 'http://127.0.0.1:3000';

    expect(resolveApiBaseUrl()).toBe('https://cashi-api-pphe.onrender.com');
    expect(process.env.EXPO_PUBLIC_API_URL).not.toContain('demo@cashi.com');
    expect(process.env.EXPO_PUBLIC_API_URL).not.toContain('Cashi1234');
  });

  it('throws typed config errors for missing or invalid URLs', () => {
    delete process.env.EXPO_PUBLIC_API_URL;
    delete process.env.EXPO_PUBLIC_CASHI_API_BASE_URL;

    expect(() => requireApiBaseUrl({ baseUrl: '   ' })).toThrow(ApiClientError);
    expect(() => requireApiBaseUrl({ baseUrl: 'ftp://api.cashi.test' })).toThrow(ApiClientError);

    try {
      requireApiBaseUrl({ baseUrl: 'ftp://api.cashi.test' });
    } catch (error) {
      expect(error).toBeInstanceOf(ApiClientError);
      expect((error as ApiClientError).error.kind).toBe('config');
    }
  });
});
