import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';

import { createDefaultCashiApiClient } from '../api/client';
import type { AuthRequestDto, AuthResponseDto } from '../api/dto';
import { authTokenStorage, type AuthTokenStorage } from '../storage/authTokenStorage';

export type AuthCredentials = AuthRequestDto;

export interface AuthService {
  login(input: AuthCredentials): Promise<AuthResponseDto>;
  register(input: AuthCredentials): Promise<AuthResponseDto>;
}

export interface AuthContextValue {
  token: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login(input: AuthCredentials): Promise<void>;
  register(input: AuthCredentials): Promise<void>;
  logout(): Promise<void>;
}

interface AuthProviderProps extends PropsWithChildren {
  storage?: AuthTokenStorage;
  authService?: AuthService;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const defaultAuthService: AuthService = {
  login(input) {
    return createDefaultCashiApiClient().login(input);
  },
  register(input) {
    return createDefaultCashiApiClient().register(input);
  },
};

export function AuthProvider({ children, storage = authTokenStorage, authService = defaultAuthService }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    let mounted = true;

    void storage
      .load()
      .then((storedToken) => {
        if (mounted) {
          setToken(storedToken);
        }
      })
      .finally(() => {
        if (mounted) {
          setIsInitializing(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [storage]);

  const persistToken = useCallback(
    async (response: AuthResponseDto) => {
      await storage.save(response.token);
      setToken(response.token);
    },
    [storage],
  );

  const login = useCallback(
    async (input: AuthCredentials) => {
      const response = await authService.login(input);
      await persistToken(response);
    },
    [authService, persistToken],
  );

  const register = useCallback(
    async (input: AuthCredentials) => {
      const response = await authService.register(input);
      await persistToken(response);
    },
    [authService, persistToken],
  );

  const logout = useCallback(async () => {
    await storage.clear();
    setToken(null);
  }, [storage]);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      isAuthenticated: token !== null,
      isInitializing,
      login,
      register,
      logout,
    }),
    [isInitializing, login, logout, register, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useOptionalAuth(): AuthContextValue | null {
  return useContext(AuthContext);
}

export function useRequiredAuth(): AuthContextValue {
  const value = useOptionalAuth();

  if (!value) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return value;
}
