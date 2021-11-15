import React from 'react';
import { render } from '@testing-library/react';
import AdditionalInformation from './Additionalnformation';

const haveRedClass = list => (
  [].some.call(list, classname => /makeStyles-red-/.test(classname))
);

describe('Additional information', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(
      <AdditionalInformation title="Test" />
    );

    expect(getByTestId('additional-information')).toBeInTheDocument();
  });

  it('money type', () => {
    const { getByTestId } = render(
      <AdditionalInformation
        title="Money"
        value={1.99}
        valueType="money"
      />
    );

    const valueElement = getByTestId('value');
    expect(valueElement.innerHTML).toBe('R$ 1,99');
  });

  it('energy type', () => {
    const { getByTestId } = render(
      <AdditionalInformation
        title="Energy"
        value={1500}
        valueType="energy"
      />
    );

    const valueElement = getByTestId('value');
    expect(valueElement.innerHTML).toBe('1,500 MWh');
  });

  it('change title color', () => {
    const { getByTestId } = render(
      <AdditionalInformation title="color" titleColor="red" />
    );

    const titleElement = getByTestId('title');
    expect(haveRedClass(titleElement.classList)).toBe(true);
  });

  it('change value color', () => {
    const { getByTestId } = render(
      <AdditionalInformation title="color" valueColor="red" />
    );

    const valueElement = getByTestId('value');
    expect(haveRedClass(valueElement.classList)).toBe(true);
  });
});
