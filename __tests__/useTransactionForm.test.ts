import { act, renderHook } from '@testing-library/react-native';

import { useTransactionForm } from '../src/hooks/useTransactionForm';

describe('useTransactionForm', () => {
  it('blocks submit when amount is invalid and category is missing', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() =>
      useTransactionForm({
        onSubmit,
        initialValues: {
          amount: '0',
          type: 'expense',
          description: 'Taxi',
          date: '2026-05-11',
          categoryId: '',
        },
      }),
    );

    let ok = false;
    await act(async () => {
      ok = await result.current.handleSubmit();
    });

    expect(ok).toBe(false);
    expect(onSubmit).not.toHaveBeenCalled();
    expect(result.current.errors.amount).toBe('El monto debe ser mayor a 0');
    expect(result.current.errors.categoryId).toBe('La categoría es obligatoria');
  });

  it('submits parsed payload when fields are valid', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() =>
      useTransactionForm({
        onSubmit,
        initialValues: {
          amount: '1300',
          type: 'income',
          description: 'Sueldo',
          date: '2026-05-11',
          categoryId: 'cat-1',
        },
      }),
    );

    let ok = false;
    await act(async () => {
      ok = await result.current.handleSubmit();
    });

    expect(ok).toBe(true);
    expect(onSubmit).toHaveBeenCalledWith({
      amount: 1300,
      type: 'income',
      description: 'Sueldo',
      date: '2026-05-11',
      categoryId: 'cat-1',
    });
  });

  it('blocks submit when selected category id is not in the loaded server categories', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() =>
      useTransactionForm({
        onSubmit,
        validCategoryIds: ['server-cat-1'],
        initialValues: {
          amount: '1300',
          type: 'expense',
          description: 'Taxi',
          date: '2026-05-11',
          categoryId: 'missing-cat',
        },
      }),
    );

    let ok = false;
    await act(async () => {
      ok = await result.current.handleSubmit();
    });

    expect(ok).toBe(false);
    expect(onSubmit).not.toHaveBeenCalled();
    expect(result.current.errors.categoryId).toBe('La categoría seleccionada no está disponible');
  });

  it('clears amount error when amount changes', async () => {
    const { result } = renderHook(() =>
      useTransactionForm({
        onSubmit: jest.fn().mockResolvedValue(undefined),
        initialValues: {
          amount: '0',
          type: 'expense',
          description: 'Bus',
          date: '2026-05-11',
          categoryId: '',
        },
      }),
    );

    await act(async () => {
      await result.current.handleSubmit();
    });
    expect(result.current.errors.amount).toBeTruthy();

    act(() => {
      result.current.setAmount('540');
    });

    expect(result.current.errors.amount).toBeUndefined();
  });
});
