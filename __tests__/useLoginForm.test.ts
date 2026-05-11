import { act, renderHook } from '@testing-library/react-native';

import { useLoginForm } from '../src/hooks/useLoginForm';

describe('useLoginForm', () => {
  it('returns inline field errors when email/password are invalid', async () => {
    const onSuccess = jest.fn();
    const { result } = renderHook(() => useLoginForm({ onSuccess }));

    let ok = false;
    await act(async () => {
      ok = await result.current.handleSubmit();
    });

    expect(ok).toBe(false);
    expect(onSuccess).not.toHaveBeenCalled();
    expect(result.current.errors.email).toBe('El email es obligatorio');
    expect(result.current.errors.password).toBe('La contraseña es obligatoria');
  });

  it('returns inline credential error when credentials are incorrect', async () => {
    const onSuccess = jest.fn();
    const { result } = renderHook(() => useLoginForm({ onSuccess }));

    act(() => {
      result.current.setEmail('wrong@cashi.com');
      result.current.setPassword('invalid-password');
    });

    let ok = false;
    await act(async () => {
      ok = await result.current.handleSubmit();
    });

    expect(ok).toBe(false);
    expect(onSuccess).not.toHaveBeenCalled();
    expect(result.current.formError).toBe('Credenciales incorrectas');
  });
});
