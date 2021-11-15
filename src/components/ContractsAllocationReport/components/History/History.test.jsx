import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import History from './History';

const defaultTable = {
  data: [
    {
      name: 'My Name',
      value: 1,
      value2: 1,
      sortName: 1
    },
    {
      name: 'My Name 2',
      value: 2,
      value2: 2,
      sortName: 2,
    },
    {
      name: 'My Name 3',
      value: 3,
      value2: 3,
      sortName: 3,
    },
  ],
  columns: [
    {
      name: 'My column',
      display: true,
      label: 'My label',
      basic: undefined,
      value: 1,
      content: () => <span>My content</span>,
    },
    {
      display: true,
      path: '/2',
      label: 'My label 2',
      fullWidth: true,
      value: 2,
      content: () => <span>My content 2</span>,
    },
    {
      display: true,
      key: +new Date(),
      label: 'My label 2',
      basic: undefined,
      value: 3,
      content: () => <span>My content 2</span>,
    }
  ]
};

describe('History', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(<History columns={defaultTable.columns} />);
    expect(getByTestId('history-toolbar')).toBeInTheDocument();
    expect(getByTestId('history-table')).toBeInTheDocument();
    expect(getByTestId('pagination-navigation')).toBeInTheDocument();
  });

  it('check toolbar', () => {
    const onBack = jest.fn();
    const toolbarTitle = 'My title';

    const { getByTestId } = render(
      <History
        title={toolbarTitle}
        goBack={onBack}
        toolbar
      />
    );

    const headerTitle = getByTestId('history-toolbar-title');
    expect(headerTitle.innerHTML).toBe(toolbarTitle);

    const headerButton = getByTestId('header-button');
    headerButton.click();
    expect(onBack).toBeCalled();
    expect(onBack.mock.calls.length).toBe(1);
  });

  it('with divider', () => {
    const { getByTestId } = render(<History divider />);
    expect(getByTestId('divider')).toBeInTheDocument();
  });

  it('basic table', () => {
    const basicTable = {
      ...defaultTable,
      columns: [{
        ...defaultTable.columns[0],
        basic: true
      }]
    };

    const { getByTestId, queryByTestId } = render(<History {...basicTable} />);
    expect(getByTestId('history-table')).toBeInTheDocument();
    expect(queryByTestId('history-table-textfield')).toBeNull();
  });

  it('full table', () => {
    const fullTable = {
      ...defaultTable,
      columns: [{
        ...defaultTable.columns[0],
        basic: false
      }]
    };

    const { getByTestId } = render(<History {...fullTable} />);
    expect(getByTestId('history-table')).toBeInTheDocument();
    expect(getByTestId('history-table-textfield')).toBeInTheDocument();
    fireEvent.change(getByTestId('history-table-textfield-input'), {
      target: { value: 'My value' }
    });
  });

  it('table with radio', () => {
    const onFilter = jest.fn();
    const radioTable = {
      ...defaultTable,
      columns: [{
        ...defaultTable.columns[0],
        basic: false,
        radio: true,
      }]
    };

    const { getByTestId } = render(
      <History {...radioTable} setFilterState={onFilter} />
    );

    expect(getByTestId('history-table')).toBeInTheDocument();
    fireEvent.click(getByTestId('history-table-radio-input'));
  });

  it('table with date', () => {
    const dateTable = {
      ...defaultTable,
      columns: [{
        ...defaultTable.columns[0],
        name: 'date'
      }]
    };

    const { getByTestId } = render(<History {...dateTable} />);
    expect(getByTestId('history-table')).toBeInTheDocument();
  });

  it('table without content', () => {
    const radioTable = {
      ...defaultTable,
      columns: [
        { ...defaultTable.columns[0] },
        {
          ...defaultTable.columns[0],
          content: undefined
        },
      ]
    };

    const { getByTestId } = render(<History {...radioTable} />);
    expect(getByTestId('history-table')).toBeInTheDocument();
  });

  it('table with sort disabled', () => {
    const setFilterState = jest.fn();
    const radioTable = {
      ...defaultTable,
      columns: [
        {
          ...defaultTable.columns[0],
          disableSort: false,
          setFilterState,
          path: 'value',
        },
        {
          ...defaultTable.columns[0],
          disableSort: false,
          name: 'My name 2',
          label: 'My label 2',
          sortName: 'sortName',
          setFilterState
        },
        {
          ...defaultTable.columns[0],
          disableSort: false,
          setFilterState,
          path: 'value2',
        },
      ]
    };

    const { getByTestId } = render(<History {...radioTable} />);

    const firstElementOfTable = getByTestId(`disable-sort-button-${radioTable.columns[0].path}`);
    fireEvent.click(firstElementOfTable);

    const secondElementOfTable = getByTestId(`disable-sort-button-${radioTable.columns[1].sortName}`);
    fireEvent.click(secondElementOfTable);

    const thirdElementOfTable = getByTestId(`disable-sort-button-${radioTable.columns[2].path}`);
    fireEvent.click(thirdElementOfTable);
  });

  it('paginate page', async () => {
    const data = new Array(100).fill({}).map((_, index) => ({
      name: `My Name ${index}`,
      [`value${index}`]: index,
      [`sortName${index}`]: index
    }));

    const columns = new Array(100).fill({}).map((_, index) => ({
      name: `My name ${index}`,
      display: true,
      label: `My label ${index}`,
      basic: true,
      value: `value${index}`,
      content: () => <span>My content {index}</span>,
    }));

    const props = { data, columns };
    const { getByTestId } = render(<History {...props} />);

    const backButton = getByTestId('next-button');
    fireEvent.click(backButton);

    const nextButton = getByTestId('back-button');
    fireEvent.click(nextButton);

    const resultsPerPage = getByTestId('table-pagination-root')
      .querySelector('div[aria-haspopup="listbox"]');

    fireEvent.mouseDown(resultsPerPage);

    const [, fiftyOption] = document.querySelectorAll('li[role="option"]');

    fireEvent.click(fiftyOption);
  });
});
