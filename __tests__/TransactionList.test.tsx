import { fireEvent, render } from '@testing-library/react-native';

import { TransactionList } from '../src/components/transactions/TransactionList';

describe('TransactionList', () => {
  it('shows empty state when there are no transactions', () => {
    const screen = render(
      <TransactionList
        transactions={[]}
        onCreate={jest.fn()}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />,
    );

    expect(screen.getByText('Todavía no hay transacciones.')).toBeTruthy();
  });

  it('renders amount, type label and category name', () => {
    const screen = render(
      <TransactionList
        transactions={[
          {
            id: 'tx-1',
            amount: 540,
            type: 'expense',
            description: 'Supermercado',
            date: '2026-05-11',
            categoryId: 'cat-1',
            categoryName: 'Comida',
          },
        ]}
        onCreate={jest.fn()}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />,
    );

    expect(screen.getAllByText('-$540')).toHaveLength(2);
    expect(screen.getByText('Comida · 2026-05-11')).toBeTruthy();
    expect(screen.getByText('Supermercado')).toBeTruthy();
  });

  it('calls edit and delete handlers', () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();

    const screen = render(
      <TransactionList
        transactions={[
          {
            id: 'tx-10',
            amount: 1200,
            type: 'income',
            description: 'Freelance',
            date: '2026-05-09',
            categoryId: 'cat-2',
            categoryName: 'Salario',
          },
        ]}
        onCreate={jest.fn()}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );

    fireEvent.press(screen.getByText('Freelance'));
    fireEvent.press(screen.getByText('Eliminar'));

    expect(onEdit).toHaveBeenCalledWith('tx-10');
    expect(onDelete).toHaveBeenCalledWith('tx-10');
  });

  it('shows explicit plus sign for income amounts', () => {
    const screen = render(
      <TransactionList
        transactions={[
          {
            id: 'tx-20',
            amount: 99,
            type: 'income',
            description: 'Reintegro',
            date: '2026-05-10',
            categoryId: 'cat-8',
            categoryName: 'Varios',
          },
        ]}
        onCreate={jest.fn()}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />,
    );

    expect(screen.getAllByText('+$99')).toHaveLength(2);
    expect(screen.getByText('Varios · 2026-05-10')).toBeTruthy();
  });

  it('exposes accessible add action and invokes create', () => {
    const onCreate = jest.fn();

    const screen = render(
      <TransactionList
        transactions={[]}
        onCreate={onCreate}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />,
    );

    fireEvent.press(screen.getByLabelText('Agregar movimiento'));

    expect(onCreate).toHaveBeenCalledTimes(1);
  });

  it('exposes transaction-specific row actions', () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();

    const screen = render(
      <TransactionList
        transactions={[
          {
            id: 'tx-30',
            amount: 4500,
            type: 'expense',
            description: 'Café',
            date: '2026-05-12',
            categoryId: 'cat-3',
            categoryName: 'Comida',
          },
        ]}
        onCreate={jest.fn()}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );

    fireEvent.press(screen.getByLabelText('Editar Café'));
    fireEvent.press(screen.getByLabelText('Eliminar Café'));

    expect(onEdit).toHaveBeenCalledWith('tx-30');
    expect(onDelete).toHaveBeenCalledWith('tx-30');
  });
});
