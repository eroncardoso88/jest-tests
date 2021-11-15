import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render, fireEvent, wait } from '@testing-library/react';
import DataTable from './DataTable';

const emptyApiResponse = {
  data: {
    totalCount: 1,
    count: 0,
    results: []
  }
};

const BaseComponent = ({
  title = 'table-title',
  columns = [],
  getData = () => emptyApiResponse,
  options = {},
  updateParams = () => {},
  ...rest
}) => (
  <BrowserRouter>
    <DataTable
      title={title}
      columns={columns}
      getData={getData}
      options={options}
      updateParams={updateParams}
      {...rest}
    />
  </BrowserRouter>
);

describe('DataTable', () => {
  it('should check default render', async () => {
    const { findByTestId } = render(<BaseComponent />);

    const datatable = await findByTestId('data-table');

    expect(datatable).toBeInTheDocument();
  });

  it('should check render pagination component when pass pagination prop', async () => {
    const { findByTestId } = render(
      <BaseComponent options={{ pagination: true }} />
    );

    const paginationRoot = await findByTestId('table-pagination-root');

    expect(paginationRoot).toBeInTheDocument();
  });

  it('should check not render pagination component when pass pagination prop as false', async () => {
    const { findByTestId } = render(
      <BaseComponent options={{ pagination: false }} />
    );

    expect(findByTestId('table-pagination-root')).rejects.toThrow();
  });

  it('should check to hide a column', async () => {
    const columns = [
      {
        path: 'column-path',
        label: 'column-label',
        common: true,
        display: true,
        viewColumns: true
      }
    ];

    const { getAllByTestId, getByTestId, findByTestId } = render(
      <BaseComponent columns={columns} options={{ filterColumns: true }} />
    );

    const headItem = await findByTestId('head-item');

    expect(headItem).toBeInTheDocument();

    const filterColumnButtonElement = getByTestId('filter-columns-button');
    fireEvent.click(filterColumnButtonElement);

    const [columnOption] = getAllByTestId('table-view-item');
    fireEvent.click(columnOption);

    await expect(findByTestId('head-item')).rejects.toThrow();
  });

  // @TODO - Remove act warning
  it('should check handle change rows per page', async () => {
    const updateParams = jest.fn();

    const { findByTestId } = render(
      <BaseComponent
        updateParams={updateParams}
        options={{ pagination: true }}
      />
    );

    const paginationRoot = await findByTestId('table-pagination-root');

    const resultsPerPage = paginationRoot.querySelector(
      'div[aria-haspopup="listbox"]'
    );

    fireEvent.mouseDown(resultsPerPage);

    const [, fiftyOption] = document.querySelectorAll('li[role="option"]');

    fireEvent.click(fiftyOption);

    expect(updateParams).toHaveBeenCalledWith({ page: 1 });
  });

  it('should check handle change page', async () => {
    const updateParams = jest.fn();

    const getData = () => ({
      data: { count: 100, results: [] }
    });

    const { findByTestId } = render(
      <BaseComponent
        updateParams={updateParams}
        options={{ pagination: true }}
        getData={getData}
      />
    );

    const nextButtonPagination = await findByTestId('next-button');

    fireEvent.click(nextButtonPagination);

    expect(updateParams).toHaveBeenCalled();
  });

  it('should check open and close view columns modal', async () => {
    const columns = [
      {
        path: 'column-path',
        label: 'column-label',
        common: true,
        display: true,
        viewColumns: true
      }
    ];

    const { findByTestId, queryByTestId } = render(
      <BaseComponent columns={columns} options={{ filterColumns: true }} />
    );

    const filterColumnButtonElement = await findByTestId(
      'filter-columns-button'
    );

    fireEvent.click(filterColumnButtonElement);

    const tableViewCheckbox = await findByTestId('table-view-checkbox');
    expect(tableViewCheckbox).toBeInTheDocument();

    const outsideContainer = document.querySelector('.MuiPopover-root')
      .firstElementChild;

    fireEvent.click(outsideContainer);

    // @TODO: Remove this 'wait'
    await wait(() => expect(queryByTestId('table-view-checkbox')).toBeFalsy());
  });

  it('should check open and close export modal', async () => {
    const { findByTestId, queryByTestId } = render(
      <BaseComponent options={{ exportButton: true }} />
    );

    const exportButton = await findByTestId('export-button');

    fireEvent.click(exportButton);

    const exportModal = await findByTestId('export-modal');
    expect(exportModal).toBeInTheDocument();

    const outsideContainer = document.querySelector('.MuiPopover-root')
      .firstElementChild;

    fireEvent.click(outsideContainer);

    // @TODO: Remove this 'wait'
    await wait(() => expect(queryByTestId('export-modal')).toBeFalsy());
  });

  it('should not be able render edition header title section when pass the prop as false', async () => {
    const { findByTestId } = render(
      <BaseComponent options={{ editionHeaderTitle: false }} />
    );

    await expect(
      findByTestId('edition-header-title-container')
    ).rejects.toThrow();
  });

  it('should be able render add button when pass the prop', async () => {
    const { findByTestId } = render(
      <BaseComponent options={{ addButton: { url: '/add-button' } }} />
    );

    const addButton = await findByTestId('add-button');

    expect(addButton).toBeInTheDocument();
  });

  it('should not be able render add button when pass the prop as false', async () => {
    const { findByTestId } = render(
      <BaseComponent options={{ addButton: false }} />
    );

    await expect(findByTestId('add-button')).rejects.toThrow();
  });

  it('should be able render prioritize button when pass the prop', async () => {
    const { findByTestId } = render(
      <BaseComponent
        options={{
          prioritizeButton: {
            url: '/prioritize-button',
            title: 'prioritizeButton'
          }
        }}
      />
    );

    const prioritizeButton = await findByTestId('prioritize-button');

    expect(prioritizeButton).toBeInTheDocument();
  });

  it('should not be able render prioritize button when pass the prop as false', async () => {
    const { findByTestId } = render(
      <BaseComponent options={{ prioritizeButton: false }} />
    );

    await expect(findByTestId('prioritize-button')).rejects.toThrow();
  });

  it('should be able render captions when pass them as prop', async () => {
    const captions = [
      { title: 'caption1' },
      { title: 'caption2' },
      { title: 'caption3' }
    ];

    const { findAllByTestId } = render(
      <BaseComponent options={{ captions }} />
    );

    const captionTitleItems = await findAllByTestId('caption-title');

    expect(captionTitleItems.length).toBe(captions.length);
  });

  it('should check export pdf and csv function', async () => {
    const exportFile = jest.fn();

    const { getByTestId, findByTestId } = render(
      <BaseComponent options={{ exportButton: true, exportFile }} />
    );

    const exportButton = await findByTestId('export-button');
    fireEvent.click(exportButton);

    const exportPdfButton = getByTestId('export-pdf-button');
    fireEvent.click(exportPdfButton);

    const exportCsvButton = getByTestId('export-csv-button');
    fireEvent.click(exportCsvButton);

    expect(exportFile.mock.calls.length).toBe(2);
  });

  it('should check render data inside the table', async () => {
    const columns = [
      {
        path: 'column-path',
        label: 'column-label',
        common: true,
        display: true,
        viewColumns: true,
        content: item => <div data-testid="row-item">{item}</div>
      }
    ];

    const results = ['Item1', 'Item2', 'Item3'];

    const getData = () => ({ data: { count: 3, results } });

    const { findAllByTestId } = render(
      <BaseComponent columns={columns} getData={getData} />
    );

    const rowItemsElements = await findAllByTestId('row-item');

    expect(rowItemsElements.length).toBe(results.length);
  });

  it('should check ordering with localSort prop', async () => {
    const columns = [
      {
        path: 'column-path',
        label: 'column-label',
        commonWithSort: true,
        display: true,
        viewColumns: true,
        sortName: 'title',
        content: item => <div data-testid="row-item">{item.title}</div>
      }
    ];

    const results = [{ title: 'B' }, { title: 'C' }, { title: 'A' }];

    const getData = () => ({ data: { count: 3, results } });

    const { getAllByTestId, findByTestId } = render(
      <BaseComponent columns={columns} getData={getData} localSort />
    );

    const sortButtonElement = await findByTestId('sort-button');

    fireEvent.click(sortButtonElement);

    const orderedElements = getAllByTestId('row-item');

    expect(orderedElements[0].textContent).toBe('A');
    expect(orderedElements[1].textContent).toBe('B');
    expect(orderedElements[2].textContent).toBe('C');

    fireEvent.click(sortButtonElement);

    expect(orderedElements[0].textContent).toBe('C');
    expect(orderedElements[1].textContent).toBe('B');
    expect(orderedElements[2].textContent).toBe('A');
  });

  it('should check ordering without localSort prop', async () => {
    const columns = [
      {
        path: 'column-path',
        label: 'column-label',
        commonWithSort: true,
        display: true,
        viewColumns: true,
        sortName: 'title',
        content: item => <div data-testid="row-item">{item.title}</div>
      }
    ];

    const results = [{ title: 'B' }, { title: 'C' }, { title: 'A' }];

    const getData = () => ({ data: { count: 3, results } });

    const updateParams = jest.fn();

    const { findByTestId } = render(
      <BaseComponent
        columns={columns}
        getData={getData}
        localSort={false}
        updateParams={updateParams}
        params={{ sort: true }}
      />
    );

    const sortButtonElement = await findByTestId('sort-button');

    fireEvent.click(sortButtonElement);

    expect(updateParams).toHaveBeenCalledWith({ sort: 'title' });
  });

  it('should check ordering without localSort prop and custom sort params', async () => {
    const columns = [
      {
        path: 'column-path',
        label: 'column-label',
        commonWithSort: true,
        display: true,
        viewColumns: true,
        sortName: 'title',
        content: item => <div data-testid="row-item">{item.title}</div>
      }
    ];

    const results = [{ title: 'B' }, { title: 'C' }, { title: 'A' }];

    const getData = () => ({ data: { count: 3, results } });

    const updateParams = jest.fn();

    const { findByTestId } = render(
      <BaseComponent
        columns={columns}
        getData={getData}
        localSort={false}
        updateParams={updateParams}
        params={{ sort: 'title' }}
      />
    );

    const sortButtonElement = await findByTestId('sort-button');

    fireEvent.click(sortButtonElement);

    expect(updateParams).toHaveBeenCalledWith({ sort: '-title' });
  });

  it('should check ordering without localSort prop and without sort params', async () => {
    const columns = [
      {
        path: 'column-path',
        label: 'column-label',
        commonWithSort: true,
        display: true,
        viewColumns: true,
        sortName: 'title',
        content: item => <div data-testid="row-item">{item.title}</div>
      }
    ];

    const results = [{ title: 'B' }, { title: 'C' }, { title: 'A' }];

    const getData = () => ({ data: { count: 3, results } });

    const updateParams = jest.fn();

    const { findByTestId } = render(
      <BaseComponent
        columns={columns}
        getData={getData}
        localSort={false}
        updateParams={updateParams}
        params={{ sort: false }}
      />
    );

    const sortButtonElement = await findByTestId('sort-button');

    fireEvent.click(sortButtonElement);

    expect(updateParams).toHaveBeenCalledWith({ sort: 'title' });
  });

  it('change title style', async () => {
    const results = [{ title: 'B' }, { title: 'C' }, { title: 'A' }];
    const getData = () => ({ data: { count: 3, results } });

    const { findByText } = render(
      <BaseComponent
        title="My title"
        titleCustomStyle="my-custom-class"
        getData={getData}
      />
    );

    const title = await findByText(/My title/i);
    expect(title).toBeInTheDocument();
    expect(title.classList.contains('my-custom-class')).toBeTruthy();
  });

  it('empty params', async () => {
    const { findByTestId } = render(<BaseComponent params={{ empty: '' }} />);

    const datatable = await findByTestId('data-table');

    expect(datatable).toBeInTheDocument();
  });

  it('generate error on getData', async () => {
    const getData = () => Promise.reject();

    const { findByTestId } = render(
      <BaseComponent params={{ empty: '' }} getData={getData} />
    );

    const datatable = await findByTestId('data-table');

    expect(datatable).toBeInTheDocument();
  });

  it('when send values data', async () => {
    const { findByTestId } = render(
      <BaseComponent values={{ data: { results: ['first', 'second'] } }} />
    );

    const datatable = await findByTestId('data-table');

    expect(datatable).toBeInTheDocument();
  });

  it('force failure to export to a pdf file', async () => {
    global.alert = jest.fn();

    const exportFile = () => Promise.reject();

    const { getByTestId, findByTestId } = render(
      <BaseComponent options={{ exportButton: true, exportFile }} />
    );

    const exportButton = await findByTestId('export-button');
    fireEvent.click(exportButton);

    const exportPdfButton = getByTestId('export-pdf-button');
    await fireEvent.click(exportPdfButton);

    expect(global.alert).toBeCalledTimes(1);
  });
});
