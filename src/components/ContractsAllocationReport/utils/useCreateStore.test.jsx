import useCreateStore from './useCreateStore';
import { renderHook, act } from '@testing-library/react-hooks';
import { useState } from 'react';

describe('Use Create Store', () => {
  const initialState = {
    test: ''
  };

  const testSelectors = $test => {
    const mockSelector = jest.fn();
    return { mockSelector };
  };

  const testActions = setTest => {
    const mockAction = jest.fn();
    return { mockAction };
  };

  it('check if store is created', () => {
    const store = useCreateStore(() => {
      const [$test, setTest] = useState(initialState);
      const actions = testActions(setTest);
      const selectors = testSelectors($test);

      return { $test, ...actions, ...selectors };
    });
    expect(store).toHaveProperty('Context');
    expect(store).toHaveProperty('Provider');
  });

  it('check if provider function is called', () => {
    const mockUseValue = jest.fn(() => {
      const [$test, setTest] = useState(initialState);
      const actions = testActions(setTest);
      const selectors = testSelectors($test);

      return { $test, ...actions, ...selectors };
    });
    const store = useCreateStore(mockUseValue);
    const { hook } = renderHook(() => store.Provider({ children: {} }));

    expect(mockUseValue).toHaveBeenCalled();
  });
});
