
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Route } from 'react-router-dom';
import { TestWrapping } from 'utils/TestWrapping';
import { FilterProvider, ReportProvider } from '../../store';
import { getHistory } from 'services/contractsAllocationReport';
import * as mockData from 'components/ContractsAllocation/ContractsAllocationReport/store/report/mockData';
import HistoryListContainer from './HistoryListContainer';

jest.mock('services/contractsAllocationReport');

getHistory.mockImplementation(() =>
  Promise.resolve({ data: mockData.getHistory })
);

const BaseComponent = ({ id = 1 }) => {
  const BASE_URL = '/alocacao-de-contratos/relatorio';
  const URL = `${BASE_URL}/${id}/historico`;

  return (
    <TestWrapping initialEntries={[URL]}>
      <FilterProvider>
        <ReportProvider>
          <Route exact path={URL} component={HistoryListContainer} />
        </ReportProvider>
      </FilterProvider>
    </TestWrapping>
  );
};

describe('History list container', () => {
  it('renders without crashing', async () => {
    const { getByTestId, findByTestId } = render(<BaseComponent />);

    const historyTableContainer = await findByTestId('history-table');

    expect(historyTableContainer).toBeInTheDocument();

    fireEvent.click(getByTestId('header-button'));
  });
});
