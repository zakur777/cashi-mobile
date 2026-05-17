import { CATEGORY_COLORS, type Category, type Transaction } from '../domain/types';
import { categoriesStorage } from './categoriesStorage';
import { transactionsStorage } from './transactionsStorage';

export const DEMO_CATEGORIES: Category[] = [
  { id: 'demo-cat-income', name: 'Ingresos', type: 'income', color: CATEGORY_COLORS.green },
  { id: 'demo-cat-food', name: 'Comida', type: 'expense', color: CATEGORY_COLORS.lime },
  { id: 'demo-cat-transport', name: 'Transporte', type: 'expense', color: CATEGORY_COLORS.teal },
  { id: 'demo-cat-entertainment', name: 'Ocio', type: 'expense', color: CATEGORY_COLORS.purple },
];

export const DEMO_TRANSACTIONS: Transaction[] = [
  {
    id: 'demo-tx-salary',
    amount: 1250000,
    type: 'income',
    description: 'Sueldo mensual',
    date: '2026-05-01',
    categoryId: 'demo-cat-income',
  },
  {
    id: 'demo-tx-groceries',
    amount: 42000,
    type: 'expense',
    description: 'Supermercado',
    date: '2026-05-04',
    categoryId: 'demo-cat-food',
  },
  {
    id: 'demo-tx-transport',
    amount: 11500,
    type: 'expense',
    description: 'Transporte semanal',
    date: '2026-05-08',
    categoryId: 'demo-cat-transport',
  },
  {
    id: 'demo-tx-movie',
    amount: 12000,
    type: 'expense',
    description: 'Salida al cine',
    date: '2026-05-12',
    categoryId: 'demo-cat-entertainment',
  },
];

export async function seedDemoDataIfEmpty(): Promise<boolean> {
  const [categories, transactions] = await Promise.all([
    categoriesStorage.getAll(),
    transactionsStorage.getAll(),
  ]);

  if (categories.length > 0 || transactions.length > 0) {
    return false;
  }

  await categoriesStorage.saveAll(DEMO_CATEGORIES);
  await transactionsStorage.saveAll(DEMO_TRANSACTIONS);

  return true;
}
