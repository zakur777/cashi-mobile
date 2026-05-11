import { act, renderHook } from '@testing-library/react-native';

import { useCategoryForm } from '../src/hooks/useCategoryForm';

describe('useCategoryForm', () => {
  it('blocks submit and exposes field error when name is empty', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useCategoryForm({ onSubmit }));

    let response = false;
    await act(async () => {
      response = await result.current.handleSubmit();
    });

    expect(response).toBe(false);
    expect(result.current.errors.name).toBe('El nombre es obligatorio');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits valid name and clears errors', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useCategoryForm({ onSubmit }));

    await act(async () => {
      result.current.setName('  Comida  ');
    });

    let response = false;
    await act(async () => {
      response = await result.current.handleSubmit();
    });

    expect(response).toBe(true);
    expect(onSubmit).toHaveBeenCalledWith('Comida');
    expect(result.current.errors).toEqual({});
  });
});
