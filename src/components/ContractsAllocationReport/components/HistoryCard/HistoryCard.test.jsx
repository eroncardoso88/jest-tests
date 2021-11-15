import React from 'react';
import { render } from '@testing-library/react';
import HistoryCard from './HistoryCard';

const BaseComponent = ({
  date = new Date().toDateString(),
  user = 'Default User',
  message = 'Default Message'
}) => <HistoryCard date={date} user={user} message={message} />;

describe('HistoryCard', () => {
  it('check default render', async () => {
    const { findByTestId } = render(<BaseComponent />);

    const historyCardContainer = await findByTestId('history-card-container');

    expect(historyCardContainer).toBeInTheDocument();
  });

  it('check render component username and message props', async () => {
    const username = 'My username';
    const message = 'My message';

    const { getByText } = render(
      <BaseComponent user={username} message={message} />
    );

    expect(getByText(username)).toBeInTheDocument();
    expect(getByText(message)).toBeInTheDocument();
  });

  it('check render component date prop', async () => {
    const date = 'Fri Mar 06 2020';

    const formatedDate = new Date(date)
      .toLocaleString('pt-BR')
      .replace(' ', ' - ');

    const { getByText } = render(<BaseComponent date={date} />);

    expect(getByText(formatedDate)).toBeInTheDocument();
  });
});
