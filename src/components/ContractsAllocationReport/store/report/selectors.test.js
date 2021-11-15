import selectors from './selectors';
import actions from './actions';
import initialState from './initialState';
import * as mockData from './mockData';
import * as provider from 'services/contractsAllocationReport';

jest.mock('services/contractsAllocationReport');

provider.getBalances.mockImplementation(() =>
  Promise.resolve({
    data: [{ id: 1, name: 'balance' }, { id: 2, name: 'balance2' }]
  })
);

provider.getSourcesAndDestinations.mockImplementation(() =>
  Promise.resolve({ data: mockData.getSourcesAndDestinations })
);

provider.getReport.mockImplementation(() =>
  Promise.resolve({ data: mockData.getReport })
);

provider.getHistory.mockImplementation(() =>
  Promise.resolve({ data: mockData.getHistory })
);

provider.getHistoryDetail.mockImplementation(() =>
  Promise.resolve({ data: mockData.getHistoryDetail })
);

describe('Selectors', () => {
  let $report = initialState;
  const mockSetReport = jest.fn(updateValue =>
    typeof updateValue === 'function'
      ? ($report = updateValue($report))
      : ($report = updateValue)
  );
  const {
    getReport,
    getSourcesAndDestinations,
    clearState
  } = actions(mockSetReport);

  beforeEach(() => {
    clearState();
    mockSetReport.mockClear();
  });

  it('test get allocation by state', async () => {
    await getReport(1);
    const { getAllocationByStateData } = selectors($report);
    const translateString = jest.fn();
    const allocationData = getAllocationByStateData(
      ['São Paulo'],
      translateString
    );
    const expectedObject = {
      data: {
        results: [
          {
            sourceName: 'Contrato 1',
            type: 'contract',
            availablePower: 1000,
            value: 200000,
            availableForSale: 300,
            cost: 200,
            'São Paulo': 300
          },
          {
            sourceName: 'Contrato 2',
            type: 'contract',
            availablePower: 200,
            value: 40000,
            availableForSale: 0,
            cost: 200,
            'São Paulo': 200
          },
          {
            sourceName: undefined,
            type: '',
            availablePower: 1200,
            value: 240000,
            availableForSale: 300,
            cost: '',
            'São Paulo': 500
          },
          {
            sourceName: undefined,
            type: '',
            availablePower: 300,
            value: '',
            availableForSale: '',
            cost: ''
          }
        ]
      }
    };
    expect(translateString.mock.calls.length).toBe(2);
    expect(allocationData).toMatchObject(expectedObject);
  });

  // it('test get allocation by unit', async () => {
  //   await getReport(1);
  //   await getSourcesAndDestinations();

  //   const translateString = () => "VENDA";

  //   const { getAllocationByUnitData } = selectors($report);
  //   const allocationData = getAllocationByUnitData(translateString);

  //   const expectedObject = {
  //     data: {
  //       results: [
  //         {
  //           sourceContractId: 0,
  //           sourceName: "Contrato 1",
  //           sourceTotal: 1000,
  //           sourceBalance: 400,
  //           unitId: 3,
  //           unitName: "Empresa A",
  //           allocatedPower: 100,
  //           unitTotal: 200,
  //           unitBalance: 100,
  //           ICMSCost: 200,
  //           ICMSCostNotCreditable: 300
  //         },
  //         {
  //           sourceContractId: 0,
  //           sourceName: "Contrato 1",
  //           sourceTotal: 1000,
  //           sourceBalance: 400,
  //           unitId: 4,
  //           unitName: "Empresa A",
  //           allocatedPower: 200,
  //           unitTotal: 200,
  //           unitBalance: -200,
  //           ICMSCost: 0,
  //           ICMSCostNotCreditable: 0
  //         },
  //         {
  //           sourceContractId: 0,
  //           sourceName: "Contrato 1",
  //           sourceTotal: 1000,
  //           sourceBalance: 400,
  //           unitId: false,
  //           unitName: translateString(),
  //           allocatedPower: 300,
  //           ICMSCost: 0,
  //           ICMSCostNotCreditable: 0
  //         },
  //         {
  //           ICMSCost: 0,
  //           ICMSCostNotCreditable: 0,
  //           allocatedPower: 200,
  //           sourceBalance: 0,
  //           sourceContractId: 1,
  //           sourceName: "Contrato 2",
  //           sourceTotal: 200,
  //           unitBalance: -200,
  //           unitId: 4,
  //           unitName: "Empresa A",
  //           unitTotal: 200,
  //         }
  //       ]
  //     }
  //   };

  //   expect(allocationData).toMatchObject(expectedObject);
  // });

  it('cannot get allocation by state because data is empty', () => {
    const { getAllocationByStateData } = selectors($report);
    const translateString = jest.fn();
    const allocationData = getAllocationByStateData(
      ['São Paulo'],
      translateString
    );

    expect(allocationData).toMatchObject({ data: { results: [] } });
  });
});
