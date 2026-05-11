import { render } from '@testing-library/react-native';

import BalanceTab from '../app/(tabs)/balance';

const mockRefresh = jest.fn();

jest.mock('expo-router', () => ({
  useFocusEffect: (callback: () => void) => callback(),
}));

jest.mock('../src/hooks/useTransactions', () => ({
  useTransactions: () => ({
    totalIncome: 3500,
    totalExpense: 1200,
    balance: 2300,
    loading: false,
    error: null,
    refresh: mockRefresh,
  }),
}));

describe('BalanceTab', () => {
  beforeEach(() => {
    mockRefresh.mockClear();
  });

  it('renders balance hierarchy with income and expense totals', () => {
    const screen = render(<BalanceTab />);

    expect(screen.getByText('Balance actual')).toBeTruthy();
    expect(screen.getByText('$2300.00')).toBeTruthy();
    expect(screen.getByText('Ingresos')).toBeTruthy();
    expect(screen.getByText('+$3500.00')).toBeTruthy();
    expect(screen.getByText('Egresos')).toBeTruthy();
    expect(screen.getByText('-$1200.00')).toBeTruthy();
  });

  it('refreshes data when screen gains focus', () => {
    render(<BalanceTab />);

    expect(mockRefresh).toHaveBeenCalledTimes(1);
  });
});
