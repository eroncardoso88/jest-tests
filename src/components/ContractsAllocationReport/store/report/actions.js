import * as provider from '../../../../../services/contractsAllocationReport';
import initialState from './initialState';
import months from '../../utils/months';
import to from '../../utils/to';
import {listPerSources} from '../../utils/listPerSources';
import createTable from '../../utils/table';

export default setReport => {
  const setField = (field, value) => {
    setReport(prev => ({ ...prev, [field]: value }));
  };

  const setData = data => {
    setReport(prev => ({ ...prev, ...data }));
  };

  const clearState = () => {
    setReport(initialState);
  };

  const parseReport = ({ manual, ...rest }) => ({
    ...rest,
    manual: !!manual
  });

  const setContracts = contracts => {
    setReport(prev => ({
      ...prev,
      contracts: contracts
    }));
  };

  const generateReport = async (year, month, balance) => {
    const [error, request] = await to(
      provider.generateReport(year, month, balance)
    );
    if (error) {
      throw error;
    }

    const data = parseReport(request.data);

    setReport(prev => ({
      ...prev,
      ...data
    }));

    return data;
  };

  const getReportsList = async params => {
    const [error, request] = await to(provider.getReports(params));
    if (error) {
      return;
    }

    return {
      data: {
        totalCount: request.headers['x-total-pages'],
        count: request.headers['x-total-count'],
        results: request.data
      }
    };
  };

  const getReport = async id => {
    const [error, request] = await to(provider.getReport(id));
    if (error) {
      return;
    }
    const { referenceMonth, balance } = request.data;
    const [year, month] = referenceMonth.split('-');
    await getBalances(Number(year), Number(month));
    const comments = await getComments(request.data.id);
    if (!comments) {
      return;
    }

    const data = parseReport(request.data);
    const newData = data.sources.map(source => {
      return {
        ...source,
        ICMSCost: source.destinations.reduce(
          (previousValue, currentValue) =>
            previousValue + currentValue.ICMSCost,
          0
        ),
        ICMSCostNotCreditable: source.destinations.reduce(
          (previousValue, currentValue) =>
            previousValue + currentValue.ICMSCostNotCreditable,
          0
        )
      };
    });
    const ICMSCost = newData.reduce(
      (previousValue, currentValue) => previousValue + currentValue.ICMSCost,
      0
    );
    const ICMSCostNotCreditable = newData.reduce(
      (previousValue, currentValue) =>
        previousValue + currentValue.ICMSCostNotCreditable,
      0
    );
    setReport(prev => ({
      ...prev,
      ...data,
      ICMSCost,
      comments,
      ICMSCostNotCreditable,
      selectValues: {
        year,
        month: months[month - 1],
        balance
      }
    }));

    return data;
  };

  const updateReport = async ($report, justification) => {
    let error, request;
    if ($report.manual) {
      const payload = {
        changeJustification: justification,
        balance: $report.balance,
        sources: $report.sources
      };

      [error, request] = await to(
        provider.updateManualAllocation($report.id, payload)
      );
    } else {
      const payload = {
        balanceId: $report.balance,
        changeJustification: justification
      };

      [error, request] = await to(provider.updateReport(payload, $report.id));
    }

    if (error) {
      return;
    }

    const data = parseReport(request.data);
    setReport(prev => ({
      ...prev,
      ...data
    }));

    return data;
  };

  const getHistory = async id => {
    const [error, result] = await to(provider.getHistory(id));
    if (error) {
      return;
    }

    return result.data.sort((a, b) => {
      if (a.revision > b.revision) {
        return -1;
      }

      if (a.revision <= b.revision) {
        return 1;
      }

      return 0;
    });
  };

  const getHistoryDetail = async (id, revisionId) => {
    const [error, request] = await to(
      provider.getHistoryDetail(id, revisionId)
    );
    if (error) {
      return;
    }

    const { referenceMonth } = request.data;
    const month = new Date(referenceMonth).getMonth();
    const year = new Date(referenceMonth).getFullYear();

    const comments = await getComments(request.data.id);
    if (!comments) {
      return;
    }

    setReport(prev => ({
      ...prev,
      ...request.data,
      comments,
      selectValues: {
        year,
        month: months[month],
        balance: 'balance'
      }
    }));

    return request.data;
  };

  const activateReport = async (id, payload) => {
    const [error, request] = await to(provider.activateReport(id, payload));
    if (error) {
      return;
    }

    return request.data;
  };

  const deactivateReport = async (id, payload) => {
    const [error, request] = await to(provider.deactivateReport(id, payload));
    if (error) {
      return;
    }

    return request.data;
  };

  const getComments = async id => {
    const [errorHistory, requestHistory] = await to(provider.getHistory(id));
    if (errorHistory) {
      return false;
    }

    return requestHistory.data.map(item => ({
      revision: item.revision,
      user: item.user,
      changeAt: item.changeAt,
      message: item.changeJustification
    }));
  };

  const getBalances = async (year, month) => {
    const [err, res] = await to(provider.getBalances(year, month));
    if (err) {
      console.log('error getting balances', err);
      return false;
    }

    setField('balances', res.data);
  };

  const sendReport = async ($report, justification) => {
    let error, request;
    if ($report.manual) {
      const payload = {
        changeJustification: justification,
        balance: $report.balance,
        sources: $report.sources
      };

      [error, request] = await to(provider.sendManualAllocation(payload));
    } else {
      const payload = {
        balanceId: $report.balance
      };

      [error, request] = await to(provider.sendReport(payload));
    }
    if (error) {
      return;
    }

    setReport(prev => ({
      ...prev,
      ...request.data
    }));

    return request.data;
  };

  const consolidateReport = async (id, changeJustification) => {
    const [error, request] = await to(
      provider.consolidateReport(id, { changeJustification })
    );
    if (error) {
      console.log('error consolidating');
      return;
    }

    return request.data;
  };

  const calculateManualAllocation = async (payload, id = -1) => {
    const [error, request] =
      id > 0
        ? await to(provider.calculateSavedManualAllocation(id, payload))
        : await to(provider.calculateManualAllocation(payload));
    if (error) {
      console.log('error calculating manual allocation');
      return;
    }

    setReport(prev => ({ ...prev, ...request.data }));

    return request.data;
  };

  const getSourcesAndDestinations = async balanceId => {
    const [error, request] = await to(
      provider.getSourcesAndDestinations(balanceId)
    );
    if (error) {
      console.log('error getting balance sources and destinations');
      return;
    }

    const sortedDestinations = request.data.destinations.sort(
      ({ unitName: first }, { unitName: second }) => {
        if (first < second) {
          return -1;
        }
        if (first > second) {
          return 1;
        }
        return 0;
      }
    );

    setReport(prev => ({
      ...prev,
      sourcesList: request.data.sources,
      destinations: sortedDestinations
    }));

    return;
  };

  const saveReport = async data => {
    data['sources'] = listPerSources(data.contracts);
    delete data.contracts;
    const [error, request] = await to(
      provider.saveSourcesAndDestinations(data)
    );
    if (error) {
      console.log('error saving balance sources and destinations');
      throw error;
    }
    setReport(prev => ({ ...prev, saved: true }));

    return request;
  };

  const calculateReport = async payload => {

        function fetchData(report) {
      const contracts = report.sources;
      const destinations = report.destinations;

      const data = createTable({ contracts, destinations });

      setContracts(data);
    }
    payload['sources'] = listPerSources(payload.contracts);
    delete payload.contracts;
    const [error, request] = await to(
      provider.calculateSourcesAndDestinations(payload)
    );
    if (error) {
      console.log('error calculating balance sources and destinations');
      throw error;
    }



    const data = parseReport(request.data);
    const newData = data.sources.map(source => {
      return {
        ...source,
        ICMSCost: source.destinations.reduce(
          (previousValue, currentValue) =>
            previousValue + currentValue.ICMSCost,
          0
        ),
        ICMSCostNotCreditable: source.destinations.reduce(
          (previousValue, currentValue) =>
            previousValue + currentValue.ICMSCostNotCreditable,
          0
        )
      };
    });
    const ICMSCost = newData.reduce(
      (previousValue, currentValue) => previousValue + currentValue.ICMSCost,
      0
    );
    const ICMSCostNotCreditable = newData.reduce(
      (previousValue, currentValue) =>
        previousValue + currentValue.ICMSCostNotCreditable,
      0
    );
    console.log('getReport setReport', data)
    setReport(prev => ({
      ...prev,
      ...data,
      ICMSCost,
      ICMSCostNotCreditable,

    }));

    return data;
  };

  const exportAllocationFile = async (id, typeString) => {
    const [error, request] = await to(provider.exportPdfOrXlsx(id, typeString));
    if (error) {
      console.log('error exporting');
      return;
    }

    return request.data;
  };

  return {
    setContracts,
    generateReport,
    getReportsList,
    getReport,
    updateReport,
    getHistory,
    getHistoryDetail,
    activateReport,
    deactivateReport,
    setField,
    clearState,
    setData,
    getComments,
    getBalances,
    sendReport,
    consolidateReport,
    calculateManualAllocation,
    getSourcesAndDestinations,
    saveReport,
    calculateReport,
    exportAllocationFile
  };
};
