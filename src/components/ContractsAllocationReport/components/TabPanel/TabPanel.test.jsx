import React from 'react';
import { render } from '@testing-library/react';
import TabPanel from './TabPanel';

const BaseComponent = ({ value = 0, index = 0, children }) => (
  <TabPanel value={value} index={index}>
    {children}
  </TabPanel>
);

describe('TabPanel', () => {
  it('check default render', async () => {
    const { getByTestId } = render(<BaseComponent />);

    expect(getByTestId('tab-panel-container')).toBeInTheDocument();
  });

  it('check children render', async () => {
    const children = (
      <div data-testid="children-test">this is a children !!!</div>
    );

    const { getByTestId } = render(<BaseComponent>{children}</BaseComponent>);

    expect(getByTestId('children-test')).toBeInTheDocument();
  });
});
