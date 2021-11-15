import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import TableViewCol from './TableViewCol';

const BaseComponent = ({
  columns = [],
  onColumnUpdate = () => {},
  limit = null
}) => (
  <TableViewCol
    columns={columns}
    onColumnUpdate={onColumnUpdate}
    limit={limit}
  />
);

describe('TableViewCol', () => {
  it('check default render', async () => {
    const { getByTestId } = render(<BaseComponent />);

    expect(getByTestId('table-view-col-container')).toBeInTheDocument();
  });

  it('check render columns', async () => {
    const columns = new Array(10).fill(0).map((_, index) => ({
      label: `label${index}`,
      display: true
    }));

    const { getAllByTestId } = render(<BaseComponent columns={columns} />);

    const itemsElements = getAllByTestId('table-view-item');

    expect(itemsElements.length).toBe(columns.length);
  });

  it('check disable checkbox when display to be false', async () => {
    const columns = [
      {
        label: 'display-false-label',
        display: false,
        viewColumns: true
      }
    ];

    const { getByTestId } = render(
      <BaseComponent columns={columns} limit={0} />
    );

    const checkboxElement = getByTestId('table-view-checkbox');

    expect(checkboxElement).toBeDisabled();
  });

  it('check onColumnUpdate function', async () => {
    const onColumnUpdate = jest.fn();

    const columns = [
      {
        label: 'column01',
        display: true,
        viewColumns: true
      },
      {
        label: 'column02',
        display: true,
        viewColumns: true
      }
    ];

    const { getAllByTestId } = render(
      <BaseComponent
        columns={columns}
        limit={2}
        onColumnUpdate={onColumnUpdate}
      />
    );

    const [, secondCheckboxElement] = getAllByTestId('table-view-checkbox');

    fireEvent.click(secondCheckboxElement);

    expect(onColumnUpdate.mock.calls.length).toBe(1);
  });
});
