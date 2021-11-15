import React from 'react';
import { render } from '@testing-library/react';
import Negociations from './index.js';

describe('Negociation', () => {
  it('check default render', async () => {
    const { getByTestId } = render(<Negociations />);
    expect(getByTestId('table-negociation-root')).toBeInTheDocument();
  });

});
