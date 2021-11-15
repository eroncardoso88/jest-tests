/* istanbul ignore file */

export const getReports = [
  {
    id: 1,
    revision: 1,
    type: 'Draft',
    active: false,
    referenceMonth: '2020-02-18',
    changeAt: '2020-02-18T13:35:57.726Z',
    balanceId: 0,
    balanceDate: '2020-02-18',
    user: 'Mago',
    ICMSCost: 0,
    ICMSCostNotCreditable: 0
  },
  {
    id: 2,
    revision: 1,
    type: 'Draft',
    active: false,
    referenceMonth: '2020-01-18',
    changeAt: '2020-02-18T13:25:57.726Z',
    balanceId: 0,
    balanceDate: '2020-02-18',
    user: 'Betão',
    ICMSCost: 0,
    ICMSCostNotCreditable: 0
  },
  {
    id: 3,
    revision: 2,
    type: 'Consolidated',
    active: true,
    referenceMonth: '2019-12-18',
    changeAt: '2020-02-18T13:15:57.726Z',
    balanceId: 0,
    balanceDate: '2020-02-18',
    user: 'Mago',
    ICMSCost: 0,
    ICMSCostNotCreditable: 0
  }
];

export const getReport = {
  id: 3,
  revision: 1,
  referenceMonth: '2020-02-18',
  type: 'Draft',
  manual: true,
  balance: 1,
  active: true,
  ICMSCost: 0,
  ICMSCostNotCreditable: 0,
  sources: [
    {
      sourceContractId: 0,
      sourceUnitId: 0,
      sourceName: "Contrato 1",
      type: "contract",
      availablePower: 1000,
      availableForSale: 300,
      cost: 200,
      balance: 2,
      destinations: [
        {
          unitId: 3,
          unitName: 'Empresa A',
          allocatedPower: 100,
          ICMSCost: 200,
          ICMSCostNotCreditable: 300
        },
        {
          unitId: 4,
          unitName: 'Empresa A',
          allocatedPower: 200,
          ICMSCost: 0,
          ICMSCostNotCreditable: 0
        }
      ],
      destinationStates: [
        {
          stateId: 0,
          stateName: 'São Paulo',
          allocatedPower: 300
        }
      ]
    },
    {
      sourceContractId: 1,
      sourceUnitId: 0,
      sourceName: "Contrato 2",
      type: "contract",
      availablePower: 200,
      availableForSale: 0,
      cost: 200,
      balance: 2,
      destinations: [
        {
          unitId: 4,
          unitName: 'Empresa A',
          allocatedPower: 200,
          ICMSCost: 0,
          ICMSCostNotCreditable: 0
        }
      ],
      destinationStates: [
        {
          stateId: 0,
          stateName: 'São Paulo',
          allocatedPower: 200
        }
      ]
    }
  ]
};

export const updateReport = getReport;

export const getHistory = [
  {
    id: 1,
    revision: 1,
    type: 'Draft',
    active: false,
    referenceMonth: '2020-02-18',
    changeAt: '2020-02-18T13:35:57.726Z',
    balanceId: 0,
    balanceDate: '2020-02-18',
    user: 'Mago',
    ICMSCost: 0,
    ICMSCostNotCreditable: 0,
    changeJustification: 'mudança 1'
  },
  {
    id: 1,
    revision: 2,
    type: 'Draft',
    active: false,
    referenceMonth: '2020-01-18',
    changeAt: '2020-02-18T13:25:57.726Z',
    balanceId: 0,
    balanceDate: '2020-02-18',
    user: 'Beto',
    ICMSCost: 0,
    ICMSCostNotCreditable: 0,
    changeJustification: 'mudança 2'
  },
  {
    id: 1,
    revision: 3,
    type: 'Consolidated',
    active: true,
    referenceMonth: '2019-12-18',
    changeAt: '2020-02-18T13:15:57.726Z',
    balanceId: 0,
    balanceDate: '2020-02-18',
    user: 'Renan',
    ICMSCost: 0,
    ICMSCostNotCreditable: 0,
    changeJustification: 'mudança 3'
  }
];

export const getHistoryDetail = {
  ...getReport,
  revision: 2
};

export const activateReport = {
  ...getReport,
  active: true
};

export const deactivateReport = {
  ...getReport,
  active: false
};

export const generateReport = { ...getReport, id: 0, revision: 0 };

export const getSourcesAndDestinations = {
  destinations: [
    {
      unitId: 3,
      unitName: 'Empresa A',
      consumption: 200
    },
    {
      unitId: 4,
      unitName: 'Empresa A',
      consumption: 200
    }
  ]
}