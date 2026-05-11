export interface Category {
  id: string;
  name: string;
}

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  description: string;
  date: string;
  categoryId: string;
}

export interface BalanceSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}
