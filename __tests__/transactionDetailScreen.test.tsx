import { render, waitFor } from '@testing-library/react-native';

import TransactionDetailScreen from '../app/(tabs)/transaction/[id]';

const mockBack = jest.fn();
const mockUseLocalSearchParams = jest.fn();
const mockRefreshCategories = jest.fn();
const mockRefreshTransactions = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    back: mockBack,
  }),
  useLocalSearchParams: () => mockUseLocalSearchParams(),
  useFocusEffect: (callback: () => void) => callback(),
}));

jest.mock('../src/hooks/useCategories', () => ({
  useCategories: () => ({
    categories: [
      {
        id: '8',
        name: 'Restaurante de la esquina',
        type: 'expense',
        color: '#FF8A7A',
      },
    ],
    error: null,
    refresh: mockRefreshCategories,
  }),
}));

jest.mock('../src/hooks/useTransactions', () => ({
  useTransactions: () => ({
    transactions: [],
    error: null,
    refresh: mockRefreshTransactions,
    createTransaction: jest.fn(),
    updateTransaction: jest.fn(),
    deleteTransaction: jest.fn(),
  }),
}));

describe('TransactionDetailScreen', () => {
  beforeEach(() => {
    mockBack.mockClear();
    mockRefreshCategories.mockClear();
    mockRefreshTransactions.mockClear();
    mockUseLocalSearchParams.mockReturnValue({ id: 'new' });
  });

  it('refreshes data on focus and shows latest categories in the form', async () => {
    const screen = render(<TransactionDetailScreen />);

    await waitFor(() => {
      expect(mockRefreshCategories).toHaveBeenCalled();
      expect(mockRefreshTransactions).toHaveBeenCalled();
    });
    expect(screen.getByText('Restaurante de la esquina')).toBeTruthy();
  });
});
