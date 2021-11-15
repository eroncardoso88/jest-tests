import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import HeaderButton from './HeaderButton';

const BaseComponent = ({
  handleClick = () => {},
  children = 'Default',
  color = 'primary',
  isDisabled = false
}) => (
  <HeaderButton handleClick={handleClick} color={color} isDisabled={isDisabled}>
    {children}
  </HeaderButton>
);

describe('HeaderButton', () => {
  it('check default render', async () => {
    const { findByTestId } = render(<BaseComponent />);

    const headerButton = await findByTestId('header-button');

    expect(headerButton).toBeInTheDocument();
  });

  it('check children text content', async () => {
    const children = 'Example';

    const { findByText } = render(<BaseComponent>{children}</BaseComponent>);

    const childrenElement = await findByText(children);

    expect(childrenElement).toBeInTheDocument();
  });

  it('check handle click', async () => {
    const handleClick = jest.fn();
    const { getByTestId } = render(<BaseComponent handleClick={handleClick} />);

    fireEvent.click(getByTestId('header-button'));

    expect(handleClick.mock.calls.length).toBe(1);
  });

  it('check disabled button', async () => {
    const { findByTestId } = render(<BaseComponent isDisabled={true} />);

    const headerButton = await findByTestId('header-button');

    expect(headerButton).toBeDisabled();
  });
});
