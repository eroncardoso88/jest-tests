import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Route } from 'react-router-dom';
import { TestWrapping } from 'utils/TestWrapping';
import { FilterProvider, ReportProvider } from '../../store';
import ListContainer from './ListContainer';
import {
  getReports,
  activateReport,
  deactivateReport
} from 'services/contractsAllocationReport';
import * as mockData from 'components/ContractsAllocation/ContractsAllocationReport/store/report/mockData';

jest.mock('services/contractsAllocationReport');

getReports.mockImplementation(() =>
  Promise.resolve({
    data: mockData.getReports,
    headers: {
      'x-total-pages': 1,
      'x-total-count': 3
    }
  })
);

const BaseComponent = () => {
  const BASE_URL = '/alocacao-de-contratos/relatorio';

  return (
    <TestWrapping initialEntries={[BASE_URL]}>
      <FilterProvider>
        <ReportProvider>
          <Route exact path={BASE_URL} component={ListContainer} />
        </ReportProvider>
      </FilterProvider>
    </TestWrapping>
  );
};

const ModalTests = async ({ itemId }) => {
  const { getByTestId, findByTestId } = render(<BaseComponent />);

  const listContainer = await findByTestId('list-container');
  expect(listContainer).toBeInTheDocument();

  await fireEvent.click(getByTestId(`switch-${itemId}`));
  expect(getByTestId(/modal/i)).toBeInTheDocument();

  const justificationContainer = getByTestId('justification-input');
  const [, textAreaContainer] = justificationContainer.childNodes;
  textAreaContainer.click();
  const [textAreaElement] = textAreaContainer.childNodes;

  fireEvent.change(textAreaElement, {
    target: { value: 'Justificativa' }
  });

  const consolidateButton = getByTestId('consolidate-button');
  consolidateButton.click();
};

describe('List container', () => {
  it('renders without crashing', async () => {
    const { findByTestId } = render(<BaseComponent />);

    const listContainer = await findByTestId('list-container');

    expect(listContainer).toBeInTheDocument();
  });

  it('open and close modal', async () => {
    const { getByTestId, findByTestId } = render(<BaseComponent />);

    const listContainer = await findByTestId('list-container');
    expect(listContainer).toBeInTheDocument();

    fireEvent.click(getByTestId(/switch-1/i));

    expect(getByTestId(/modal/i)).toBeInTheDocument();

    fireEvent.click(getByTestId(/close-button/i));
  });

  it('enable item', async () => {
    activateReport.mockImplementation(() => Promise.resolve({}));
    await ModalTests({ itemId: 1 });
  });

  it('on error when enable item', async () => {
    activateReport.mockImplementation(() => Promise.reject({}));
    await ModalTests({ itemId: 1 });
  });

  it('disable item', async () => {
    deactivateReport.mockImplementation(() => Promise.resolve({}));
    await ModalTests({ itemId: 3 });
  });

  it('on error when disable item', async () => {
    deactivateReport.mockImplementation(() => Promise.reject({}));
    await ModalTests({ itemId: 3 });
  });
});
