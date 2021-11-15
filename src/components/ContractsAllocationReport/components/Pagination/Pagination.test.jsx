import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Pagination from './Pagination';
import { useTranslation } from 'react-i18next';

const BaseComponent = ({
  itemsCount = 150,
  pageSize = 25,
  currentPage = 1,
  onPageChange = () => {},
  onChangeRowsPerPage = () => {},
  pageOptions
}) => (
  <Pagination
    itemsCount={itemsCount}
    pageSize={pageSize}
    currentPage={currentPage}
    onPageChange={onPageChange}
    onChangeRowsPerPage={onChangeRowsPerPage}
    pageOptions={pageOptions}
  />
);

describe('Pagination', () => {
  it('check default render', async () => {
    const { getByTestId } = render(<BaseComponent />);

    expect(getByTestId('table-pagination-root')).toBeInTheDocument();
  });

  it('check the range offset', async () => {
    const pageSize = 50;
    const itemsCount = 300;
    const currentPage = 2;

    const { t } = useTranslation();

    const { getByText } = render(
      <BaseComponent
        pageSize={pageSize}
        itemsCount={itemsCount}
        currentPage={currentPage}
      />
    );

    const startInterval = pageSize * currentPage + 1;
    const endInterval = startInterval + pageSize - 1;

    const interval = `${startInterval}-${endInterval} ${t(
      'label_in'
    )} ${itemsCount}`;

    expect(getByText(interval)).toBeInTheDocument();
  });

  it('check back button ', async () => {
    const handleOnPageChange = jest.fn();

    const currentPage = 2;

    const { getByTestId } = render(
      <BaseComponent
        currentPage={currentPage}
        onPageChange={handleOnPageChange}
      />
    );

    const backButton = getByTestId('back-button');

    fireEvent.click(backButton);

    expect(handleOnPageChange).toHaveBeenCalledWith(currentPage - 1);
  });

  it('check next button ', async () => {
    const handleOnPageChange = jest.fn();

    const currentPage = 1;

    const { getByTestId } = render(
      <BaseComponent
        currentPage={currentPage}
        onPageChange={handleOnPageChange}
      />
    );

    const nextButton = getByTestId('next-button');

    fireEvent.click(nextButton);

    expect(handleOnPageChange).toHaveBeenCalledWith(currentPage + 1);
  });

  it('change rows per page', () => {
    const onChangeRowsPerPage = jest.fn();

    const { getByTestId } = render(
      <BaseComponent onChangeRowsPerPage={onChangeRowsPerPage} />
    );

    const resultsPerPage = getByTestId('table-pagination-root').querySelector(
      'div[aria-haspopup="listbox"]'
    );

    fireEvent.mouseDown(resultsPerPage);

    const [, fiftyOption] = document.querySelectorAll('li[role="option"]');

    fireEvent.click(fiftyOption);

    expect(onChangeRowsPerPage).toBeCalled();
    const changedTo = onChangeRowsPerPage.mock.calls[0][0].target.value;
    expect(changedTo).toBe('50');
  });
});
