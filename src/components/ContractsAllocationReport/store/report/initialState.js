/* istanbul ignore file */
import months from '../../utils/months';

export default {
  id: null,
  revision: null,
  referenceMonth: '',
  contracts: [],
  type: '',
  manual: false,
  balance: 0,
  active: true,
  ICMSCost: 0,
  ICMSCostNotCreditable: 0,
  sources: [],
  comments: [],
  selectValues: {
    year: new Date().getFullYear().toString(),
    month: months[new Date().getMonth()],
    balance: null
  },
  balances: [],
  sourcesList: [],
  destinations: []
};
