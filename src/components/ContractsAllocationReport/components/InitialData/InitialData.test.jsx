import React from 'react';
import { render, fireEvent, waitForDomChange } from '@testing-library/react';
import InitialData from './InitialData';

const BaseComponent = ({
  handleChange = () => {},
  handleClick = () => {},
  disableSelect = {
    month: false,
    year: false,
    balance: false
  },
  selectValues = {
    month: 'january',
    year: '2020',
    balance: 'balance'
  },
  isCreatePage = false,
  balances = [{ id: 1, name: 'balance' }, { id: 2, name: 'balance2' }]
}) => (
  <InitialData
    handleChange={handleChange}
    handleClick={handleClick}
    disableSelect={disableSelect}
    selectValues={selectValues}
    isCreatePage={isCreatePage}
    balances={balances}
  />
);

describe('InitialData', () => {
  it('renders without crashing', () => {
    const { container } = render(<BaseComponent />);
    expect(container).toBeInTheDocument();
  });

  it('on click button', () => {
    const handleClick = jest.fn();
    const { getByTestId } = render(<BaseComponent handleClick={handleClick} />);

    const sendButton = getByTestId('generate-or-update-button');
    sendButton.click();
    expect(handleClick.mock.calls.length).toBe(1);
  });

  it('check on change function', async () => {
    const handleChange = jest.fn();

    const { getByTestId, getAllByTestId } = render(
      <BaseComponent handleChange={handleChange} />
    );

    const monthSelectButton = getByTestId('select-month');
    fireEvent.mouseDown(monthSelectButton.firstChild);
    const [monthListItem] = getAllByTestId('select-month-options');
    monthListItem.click();

    await waitForDomChange(() =>
      expect(handleChange).toHaveBeenCalledWith('month')
    );
    handleChange.mockClear();

    const yearSelectButton = getByTestId('select-year');
    fireEvent.mouseDown(yearSelectButton.firstChild);
    const [yearListItem] = getAllByTestId('select-year-options');
    yearListItem.click();

    await waitForDomChange(() =>
      expect(handleChange).toHaveBeenCalledWith('year')
    );
    handleChange.mockClear();

    const balanceSelectButton = getByTestId('select-balance');
    fireEvent.mouseDown(balanceSelectButton.firstChild);
    const [balanceListItem] = getAllByTestId('select-balance-options');
    balanceListItem.click();

    await waitForDomChange(() =>
      expect(handleChange).toHaveBeenCalledWith('balance')
    );
  });

  it('is create page active', () => {
    const { getByText } = render(<BaseComponent isCreatePage={true} />);
    const generateReportText = getByText(
      'contractsAllocationReport.components.initialData.generateReport'
    );
    expect(generateReportText).toBeInTheDocument();
  });
});
