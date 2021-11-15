export function listPerSources(initialArray) {
    const sources = [];
    initialArray.columns.forEach(stateContracts => {
      stateContracts.availableBySales.forEach((contract, index) => {
        let destinationStates = [];
        let destinations = [];
        stateContracts.units.forEach(unit => {
          let isExistingItem;
          isExistingItem = sources.find(
            i => i.sourceContractId == contract.sourceContractId
          );
          if (isExistingItem) {
            isExistingItem.destinations.push({
              unitName: unit.unitName,
              unitId: unit.unitId,
              allocatedPower: unit.contracts[index]
            });
          } else {
            sources.push({
              ...stateContracts.availableBySales[index],
              cost: parseFloat(
                stateContracts.availableBySales[index].cost
                  .replace('R$', '')
                  .replace(' MW/h', '')
                  .replace(',', '.')
              ),
              destinations: [
                {
                  unitName: unit.unitName,
                  unitId: unit.unitId,
                  allocatedPower: unit.contracts[index]
                }
              ]
            });
          }
        });
      });
    });
    return sources;
  }
