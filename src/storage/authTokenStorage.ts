import * as SecureStore from 'expo-secure-store';

const AUTH_TOKEN_STORAGE_KEY = 'cashi.authToken';

export interface AuthTokenStorage {
  load(): Promise<string | null>;
  save(token: string): Promise<void>;
  clear(): Promise<void>;
}

export const authTokenStorage: AuthTokenStorage = {
  async load() {
    const token = await SecureStore.getItemAsync(AUTH_TOKEN_STORAGE_KEY);
    return token?.trim() ? token : null;
  },

  async save(token) {
    await SecureStore.setItemAsync(AUTH_TOKEN_STORAGE_KEY, token);
  },

  async clear() {
    await SecureStore.deleteItemAsync(AUTH_TOKEN_STORAGE_KEY);
  },
};
