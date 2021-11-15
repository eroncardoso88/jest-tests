import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import StateInput from './StateInput';

describe('Input', () => {
  it('check default render', async () => {
    const { findByTestId } = render(<StateInput />);

    const inputContainer = await findByTestId('input-container');

    expect(inputContainer).toBeInTheDocument();
  });

  it('check onChange input prop', async () => {
    const handleOnChange = jest.fn();

    const { getByTestId } = render(<StateInput onChange={handleOnChange} />);

    const inputElement = getByTestId('input-container').firstChild.firstChild;

    fireEvent.change(inputElement, { target: { value: 'React JS' } });

    expect(handleOnChange.mock.calls.length).toBe(1);
  });

  it('check formatter prop', async () => {
    const formatter = value => `${value} React JS`;
    let checkValue;

    const { getByTestId } = render(<StateInput
      formatter={formatter}
      onBlur={(event => checkValue = event.target.value)}
    />);

    const inputElement = getByTestId('input-container').firstChild.firstChild;

    const newValue = 413;
    fireEvent.change(inputElement, { target: { value: newValue } });
    fireEvent.blur(inputElement);

    expect(checkValue).toBe(formatter(newValue));
  });
});
