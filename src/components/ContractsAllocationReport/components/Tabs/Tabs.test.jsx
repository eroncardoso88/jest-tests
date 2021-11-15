import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Tabs from './Tabs';

const defaultTabs = ['page1', 'page2'];

const BaseComponent = ({
  tabs = defaultTabs,
  value = 0,
  handleTabChange = () => {}
}) => <Tabs tabs={tabs} value={value} handleTabChange={handleTabChange} />;

describe('Tabs', () => {
  it('check default render', async () => {
    const { getByTestId } = render(<BaseComponent />);

    expect(getByTestId('tabs-container')).toBeInTheDocument();
  });

  it('check render tabs', async () => {
    const tabs = ['item1', 'item2', 'item3'];

    const { getAllByTestId } = render(<BaseComponent tabs={tabs} />);

    const tabsElements = getAllByTestId('tab-item');

    expect(tabsElements.length).toBe(tabs.length);

    const firstTabName = tabsElements[0].firstChild.innerHTML;
    const secondTabName = tabsElements[1].firstChild.innerHTML;
    const thirdTabName = tabsElements[2].firstChild.innerHTML;

    expect(firstTabName).toBe(tabs[0]);
    expect(secondTabName).toBe(tabs[1]);
    expect(thirdTabName).toBe(tabs[2]);
  });

  it('check change tab', async () => {
    const handleTabChange = jest.fn();

    const { getAllByTestId } = render(
      <BaseComponent handleTabChange={handleTabChange} />
    );

    const [, secondTabElement] = getAllByTestId('tab-item');

    fireEvent.click(secondTabElement);

    expect(handleTabChange.mock.calls.length).toBe(1);
  });
});
