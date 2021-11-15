import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import CustomTableHead from './CustomTableHead';

const defaultColumns = [
  {
    key: 'column01',
    label: 'COLUMN 1',
    display: true,
    common: true
  }
];

const BaseComponent = ({
  columns = defaultColumns,
  filters = {},
  params = {},
  handleFilters = () => {},
  submitFilters = () => {},
  handleOrdering = () => {}
}) => (
  <table>
    <CustomTableHead
      columns={columns}
      filters={filters}
      params={params}
      handleFilters={handleFilters}
      submitFilters={submitFilters}
      handleOrdering={handleOrdering}
    />
  </table>
);

const haveClass = (classlist, classname) => {
  const classValidation = new RegExp(`makeStyles-${classname}-`);
  return [].some.call(classlist, classname => classValidation.test(classname));
};

describe('CustomTableHead', () => {
  it('check default render', async () => {
    const { findByTestId } = render(<BaseComponent />);

    const tableHeadContainer = await findByTestId('table-head-container');

    expect(tableHeadContainer).toBeInTheDocument();
  });

  it('check render columns', async () => {
    const columns = new Array(10).fill(0).map((_, index) => ({
      key: `column${index}`,
      label: `COLUMN ${index}`,
      display: true,
      common: true
    }));
    const { findAllByTestId } = render(<BaseComponent columns={columns} />);

    const headItems = await findAllByTestId('head-item');

    expect(headItems.length).toBe(columns.length);
  });

  it('check render common column', async () => {
    const label = 'common-tab-label';

    const columns = [
      {
        key: 'common-tab-key',
        label,
        display: true,
        common: true
      }
    ];

    const { findByText } = render(<BaseComponent columns={columns} />);

    const columnElement = await findByText(label);

    expect(columnElement).toBeInTheDocument();
  });

  it('check render sortable common column', async () => {
    const handleOrdering = jest.fn();

    const columns = [
      {
        key: 'common-sortable-tab-key',
        label: 'common-sortable-tab-label',
        display: true,
        commonWithSort: true
      }
    ];

    const { getByTestId } = render(
      <BaseComponent columns={columns} handleOrdering={handleOrdering} />
    );

    const sortButton = getByTestId('sort-button');

    fireEvent.click(sortButton);

    expect(handleOrdering.mock.calls.length).toBe(1);
  });

  it('check not render when does not pass a path or when display is false', async () => {
    const label = 'hidden-tab-label';

    const columns = [
      {
        key: 'without-path-tab-key',
        label,
        display: true
      },
      {
        key: 'display-off-tab-key',
        path: 'path',
        label,
        display: false
      }
    ];

    const { findByText } = render(<BaseComponent columns={columns} />);

    await expect(findByText(label)).rejects.toThrow();
  });

  it('check render date column', async () => {
    const handleOrdering = jest.fn();

    const columns = [
      {
        key: 'date-tab-key',
        label: 'date-tab-label',
        path: 'date-tab-path',
        display: true,
        filter: { type: 'date' }
      }
    ];

    const { getByTestId, findByTestId } = render(
      <BaseComponent columns={columns} handleOrdering={handleOrdering} />
    );

    const sortButton = getByTestId('sort-button');

    fireEvent.click(sortButton);

    const dateInput = await findByTestId('date-input');

    expect(dateInput).toBeInTheDocument();
    expect(handleOrdering.mock.calls.length).toBe(1);
  });

  it('check render select column', async () => {
    const handleOrdering = jest.fn();

    const columns = [
      {
        key: 'select-tab-key',
        label: 'select-tab-label',
        path: 'select-tab-path',
        display: true,
        filter: { type: 'select', options: ['option1'] }
      }
    ];

    const filters = {
      [columns[0].path]: ''
    };

    const { getByTestId, findByTestId } = render(
      <BaseComponent
        columns={columns}
        filters={filters}
        handleOrdering={handleOrdering}
      />
    );

    const sortButton = getByTestId('sort-button');

    fireEvent.click(sortButton);

    const selectInput = await findByTestId('select-input');

    expect(selectInput).toBeInTheDocument();
    expect(handleOrdering.mock.calls.length).toBe(1);
  });

  it('check render autocomplete column', async () => {
    const handleOrdering = jest.fn();

    const columns = [
      {
        key: 'autocomplete-tab-key',
        label: 'autocomplete-tab-label',
        path: 'autocomplete-tab-path',
        display: true,
        filter: { type: 'autocomplete', options: [] }
      }
    ];

    const { getByTestId, findByTestId } = render(
      <BaseComponent columns={columns} handleOrdering={handleOrdering} />
    );

    const sortButton = getByTestId('sort-button');

    fireEvent.click(sortButton);

    const autocompleteInput = await findByTestId('autocomplete-input');

    expect(autocompleteInput).toBeInTheDocument();
    expect(handleOrdering.mock.calls.length).toBe(1);
  });

  it('check render custom column', async () => {
    const columns = [
      {
        key: 'custom-tab-key',
        label: 'custom-tab-label',
        path: 'custom-tab-path',
        display: true,
        filter: { type: 'custom' }
      }
    ];

    const { findByText } = render(<BaseComponent columns={columns} />);

    const columnElement = await findByText(columns[0].label);

    expect(columnElement).toBeInTheDocument();
  });

  it('check render textfield column', async () => {
    const handleOrdering = jest.fn();

    const columns = [
      {
        key: 'textfield-tab-key',
        label: 'textfield-tab-label',
        path: 'textfield-tab-path',
        display: true,
        fullWidth: 'textfield-classname'
      }
    ];

    const { getByTestId, findByTestId } = render(
      <BaseComponent columns={columns} handleOrdering={handleOrdering} />
    );

    const sortButton = getByTestId('sort-button');

    fireEvent.click(sortButton);

    const textfieldInput = await findByTestId('textfield-input');

    expect(textfieldInput).toBeInTheDocument();
    expect(handleOrdering.mock.calls.length).toBe(1);
  });

  it('check render textfield column with large label', async () => {
    const columns = [
      {
        key: 'textfield-tab-key',
        label: 'textfield-tab-label',
        path: 'textfield-tab-path',
        display: true,
        fullWidth: 'textfield-classname',
        largeLabel: true
      }
    ];

    const { getByTestId } = render(<BaseComponent columns={columns} />);

    const textFieldElement = getByTestId('textfield-input');

    expect(haveClass(textFieldElement.classList, 'largeLabel')).toBeTruthy();
  });

  it('check render custom styles to table cell', async () => {
    const columns = [
      {
        key: 'textfield-tab-key',
        label: 'textfield-tab-label',
        path: 'textfield-tab-path',
        display: true,
        fullWidth: 'textfield-classname',
        hidePaddingLeft: true,
        alignRight: true
      }
    ];

    const { getByTestId } = render(<BaseComponent columns={columns} />);

    const tableCellElement = getByTestId('head-item');

    expect(haveClass(tableCellElement.classList, 'noMarginCell')).toBeTruthy();
    expect(haveClass(tableCellElement.classList, 'alignRight')).toBeTruthy();
  });
});
