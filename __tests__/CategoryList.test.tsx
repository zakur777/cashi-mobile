import { fireEvent, render } from '@testing-library/react-native';

import { CategoryList } from '../src/components/categories/CategoryList';
import { CATEGORY_COLORS } from '../src/domain/types';

describe('CategoryList', () => {
  it('shows empty state when there are no categories', () => {
    const screen = render(
      <CategoryList
        categories={[]}
        onCreate={jest.fn()}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />,
    );

    expect(screen.getByText('Todavía no hay categorías.')).toBeTruthy();
  });

  it('calls edit and delete handlers for an item', () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();

    const screen = render(
      <CategoryList
        categories={[
          {
            id: 'c-1',
            name: 'Comida',
            type: 'expense',
            color: CATEGORY_COLORS.lime,
          },
        ]}
        onCreate={jest.fn()}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );

    fireEvent.press(screen.getByText('Editar'));
    fireEvent.press(screen.getByText('Eliminar'));

    expect(onEdit).toHaveBeenCalledWith('c-1');
    expect(onDelete).toHaveBeenCalledWith('c-1');
  });

  it('exposes accessible add action and invokes create', () => {
    const onCreate = jest.fn();

    const screen = render(
      <CategoryList
        categories={[]}
        onCreate={onCreate}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />,
    );

    fireEvent.press(screen.getByLabelText('Agregar categoría'));

    expect(onCreate).toHaveBeenCalledTimes(1);
  });

  it('exposes category-specific row actions', () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();

    const screen = render(
      <CategoryList
        categories={[
          {
            id: 'c-2',
            name: 'Transporte',
            type: 'expense',
            color: CATEGORY_COLORS.purple,
          },
        ]}
        onCreate={jest.fn()}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );

    fireEvent.press(screen.getByLabelText('Editar Transporte'));
    fireEvent.press(screen.getByLabelText('Eliminar Transporte'));

    expect(onEdit).toHaveBeenCalledWith('c-2');
    expect(onDelete).toHaveBeenCalledWith('c-2');
  });
});
