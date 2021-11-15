import * as _ from 'lodash';
import isArrayEmpty from './validate';

function associateContractIdToUnit(data) {
  return data.reduce((newItem, currentItem) => {
    const { destinations } = currentItem;

    const destination = destinations.map(item => ({
      ...item,
      sourceContractId: currentItem.sourceContractId
    }));

    if (isArrayEmpty(destination)) return newItem;
    return newItem.concat(destination);
  }, []);
}

function validUnit(unit, sourceContractId) {
  return !unit || unit.sourceContractId !== sourceContractId;
}

function checkIfContractHasUnit(agroupedUnits, header) {
  return header.reduce((newHeader, currentHeader) => {
    const unitHasSameSourceContract = agroupedUnits.find(
      unit => unit.sourceContractId === currentHeader.sourceContractId
    );

    if (validUnit(unitHasSameSourceContract, currentHeader.sourceContractId)) {
      return newHeader.concat(null);
    }

    return newHeader.concat(
      unitHasSameSourceContract.allocatedPower
        ? unitHasSameSourceContract.allocatedPower
        : null
    );
  }, []);
}

function findConsumptionById(data, unitId) {
  const { consumption } = data.find(item => item.unitId === unitId);
  return consumption ? consumption : 0;
}

function concatUnits(data, header, destinations) {
  return data.reduce(
    (newUnit, currentUnit, _, array) => {
      const contracts = checkIfContractHasUnit(array, header);
      const consumptionPeerUnit = findConsumptionById(
        destinations,
        currentUnit.unitId
      );
      const allocationSum = contracts.reduce((a, b) => a + b);
      return {
        unitName: currentUnit.unitName,
        unitId: currentUnit.unitId,
        stateId: currentUnit.stateId ,
        icms_value: newUnit.icms_value + currentUnit.ICMSCost,
        cost: consumptionPeerUnit,
        deficit: allocationSum - consumptionPeerUnit,
        contracts
      };
    },
    {
      unitName: '',
      icms_value: 0,
      cost: 0,
      deficit: 0,
      contracts: []
    }
  );
}

export function getAllocatedPowerByUnit(agroupedByState, header, destinations) {
  const agroupedUnits = associateContractIdToUnit(agroupedByState);
  const unitByGroup = _.groupBy(agroupedUnits, 'unitName');

  return Object.values(unitByGroup).reduce((newItem, currentItem) => {
    const unit = concatUnits(currentItem, header, destinations);

    if (Object.keys(unit).length <= 0) return newItem;

    return newItem.concat({
      ...unit,
      icms_value: unit.icms_value
    });
  }, []);
}
