import typeStatus from '../../utils/typeStatus';

export default $report => {
  const getAllocationByStateData = (statesList, translateString) => {
    const { sources } = $report;
    if (!sources.length) return { data: { results: [] } };

    const stateTotals = {};
    statesList.forEach(state => {
      stateTotals[state] = 0;
    });

    const data = sources.reduce((accumulator, currentSource) => {
      const {
        sourceName,
        type,
        availablePower,
        cost,
        destinationStates,
        availableForSale
      } = currentSource;

      const states = destinationStates.reduce(
        (stateAccumulator, { stateName, allocatedPower }) => {
          stateTotals[stateName] += allocatedPower;

          return {
            ...stateAccumulator,
            [stateName]: allocatedPower
          };
        },
        {}
      );

      return [
        ...accumulator,
        {
          sourceName,
          type,
          availablePower,
          cost,
          value: availablePower * cost,
          ...states,
          availableForSale
        }
      ];
    }, []);

    const totals = data.reduce(
      (accumulator, currentValue) => {
        accumulator.availablePower += currentValue.availablePower || 0;
        accumulator.value += currentValue.value || 0;
        accumulator.availableForSale += currentValue.availableForSale || 0;
        return accumulator;
      },
      {
        availablePower: 0,
        value: 0,
        availableForSale: 0
      }
    );

    data.push({
      sourceName: translateString('total'),
      type: '',
      availablePower: totals.availablePower,
      value: totals.value,
      availableForSale: totals.availableForSale,
      cost: '',
      ...stateTotals
    });

    data.push({
      sourceName: translateString('balance'),
      type: '',
      availablePower: totals.availableForSale,
      value: '',
      availableForSale: '',
      cost: ''
    });

    return {
      data: {
        results: data
      }
    };
  };

  const getAllocationByUnitData = translateString => {
    const {
      manual: isReportManual,
      destinations: allDestinations,
      sources,
      type
    } = $report;
    const roundTo3 = number => +number.toFixed(3);

    const unitData = sources.reduce((unitsAccumulator, source) => {
      const { destinations } = source;
      const manual =
        (isReportManual && type === typeStatus.DRAFT) || source.manual;

      const sourceAllocatedPower = destinations.reduce(
        (sum, destination) => sum + destination.allocatedPower,
        source.availableForSale || 0
      );

      const units = destinations.map(destination => {
        const { consumption } = allDestinations.find(
          ({ unitId }) => unitId === destination.unitId
        );

        return {
          sourceName: source.sourceName,
          sourceContractId: source.sourceContractId,
          sourceTotal: source.availablePower,
          sourceBalance: roundTo3(source.availablePower - sourceAllocatedPower),
          ...destination,
          unitTotal: consumption,
          balanceId: source.balance,
          manual
        };
      });

      units.push({
        sourceName: source.sourceName,
        sourceContractId: source.sourceContractId,
        sourceTotal: source.availablePower,
        sourceBalance: roundTo3(source.availablePower - sourceAllocatedPower),
        unitName: translateString('availableForSale'),
        unitId: false,
        allocatedPower: source.availableForSale,
        ICMSCost: 0,
        ICMSCostNotCreditable: 0,
        balanceId: source.balance,
        manual
      });

      return [...unitsAccumulator, ...units];
    }, []);

    const getUnitAllocatedPower = ({ unitId: searchId }) =>
      unitData
        .filter(unit => unit.unitId === searchId)
        .reduce((sum, { allocatedPower }) => sum + allocatedPower, 0);

    const results = unitData.map(unit => {
      if (unit.unitId === false) return unit;
      return {
        ...unit,
        unitBalance: roundTo3(unit.unitTotal - getUnitAllocatedPower(unit))
      };
    });

    return {
      data: {
        results
      }
    };
  };

  return {
    getAllocationByStateData,
    getAllocationByUnitData
  };
};
