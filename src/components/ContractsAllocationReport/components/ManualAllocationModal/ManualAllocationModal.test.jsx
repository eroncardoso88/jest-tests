import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import ManualAllocationModal from './ManualAllocationModal';

const BaseComponent = ({
  isOpen = true,
  handleClose = () => {},
  handleContinue = () => {},
  sourcesList = [],
  destinationsList = []
}) => (
  <ManualAllocationModal
    isOpen={isOpen}
    handleClose={handleClose}
    handleContinue={handleContinue}
    sourcesList={sourcesList}
    destinationsList={destinationsList}
  />
);

describe('Manual Allocation Modal', () => {
  it('should render without crashing', () => {
    const { container } = render(<BaseComponent />);
    expect(container).toBeInTheDocument();
  });

  // it('should select source and destination', async () => {
  //   const sourcesList = [
  //     {
  //       sourceContractId: 1,
  //       sourceUnitId: 1,
  //       sourceName: 'AAAAA',
  //       type: 'contrato',
  //       availablePower: 1000
  //     }
  //   ];

  //   const destinationsList = [
  //     {
  //       unitId: 1,
  //       unitName: 'Teste 1',
  //       consumption: 200
  //     }
  //   ];
  //   const mockContinue = jest.fn();
  //   const { getAllByRole } = render(
  //     <BaseComponent
  //       sourcesList={sourcesList}
  //       destinationsList={destinationsList}
  //       handleContinue={mockContinue}
  //     />
  //   );
  //   const [sourceField, destinationField] = getAllByRole('textbox');
  //   const [, , , continueButton] = getAllByRole('button');

  //   sourceField.focus();
  //   fireEvent.change(document.activeElement, { target: { value: 'AAAAA' } });
  //   fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
  //   fireEvent.keyDown(document.activeElement, { key: 'Enter' });

  //   destinationField.focus();
  //   fireEvent.change(document.activeElement, { target: { value: 'Teste 1' } });
  //   fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
  //   fireEvent.keyDown(document.activeElement, { key: 'Enter' });

  //   expect(continueButton).not.toBeDisabled();

  //   fireEvent.click(continueButton);

  //   expect(mockContinue).toBeCalledWith(sourcesList[0], destinationsList[0]);
  // });
});
