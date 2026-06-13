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

  it('calls the auth login service with user-entered credentials and then succeeds', async () => {
    const onSuccess = jest.fn();
    const login = jest.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useLoginForm({ onSuccess, login }));

    act(() => {
      result.current.setEmail('person@cashi.test');
      result.current.setPassword('user-password');
    });

    let ok = false;
    await act(async () => {
      ok = await result.current.handleSubmit();
    });

    expect(ok).toBe(true);
    expect(login).toHaveBeenCalledWith({ email: 'person@cashi.test', password: 'user-password' });
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(result.current.formError).toBeNull();
  });

  it('surfaces auth service failures without comparing hardcoded demo credentials', async () => {
    const onSuccess = jest.fn();
    const login = jest.fn().mockRejectedValue(new Error('Credenciales inválidas'));
    const { result } = renderHook(() => useLoginForm({ onSuccess, login }));

    act(() => {
      result.current.setEmail('wrong@cashi.test');
      result.current.setPassword('invalid-password');
    });

    let ok = false;
    await act(async () => {
      ok = await result.current.handleSubmit();
    });

    expect(ok).toBe(false);
    expect(onSuccess).not.toHaveBeenCalled();
    expect(result.current.formError).toBe('Credenciales inválidas');
  });
});
