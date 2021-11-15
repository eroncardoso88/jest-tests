import React from 'react';
import { render } from '@testing-library/react';
import Header from './Header';
import { ThemeProvider } from '@mui/core/styles';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { mount } from 'enzyme';
import Alert from './Header';
Enzyme.configure({ adapter: new Adapter() });


describe('Header', () => {

  it('renders without crashing', () => {
    const { getByTestId } = render(<Header handleClick={() => {}} />);
    expect(getByTestId(/header/i)).toBeInTheDocument();
  });

  it('on back click', () => {
    const onBack = jest.fn();

    const { getByTestId } = render(<Header handleClick={onBack} />);
    const backButton = getByTestId(/back-button/i);
    backButton.click();

    expect(onBack).toBeCalled();
    expect(onBack).toBeCalledWith('back');
  });

  it('on draft click', () => {
    const onDraft = jest.fn();

    const { getByTestId } = render(<Header handleClick={onDraft} canDraft />);

    const draftButton = getByTestId(/draft-button/i);
    draftButton.click();

    expect(onDraft).toBeCalled();
    expect(onDraft).toBeCalledWith('draft');
  });

  it('on consolidate click', () => {
    const onConsolidate = jest.fn();

    const { getByTestId } = render(
      <Header handleClick={onConsolidate} status="Consolidated" />
    );

    const consolidateButton = getByTestId(/consolidate-button/i);
    consolidateButton.click();

    expect(onConsolidate).toBeCalled();
    expect(onConsolidate).toBeCalledWith('consolidate');
  });

  it('on edit click', () => {
    const onEdit = jest.fn();

    const { getByTestId } = render(
      <Header handleClick={onEdit} status="edit" doNotShowEdit={false} />
    );

    const editIcon = getByTestId(/edit-icon/i);
    editIcon.click();

    expect(onEdit).toBeCalled();
    expect(onEdit).toBeCalledWith('edit');
  });
});
