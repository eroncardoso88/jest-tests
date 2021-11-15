import { formatBrToNumber } from './formatValue';

import { formatWithoutBRL } from './format';

export default function deficitCalculate(
  contracts,
  allocationValue,
  selectedUnit,
  unitIndex
) {
  const units = contracts.units;

  return units.map((unit, index) => {
    if (selectedUnit.unitId === unit.unitId && index === unitIndex) {
      const allocated = formatBrToNumber(allocationValue);
      const cost = formatBrToNumber(unit.cost);

      return {
        ...unit,
        deficit: formatWithoutBRL(cost - allocated)
      };
    }
    return unit;
  });
}

export function sumTotalCost(data) {
  return data.reduce((newItem, currentItem) => newItem + currentItem.cost, 0);
}

export function sumTotalICMS(data) {
  return data.reduce((newItem, current) => newItem + current.icms_value, 0);
}

export function sumTotalDeficit(data) {
  return data.reduce((newItem, current) => newItem + current.deficit, 0);
}
