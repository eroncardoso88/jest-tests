import React from 'react';
import { render } from '@testing-library/react';
import Loading from './Loading';

describe('Loading', () => {
  it('renders without crashing', async () => {
    const { getByTestId } = render(<Loading />);
    expect(getByTestId('loading')).toBeInTheDocument();
  });
});
