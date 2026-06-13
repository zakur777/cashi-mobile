import { act, renderHook, waitFor } from '@testing-library/react-native';
import type { PropsWithChildren } from 'react';

import { AuthProvider } from '../src/contexts/AuthContext';
import { useAuth } from '../src/hooks/useAuth';
import type { AuthService } from '../src/contexts/AuthContext';
import type { AuthTokenStorage } from '../src/storage/authTokenStorage';

const createStorage = (initialToken: string | null = null): jest.Mocked<AuthTokenStorage> => ({
  load: jest.fn().mockResolvedValue(initialToken),
  save: jest.fn().mockResolvedValue(undefined),
  clear: jest.fn().mockResolvedValue(undefined),
});

const createAuthService = (): jest.Mocked<AuthService> => ({
  login: jest.fn().mockResolvedValue({ token: 'new.jwt' }),
  register: jest.fn().mockResolvedValue({ token: 'registered.jwt' }),
});

describe('AuthContext', () => {
  it('bootstraps an existing token from secure storage', async () => {
    const storage = createStorage('stored.jwt');
    const authService = createAuthService();
    const wrapper = ({ children }: PropsWithChildren) => (
      <AuthProvider storage={storage} authService={authService}>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isInitializing).toBe(true);
    await waitFor(() => expect(result.current.isInitializing).toBe(false));
    expect(result.current.token).toBe('stored.jwt');
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('logs in through the service, persists the JWT, and clears it on logout', async () => {
    const storage = createStorage();
    const authService = createAuthService();
    const wrapper = ({ children }: PropsWithChildren) => (
      <AuthProvider storage={storage} authService={authService}>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isInitializing).toBe(false));

    await act(async () => {
      await result.current.login({ email: 'person@cashi.test', password: 'secret' });
    });

    expect(authService.login).toHaveBeenCalledWith({ email: 'person@cashi.test', password: 'secret' });
    expect(storage.save).toHaveBeenCalledWith('new.jwt');
    expect(result.current.token).toBe('new.jwt');

    await act(async () => {
      await result.current.logout();
    });

    expect(storage.clear).toHaveBeenCalledTimes(1);
    expect(result.current.token).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });
});
