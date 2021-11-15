import actions from './actions';
import initialState from './initialState';
import months from '../../utils/months';
import * as mockData from './mockData';
import * as provider from 'services/contractsAllocationReport';
import getStates from '../../../../../__mocks__/states';

jest.mock('services/contractsAllocationReport');

provider.generateReport.mockImplementation(() =>
  Promise.resolve({ data: mockData.generateReport })
);

provider.getBalances.mockImplementation(() =>
  Promise.resolve({ data: [{ id: 1, name: 'ABC' }, { id: 2, name: 'DEF' }] })
);

provider.getReport.mockImplementation(() =>
  Promise.resolve({ data: mockData.getReport })
);

provider.sendReport.mockImplementation(() => Promise.resolve({}));

provider.getHistory.mockImplementation(() =>
  Promise.resolve({ data: mockData.getHistory })
);

provider.getHistoryDetail.mockImplementation(() =>
  Promise.resolve({ data: mockData.getHistoryDetail })
);

provider.getReports.mockImplementation(() =>
  Promise.resolve({
    data: mockData.getReports,
    headers: {
      'x-total-pages': 1,
      'x-total-count': 3
    }
  })
);
provider.deactivateReport.mockImplementation(() =>
  Promise.resolve({ data: mockData.deactivateReport })
);
provider.activateReport.mockImplementation(() =>
  Promise.resolve({ data: mockData.activateReport })
);

provider.updateReport.mockImplementation(() =>
  Promise.resolve({ data: mockData.updateReport })
);

describe('Actions', () => {
  let $report = initialState;
  const mockSetReport = jest.fn(updateValue =>
    typeof updateValue === 'function'
      ? ($report = updateValue($report))
      : ($report = updateValue)
  );
  const {
    setField,
    setData,
    clearState,
    generateReport,
    getReportsList,
    getReport,
    updateReport,
    getHistory,
    getHistoryDetail,
    getComments,
    activateReport,
    deactivateReport
  } = actions(mockSetReport);

  const mockComments = data =>
    data.map(item => ({
      revision: item.revision,
      user: item.user,
      changeAt: item.changeAt,
      message: item.changeJustification
    }));

  beforeEach(() => {
    clearState();
    mockSetReport.mockClear();
  });

  it('clear state', () => {
    expect(initialState).toMatchObject($report);
  });

  it('set report', () => {
    setField('test', 1);
    expect(mockSetReport.mock.calls.length).toBe(1);
    const expectedState = {
      ...initialState,
      test: 1
    };
    expect(expectedState).toMatchObject($report);
  });

  it('set data', () => {
    setData({ test: 1 });
    expect(mockSetReport.mock.calls.length).toBe(1);
    const expectedState = {
      ...initialState,
      test: 1
    };
    expect(expectedState).toMatchObject($report);
  });

  it('generate report', () => {
    const reportGenerated = generateReport('2020', 'february', 'balance');
    const expectedState = {
      ...initialState,
      ...reportGenerated
    };

    expect(expectedState).toMatchObject($report);
  });

  //@TODO: Add right params and return when api is done
  it('get reports list', async () => {
    const expectedReturn = {
      data: {
        totalCount: 1,
        count: 3,
        results: mockData.getReports
      }
    };
    await expect(getReportsList('')).resolves.toMatchObject(expectedReturn);
  });

  it('get report', async () => {
    await expect(getReport(1)).resolves.toMatchObject(mockData.getReport);
  });

  it('update report', async () => {
    await expect(updateReport($report, 'teste')).resolves.toMatchObject(
      mockData.getReport
    );
  });

  it('get history', async () => {
    await expect(getHistory(1)).resolves.toMatchObject(mockData.getHistory);
  });

  it('get history details', async () => {
    const historyDetail = await getHistoryDetail(1, 1);
    expect(historyDetail).toMatchObject(mockData.getHistoryDetail);
    const comments = await getComments(historyDetail.id);
    const history = await getHistory(1);
    expect(comments).toMatchObject(mockComments(history));

    const { referenceMonth } = historyDetail;
    const expectedState = {
      ...initialState,
      ...historyDetail,
      comments,
      selectValues: {
        year: new Date(referenceMonth).getFullYear(),
        month: months[new Date(referenceMonth).getMonth()],
        balance: 'balance'
      }
    };

    expect($report).toMatchObject(expectedState);
  });

  it('activate report', async () => {
    await expect(
      activateReport(1, { changeJustification: 'teste' })
    ).resolves.toMatchObject(mockData.activateReport);
  });

  it('deactivate report', async () => {
    await expect(
      deactivateReport(1, { changeJustification: 'teste' })
    ).resolves.toMatchObject(mockData.deactivateReport);
  });
});
