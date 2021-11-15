/* istanbul ignore file */

import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import Button from '@material-ui/core/Button';
import ManualAllocationModal from './ManualAllocationModal';

const sourcesList = [
  {
    sourceContractId: 1,
    sourceUnitId: 1,
    sourceName: 'AAAAA',
    type: 'contrato',
    availablePower: 1000
  },
  {
    sourceContractId: 2,
    sourceUnitId: 2,
    sourceName: 'BBCC',
    type: 'contrato',
    availablePower: 1500
  },
  {
    sourceContractId: 3,
    sourceUnitId: 1,
    sourceName: 'Teste',
    type: 'contrato',
    availablePower: 2000
  }
];

const destinationsList = [
  {
    unitId: 1,
    unitName: 'Teste 1',
    consumption: 200
  },
  {
    unitId: 2,
    unitName: 'Teste 2',
    consumption: 500
  },
  {
    unitId: 3,
    unitName: 'Teste 3',
    consumption: 2200
  }
];

storiesOf('Manual Allocation Modal', module).add('Modal', () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setModalOpen(true)}>Abrir modal</Button>
      <ManualAllocationModal
        isOpen={modalOpen}
        handleClose={() => setModalOpen(false)}
        handleContinue={() => setModalOpen(false)}
        sourcesList={sourcesList}
        destinationsList={destinationsList}
      />
    </>
  );
});
