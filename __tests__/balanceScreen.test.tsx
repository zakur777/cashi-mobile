import { render } from '@testing-library/react-native';

import BalanceTab from '../app/(tabs)/balance';

const mockRefresh = jest.fn();
const mockUseTransactions = jest.fn();

jest.mock('expo-router', () => ({
  useFocusEffect: (callback: () => void) => callback(),
}));

jest.mock('../src/hooks/useCategories', () => ({
  useCategories: () => ({ categories: [], refresh: jest.fn() }),
}));

jest.mock('../src/hooks/useTransactions', () => ({
  useTransactions: () => mockUseTransactions(),
}));

describe('BalanceTab', () => {
  beforeEach(() => {
    mockRefresh.mockClear();
    mockUseTransactions.mockReturnValue({
      transactions: [{ id: 't1' }],
      totalIncome: 3500,
      totalExpense: 1200,
      balance: 2300,
      primaryExpenseCategory: {
        id: 'cat-2',
        name: 'Comida',
        color: '#EDF7BD',
        amount: 1200,
      },
      loading: false,
      error: null,
      refresh: mockRefresh,
    });
  });

  it('renders balance hierarchy with income and expense totals', () => {
    const screen = render(<BalanceTab />);

    expect(screen.getByText('Balance actual')).toBeTruthy();
    expect(screen.getByText('$2.300')).toBeTruthy();
    expect(screen.getByText('Ingresos')).toBeTruthy();
    expect(screen.getByText('$3.500')).toBeTruthy();
    expect(screen.getByText('Egresos')).toBeTruthy();
    expect(screen.getAllByText('$1.200')).toHaveLength(2);
    expect(screen.getByText('Categoría principal')).toBeTruthy();
    expect(screen.getByText('Comida')).toBeTruthy();
  });

  it('refreshes data when screen gains focus', () => {
    render(<BalanceTab />);

    expect(mockRefresh).toHaveBeenCalledTimes(1);
  });

  it('shows explicit empty state when there are no transactions', () => {
    mockUseTransactions.mockReturnValue({
      transactions: [],
      totalIncome: 0,
      totalExpense: 0,
      balance: 0,
      primaryExpenseCategory: null,
      loading: false,
      error: null,
      refresh: mockRefresh,
    });

    const screen = render(<BalanceTab />);

    expect(screen.getByText('Todavía no hay movimientos para mostrar balance.')).toBeTruthy();
  });
});
