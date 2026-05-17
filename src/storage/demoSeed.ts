import type { Category, Transaction } from '../domain/types';
import { categoriesStorage } from './categoriesStorage';
import { transactionsStorage } from './transactionsStorage';

export const DEMO_CATEGORIES: Category[] = [
  { id: 'demo-cat-income', name: 'Ingresos' },
  { id: 'demo-cat-food', name: 'Comida' },
  { id: 'demo-cat-transport', name: 'Transporte' },
  { id: 'demo-cat-entertainment', name: 'Ocio' },
];

export const DEMO_TRANSACTIONS: Transaction[] = [
  {
    id: 'demo-tx-salary',
    amount: 2400,
    type: 'income',
    description: 'Sueldo mensual',
    date: '2026-05-01',
    categoryId: 'demo-cat-income',
  },
  {
    id: 'demo-tx-groceries',
    amount: 320,
    type: 'expense',
    description: 'Supermercado',
    date: '2026-05-04',
    categoryId: 'demo-cat-food',
  },
  {
    id: 'demo-tx-transport',
    amount: 85,
    type: 'expense',
    description: 'Transporte semanal',
    date: '2026-05-08',
    categoryId: 'demo-cat-transport',
  },
  {
    id: 'demo-tx-movie',
    amount: 60,
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
