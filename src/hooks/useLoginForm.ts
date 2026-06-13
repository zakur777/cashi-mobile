import { useCallback, useState } from 'react';

import { useOptionalAuth, type AuthCredentials } from '../contexts/AuthContext';
import { loginSchema } from '../domain/schemas';
import { getUserFacingErrorMessage } from '../api/userFacingErrors';

interface UseLoginFormOptions {
  onSuccess: () => void;
  login?: (input: AuthCredentials) => Promise<void>;
}

export function useLoginForm({ onSuccess, login }: UseLoginFormOptions) {
  const auth = useOptionalAuth();
  const [email, setEmailState] = useState('');
  const [password, setPasswordState] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);

  const setEmail = useCallback((value: string) => {
    setEmailState(value);
    setErrors((prev) => ({ ...prev, email: undefined }));
    setFormError(null);
  }, []);

  const setPassword = useCallback((value: string) => {
    setPasswordState(value);
    setErrors((prev) => ({ ...prev, password: undefined }));
    setFormError(null);
  }, []);

  const handleSubmit = useCallback(async () => {
    const parsed = loginSchema.safeParse({ email, password });

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
      setFormError(null);
      return false;
    }

    const loginAction = login ?? auth?.login;

    if (!loginAction) {
      setFormError('La autenticación no está disponible');
      return false;
    }

    try {
      await loginAction(parsed.data);
      setErrors({});
      setFormError(null);
      onSuccess();
      return true;
    } catch (cause) {
      setFormError(getUserFacingErrorMessage(cause, cause instanceof Error ? cause.message : 'No se pudo iniciar sesión'));
      return false;
    }
  }, [auth?.login, email, login, onSuccess, password]);

  return {
    email,
    setEmail,
    password,
    setPassword,
    errors,
    formError,
    handleSubmit,
  };
}
