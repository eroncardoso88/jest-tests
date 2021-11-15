import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Input from './Input';

describe('Input', () => {
  it('check default render', async () => {
    const { findByTestId } = render(<Input />);

    const inputContainer = await findByTestId('input-container');

    expect(inputContainer).toBeInTheDocument();
  });

  it('check onChange input prop', async () => {
    const handleOnChange = jest.fn();

    const { getByTestId } = render(<Input onChange={handleOnChange} />);

    const inputElement = getByTestId('input-container').firstChild.firstChild;

    fireEvent.change(inputElement, { target: { value: 'React JS' } });

    expect(handleOnChange.mock.calls.length).toBe(1);
  });

  it('check default id with name', async () => {
    const name = 'default-name';

    const { getByTestId } = render(<Input name={name} />);

    const inputElement = getByTestId('input-container').firstChild.firstChild;

    expect(inputElement.id).toBe(name);
  });
});
