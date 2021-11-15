/* istanbul ignore file */
import { useState } from 'react';
import useCreateStore from '../../utils/useCreateStore';

import reportActions from './actions';
import reportSelectors from './selectors';
import initialState from './initialState';

const ReportStore = useCreateStore(() => {
  const [$report, setReport] = useState(initialState);
  const actions = reportActions(setReport);
  const selectors = reportSelectors($report);

  return { $report, ...actions, ...selectors };
});

export const useReport = () => ReportStore();
export const ReportContext = ReportStore.Context;
export const ReportProvider = ReportStore.Provider;
