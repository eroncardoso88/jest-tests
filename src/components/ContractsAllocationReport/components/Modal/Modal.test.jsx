import React from 'react';
import Modal from './Modal';
import { render, fireEvent } from '@testing-library/react';

const BaseComponent = ({
  isOpen = true,
  handleClose = () => {},
  handleConsolidate = () => {},
  isJustifyModal = true
}) => (
  <Modal
    isOpen={isOpen}
    handleClose={handleClose}
    handleConsolidate={handleConsolidate}
    isJustifyModal={isJustifyModal}
  />
);

describe('Modal', () => {
  it('renders without crashing', () => {
    const { container } = render(<BaseComponent />);
    expect(container).toBeInTheDocument();
  });

  it('on close', () => {
    const handleClose = jest.fn();
    const { getByText } = render(<BaseComponent handleClose={handleClose} />);

    const leaveButtonText = 'contractsAllocationReport.components.modal.cancel';
    const leaveButton = getByText(leaveButtonText).parentNode;
    leaveButton.click();
    expect(handleClose.mock.calls.length).toBe(1);
  });

  it('on consolidate', async () => {
    const onConsolidate = jest.fn();
    const { getByTestId } = render(<BaseComponent handleConsolidate={onConsolidate} />);

    const justificationContainer = getByTestId('justification-input');
    const [, textAreaContainer] = justificationContainer.childNodes;
    textAreaContainer.click();
    const [textAreaElement] = textAreaContainer.childNodes;

    fireEvent.change(textAreaElement, {
      target: { value: 'Teste' }
    });

    const consolidateButton = getByTestId('consolidate-button');
    consolidateButton.click();
    expect(onConsolidate.mock.calls.length).toBe(1);
  });

  it('not justify modal', async () => {
    const { container } = render(<BaseComponent isJustifyModal={false} />);
    expect(container).toBeInTheDocument();
  });
});
