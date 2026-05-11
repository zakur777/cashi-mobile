import { fireEvent, render } from '@testing-library/react-native';

import { CategoryList } from '../src/components/categories/CategoryList';

describe('CategoryList', () => {
  it('shows empty state when there are no categories', () => {
    const screen = render(
      <CategoryList categories={[]} onCreate={jest.fn()} onEdit={jest.fn()} onDelete={jest.fn()} />,
    );

    expect(screen.getByText('Todavía no hay categorías.')).toBeTruthy();
  });

  it('calls edit and delete handlers for an item', () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();

    const screen = render(
      <CategoryList
        categories={[{ id: 'c-1', name: 'Comida' }]}
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
});
