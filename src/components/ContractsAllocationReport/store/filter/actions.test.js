import initialState from './initialState';
import filterActions from './actions';

const mockState = initialState => {
  let $state = initialState;
  const setState = updateValue =>
    typeof updateValue === 'function'
      ? ($state = updateValue($state))
      : ($state = updateValue);

  return [$state, setState];
};

describe('filter actions', () => {
  it('check update filters action', async () => {
    const [$filter, setFilter] = mockState(initialState);

    const { updateFilters } = filterActions(setFilter);

    updateFilters('reports', { filterKey: 'filterValue' });

    const expectState = {
      ...initialState,
      reports: {
        filters: { filterKey: 'filterValue' },
        params: {}
      }
    };

    expect(expectState).toMatchObject($filter);
  });

  it('check update params action', async () => {
    const [$filter, setFilter] = mockState(initialState);

    const { updateParams } = filterActions(setFilter);

    updateParams('reports', { paramKey: 'paramValue' });

    const expectState = {
      ...initialState,
      reports: {
        filters: {},
        params: { paramKey: 'paramValue' }
      }
    };

    expect(expectState).toMatchObject($filter);
  });
});
