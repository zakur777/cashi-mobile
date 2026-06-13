import * as SecureStore from 'expo-secure-store';

import { authTokenStorage } from '../src/storage/authTokenStorage';

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

const mockedSecureStore = SecureStore as jest.Mocked<typeof SecureStore>;

describe('authTokenStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('saves, loads, and deletes the JWT through SecureStore', async () => {
    mockedSecureStore.getItemAsync.mockResolvedValueOnce('session.jwt');

    await authTokenStorage.save('session.jwt');
    await expect(authTokenStorage.load()).resolves.toBe('session.jwt');
    await authTokenStorage.clear();

    expect(mockedSecureStore.setItemAsync).toHaveBeenCalledWith('cashi.authToken', 'session.jwt');
    expect(mockedSecureStore.getItemAsync).toHaveBeenCalledWith('cashi.authToken');
    expect(mockedSecureStore.deleteItemAsync).toHaveBeenCalledWith('cashi.authToken');
  });

  it('treats blank stored values as no authenticated session', async () => {
    mockedSecureStore.getItemAsync.mockResolvedValueOnce('   ');

    await expect(authTokenStorage.load()).resolves.toBeNull();
  });
});
