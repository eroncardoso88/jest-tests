import * as _ from 'lodash';
import isArrayEmpty from './validate';
import { formatToBRL } from './format';
import { getAllocatedPowerByUnit } from './unit';
import { sumTotalCost, sumTotalDeficit, sumTotalICMS } from './calc';

export const states = [
  'Espírito Santo',
  'Maranhão',
  'Minas Gerais',
  'Rio de Janeiro',
  'Pará',
  'Mato Grosso do Sul',
  'Goiás'
];

function denyUnits(unit) {
  const units = {
    'Espírito Santo': [12, 19, 24, 10, 13, 14, 9],
    Maranhão: [12, 8, 19, 24, 13, 14, 9],
    'Minas Gerais': [12, 8, 19, 24, 10, 14, 9],
    'Rio de Janeiro': [12, 8, 24, 10, 13, 14, 9],
    Pará: [12, 8, 19, 24, 10, 13, 9],
    'Goiás': [12, 8, 24, 10, 13, 14, 19],
    'Mato Grosso do Sul': [8, 24, 10, 13, 14, 9, 19],
  };

  return units[unit];
}

function getInitialsOfState(state) {
const states = {
    'Rio de Janeiro': 'DISTRIBUIÇÃO RJ (MWh)',
    'Minas Gerais': 'DISTRIBUIÇÃO MG (MWh)',
    Pará: 'DISTRIBUIÇÃO PA (MWh)',
    Maranhão: 'DISTRIBUIÇÃO MA (MWh)',
    'Espírito Santo': 'DISTRIBUIÇÃO ES (MWh)',
    'Goiás': 'DISTRIBUIÇÃO MG (MWh)',
    'Mato Grosso do Sul': 'DISTRIBUIÇÃO MG (MWh)',
  };

  return states[state];
}

function createHeader(data) {
  return data
    .map(item => ({
      sourceName: item.sourceName,
      cost: `${formatToBRL(item.cost)} MW/h`,
      sourceContractId: item.sourceContractId,
      availableForSale: item.availableForSale,
      type: item.type
    }))
    .sort((item, index) => (item.type < index.type ? 1 : -1));
}

function filterByAllowedUnits(units, state) {
  return units.reduce((newUnit, currentUnit) => {
    console.log('unidade atual', currentUnit)
    const isDenied = denyUnits(state);

    return !isDenied.includes(currentUnit.stateId)
      ? newUnit.concat(currentUnit)
      : newUnit;
  }, []);
}

function getAllocatedPowerByContract(data, states) {
  return data.map(contract => {
    const selectedContract = states.find(
      state => state.sourceContractId === contract.sourceContractId
    );

    if (!selectedContract) return null;

    return selectedContract.allocatedPower;
  }, []);
}

function findByState(data, state) {
  return data.find(destination => destination.stateName === state);
}

function agroupByState(contracts, state) {
  return contracts.reduce((newContract, currentContract) => {
    const destinationExists = findByState(
      currentContract.destinationStates,
      state
    );

    if (!destinationExists) {
      return newContract;
    }

    return newContract.concat({
      ...destinationExists,
      sourceContractId: currentContract.sourceContractId,
      destinations: currentContract.destinations
    });
  }, []);
}

function createLineToAvailableForSales(headers, states) {
  const seletectedState = states.filter(
    state => state.stateName === 'Maranhão'
  );

  return headers.reduce((newItem, currentItem) => {
    const stateIsFounded = seletectedState.find(
      state => state.sourceContractId === currentItem.sourceContractId
    );

    if (stateIsFounded) {
      return newItem.concat(currentItem);
    }

    return newItem.concat(currentItem);
  }, []);
}

function createColumns(contracts, header, destinations) {
  return states.reduce((newState, currentState) => {
    const agroupedByState = agroupByState(contracts, currentState);
    if (isArrayEmpty(agroupedByState)) return newState;

    const units = getAllocatedPowerByUnit(
      agroupedByState,
      header,
      destinations
    );

    const allocatedContracts = getAllocatedPowerByContract(
      header,
      agroupedByState
    );

    const availableBySales = createLineToAvailableForSales(
      header,
      agroupedByState
    );

    const filteredUnits = filterByAllowedUnits(units, currentState);
    const costPeerUnit = sumTotalCost(units);
    const icmsPeerUnit = sumTotalICMS(filteredUnits);
    const deficitPeerUnit = sumTotalDeficit(filteredUnits);

    const selectedState = {
      stateName: getInitialsOfState(currentState),
      icms_value: icmsPeerUnit,
      cost: costPeerUnit,
      deficit: deficitPeerUnit,
      allocatedContracts,
      availableBySales,
      units: filteredUnits
    };

    return newState.concat(selectedState);
  }, []);
}

function createTable({ contracts, destinations }) {
  const header = createHeader(contracts);
  const columns = createColumns(contracts, header, destinations);
  return { header, columns };
}

export default createTable;
