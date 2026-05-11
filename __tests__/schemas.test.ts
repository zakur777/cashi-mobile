import { categorySchema, transactionSchema } from '../src/domain/schemas';

describe('categorySchema', () => {
  it('rejects empty name', () => {
    const result = categorySchema.safeParse({ name: '   ' });
    expect(result.success).toBe(false);
  });

  it('accepts valid name', () => {
    const result = categorySchema.safeParse({ name: 'Comida' });
    expect(result.success).toBe(true);
  });
});

describe('transactionSchema', () => {
  it('rejects amount <= 0', () => {
    const result = transactionSchema.safeParse({
      amount: 0,
      type: 'expense',
      description: 'Cafe',
      date: '2026-05-11',
      categoryId: 'cat-1',
    });
    expect(result.success).toBe(false);
  });

  it('accepts valid payload', () => {
    const result = transactionSchema.safeParse({
      amount: '1200',
      type: 'income',
      description: 'Sueldo',
      date: '2026-05-11',
      categoryId: 'cat-2',
    });
    expect(result.success).toBe(true);
  });
});
