import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react';
import { Route, useParams } from 'react-router-dom';
import { TestWrapping } from 'utils/TestWrapping';
import { FilterProvider, ReportProvider } from '../../store';
import ReportContainer from './ReportContainer';
import {
  generateReport,
  getBalances,
  updateReport,
  getReport,
  sendReport,
  getHistory,
  getHistoryDetail,
  getSourcesAndDestinations
} from 'services/contractsAllocationReport';
import * as mockData from 'components/ContractsAllocation/ContractsAllocationReport/store/report/mockData';

jest.mock('services/contractsAllocationReport');

jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  return {
    __esModule: true,
    ...originalModule,
    useParams: jest.fn().mockImplementation(() => ({}))
  };
});

generateReport.mockImplementation(() =>
  Promise.resolve({ data: mockData.generateReport })
);

getBalances.mockImplementation(() =>
  Promise.resolve({ data: [{ id: 1, name: 'ABC' }, { id: 2, name: 'DEF' }] })
);

getReport.mockImplementation(() =>
  Promise.resolve({ data: mockData.getReport })
);

sendReport.mockImplementation(() => Promise.resolve({}));

updateReport.mockImplementation(() =>
  Promise.resolve({ data: mockData.updateReport })
);

getHistory.mockImplementation(() =>
  Promise.resolve({ data: mockData.getHistory })
);

getHistoryDetail.mockImplementation(() =>
  Promise.resolve({ data: mockData.getHistoryDetail })
);

getSourcesAndDestinations.mockImplementation(() =>
  Promise.resolve({ data: mockData.getSourcesAndDestinations })
);

const BASE_URL = '/alocacao-de-contratos/relatorio';
const BaseComponent = () => (
  <TestWrapping initialEntries={[`${BASE_URL}/novo`]}>
    <FilterProvider>
      <ReportProvider>
        <Route path={`${BASE_URL}/novo`} component={ReportContainer} />
        <Route path={`${BASE_URL}/:id/edita`} component={ReportContainer} />
        <Route path={`${BASE_URL}/:id/resumo`} component={ReportContainer} />
        <Route
          path={`${BASE_URL}/:id/historico/:revisionId/detalhe`}
          component={ReportContainer}
        />
      </ReportProvider>
    </FilterProvider>
  </TestWrapping>
);

const generateNewReport = async ({ closeModal = false }) => {
  const element = render(<BaseComponent />);

  const reportContainer = await element.findByTestId('report-container');
  expect(reportContainer).toBeInTheDocument();

  fireEvent.click(element.getByTestId('generate-or-update-button'));

  if (closeModal) return element;

  const [consolidateButton] = await element.findAllByTestId('consolidate-button');
  fireEvent.click(consolidateButton);

  await waitFor(() => {
    expect(element.queryByAltText('Carregando')).not.toBeInTheDocument();
  });

  return element;
};

const goToResumeScreen = async () =>
  await generateNewReport({ closeModal: false });

describe('Report container', () => {
  it('renders without crashing', async () => {
    const { findByTestId } = render(<BaseComponent />);

    const reportContainer = await findByTestId('report-container');

    expect(reportContainer).toBeInTheDocument();
  });

  // it('click in add report', async () => {
  //   await goToResumeScreen();
  // });

  // it('click in add report and close modal', async () => {
  //   generateReport.mockImplementation(() =>
  //     Promise.resolve({ data: mockData.getReport })
  //   );
  //   const { findByTestId } = await generateNewReport({ closeModal: true });

  //   const closeButton = await findByTestId('close-button');

  //   fireEvent.click(closeButton);
  // });

  // it('click in add report and press back button', async () => {
  //   const { findByTestId } = await goToResumeScreen();

  //   const backButton = await findByTestId('back-button');

  //   fireEvent.click(backButton);
  // });

  // it('consolidate draft of an edit', async () => {
  //   const { getByTestId, getAllByTestId } = await goToResumeScreen();

  //   await act(async () => await fireEvent.click(getByTestId('draft-button')));

  //   const justificationContainer = getByTestId('justification-input');
  //   const [, textAreaContainer] = justificationContainer.childNodes;
  //   textAreaContainer.click();
  //   const [textAreaElement] = textAreaContainer.childNodes;
  //   await fireEvent.change(textAreaElement, {
  //     target: { value: 'My justification' }
  //   });

  //   const [, modalConsolidateButton] = getAllByTestId('consolidate-button');
  //   await act(async () => await fireEvent.click(modalConsolidateButton));
  // });

  // it('consolidate edit', async () => {
  //   updateReport.mockImplementation(() =>
  //     Promise.resolve({ data: mockData.updateReport })
  //   );
  //   generateReport.mockImplementation(() =>
  //     Promise.resolve({ data: mockData.getReport })
  //   );
  //   const { getByTestId, getAllByTestId } = await goToResumeScreen();

  //   const [consolidateButton] = getAllByTestId('consolidate-button');
  //   await act(async () => await fireEvent.click(consolidateButton));

  //   const justificationContainer = getByTestId('justification-input');
  //   const [, textAreaContainer] = justificationContainer.childNodes;
  //   textAreaContainer.click();
  //   const [textAreaElement] = textAreaContainer.childNodes;

  //   await fireEvent.change(textAreaElement, {
  //     target: { value: 'My justification' }
  //   });

  //   const [, modalConsolidateButton] = getAllByTestId('consolidate-button');
  //   await act(async () => await fireEvent.click(modalConsolidateButton));
  // });

  // it('change allocated power from the contract', async () => {
  //   const { getByTestId, getAllByTestId } = await goToResumeScreen();
  //   const [, AllocationByUnitTab] = getAllByTestId('tab-item');

  //   await act(async () => {
  //     await fireEvent.click(AllocationByUnitTab);
  //     expect(getByTestId('allocation-by-unit-tab')).toBeInTheDocument();
  //   });

  //   const allocatedPowerInput = document.getElementById('allocatedPower');
  //   fireEvent.change(allocatedPowerInput, {
  //     target: { value: '0' }
  //   });

  //   const [
  //     originTotalValue,
  //     originBalanceTotal,
  //     destinationTotalValue,
  //     destinationBalanceTotal
  //   ] = getAllByTestId('value');

  //   expect(originTotalValue.innerHTML).toBe('1,200 MWh');
  //   expect(originBalanceTotal.innerHTML).toBe('500 MWh');
  //   expect(destinationTotalValue.innerHTML).toBe('400 MWh');
  //   expect(destinationBalanceTotal.innerHTML).toBe('0 MWh');
  // });

  it('navigate between tabs', async () => {
    useParams.mockImplementation(() => ({ id: 3, revisionId: 2 }));
    const { getByTestId, getAllByTestId } = await goToResumeScreen();

    const [
      AllocationByStateTab,
      AllocationByUnitTab,
      HistoryTab
    ] = getAllByTestId('tab-item');

    await act(async () => {
      await fireEvent.click(AllocationByUnitTab);
      expect(getByTestId('allocation-by-unit-tab')).toBeInTheDocument();
    });

    await act(async () => {
      await fireEvent.click(HistoryTab);
      expect(getByTestId('comments-tab')).toBeInTheDocument();
    });

    await act(async () => {
      await fireEvent.click(AllocationByStateTab);
      expect(getByTestId('allocation-by-state-tab')).toBeInTheDocument();
    });
  });
});
