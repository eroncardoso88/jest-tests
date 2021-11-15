export default setFilter => {
  const updateFilters = (filterType, newFilter) => {
    setFilter(prev => ({
      ...prev,
      [filterType]: {
        ...prev[filterType],
        filters: {
          ...prev[filterType].filters,
          ...newFilter
        }
      }
    }));
  };

  const updateParams = (filterType, newParam) => {
    setFilter(prev => ({
      ...prev,
      [filterType]: {
        ...prev[filterType],
        params: {
          ...prev[filterType].params,
          ...newParam
        }
      }
    }));
  };

  const clearReportFilters = () => {
    setFilter(prev => ({
      ...prev,
      reports: {
        params: {}
      }
    }));
  };

  return {
    updateFilters,
    updateParams,
    clearReportFilters
  };
};
