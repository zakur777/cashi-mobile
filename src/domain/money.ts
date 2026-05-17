import type { TransactionType } from './types';

const clpFormatter = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0,
});

export function formatCLP(amount: number): string {
  return clpFormatter.format(amount);
}

export function formatSignedCLP(amount: number, type: TransactionType): string {
  const sign = type === 'income' ? '+' : '-';
  return `${sign}${formatCLP(amount)}`;
}
