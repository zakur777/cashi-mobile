import { useCallback, useState } from 'react';

import { loginSchema } from '../domain/schemas';

const HARDCODED_CREDENTIALS = {
  email: 'demo@cashi.com',
  password: 'Cashi1234',
} as const;

interface UseLoginFormOptions {
  onSuccess: () => void;
}

export function useLoginForm({ onSuccess }: UseLoginFormOptions) {
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

    if (
      parsed.data.email !== HARDCODED_CREDENTIALS.email ||
      parsed.data.password !== HARDCODED_CREDENTIALS.password
    ) {
      setFormError('Credenciales incorrectas');
      return false;
    }

    setErrors({});
    setFormError(null);
    onSuccess();
    return true;
  }, [email, onSuccess, password]);

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
