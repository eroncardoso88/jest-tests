import { useState } from 'react';
import useCreateStore from '../../utils/useCreateStore';
import filterActions from './actions';
import filterSelectors from './selectors';

/* istanbul ignore file */

import initialState from './initialState';

const filterStore = useCreateStore(() => {
  const [$filter, setFilter] = useState(initialState);
  const actions = filterActions(setFilter, $filter);
  const selectors = filterSelectors($filter);

  return { $filter, ...actions, ...selectors };
});

export const useFilter = () => filterStore();
export const FilterContext = filterStore.Context;
export const FilterProvider = filterStore.Provider;
