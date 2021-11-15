import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { DataTable, AdditionalInformation } from '../../components';
import { formatNumber, formatValueMoney } from '../../utils/formatValue';
import { useReport } from '../../store';

const baseTranslationPath =
  'contractsAllocationReport.containers.reportContainer';

const useStyles = makeStyles({
  icms: {
    display: 'flex',
    flexDirection: 'column',
    width: '40%',
    justifyContent: 'space-between',
    '@media (max-width: 600px)': {
      width: '100%'
    },
    '@media (min-width: 601px) and (max-width: 960px)': {
      minWidth: '522px'
    }
  },
  balance: {
    color: '#EB5757'
  },
  total: {
    color: '#277E7A'
  },
  tableHeight: {
    minHeight: 69,
    display: 'flex',
    alignItems: 'center'
  },
  title: {
    color: '#277E7A',
    textTransform: 'uppercase',
    fontSize: 20
  },
  boldValue: {
    fontWeight: 'bold'
  }
});
const getUniqueStates = (accumulator, currentValue) => {
  const states = currentValue.destinationStates;
  const stateNames = states.map(state => state.stateName);

  return Array.from(new Set([...accumulator, ...stateNames]));
};

const AllocationByState = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const {
    $report: { sources, ICMSCost, ICMSCostNotCreditable },
    getAllocationByStateData
  } = useReport();

  const statesList = sources.reduce(getUniqueStates, []);

  const getStateColumns = states =>
    states.map(state => ({
      path: state,
      display: true,
      label: (
        <div style={{ textAlign: 'center' }}>
          <span>{state}</span> <br />
          <span>{t(`${baseTranslationPath}.mwh`)}</span>
        </div>
      ),
      viewColumns: true,
      filter: {
        type: 'custom'
      },
      content: report =>
        report.sourceName === t(`${baseTranslationPath}.total`) ? (
          <strong>{formatNumber(report[state])}</strong>
        ) : (
          formatNumber(report[state])
        )
    }));

  const formatType = value => value && t(`${baseTranslationPath}.${value}`);
  const formatMoneyAllowingEmpty = value =>
    value !== '' ? formatValueMoney(value) : '';
  const [columns] = useState([
    {
      path: 'sourceName',
      display: true,
      label: t(`${baseTranslationPath}.sourceName`),
      viewColumns: true,
      content: report =>
        report.sourceName === t(`${baseTranslationPath}.total`) ||
        report.sourceName === t(`${baseTranslationPath}.balance`) ? (
          <div className={classes.tableHeight}>
            <strong
              className={
                classes[
                  report.sourceName === t(`${baseTranslationPath}.total`)
                    ? 'total'
                    : 'balance'
                ]
              }
            >
              {report.sourceName}
            </strong>
          </div>
        ) : (
          <div className={classes.tableHeight}>{report.sourceName}</div>
        )
    },
    {
      path: 'type',
      display: true,
      label: t(`${baseTranslationPath}.type`),
      viewColumns: true,
      content: report => formatType(report.type),
      filter: { valueFormat: formatType }
    },
    {
      path: 'availablePower',
      display: true,
      label: t(`${baseTranslationPath}.availablePower`),
      isNumeric: true,
      viewColumns: true,
      content: report =>
        report.sourceName === t(`${baseTranslationPath}.total`) ||
        report.sourceName === t(`${baseTranslationPath}.balance`) ? (
          <strong className={classes.boldValue}>
            {formatNumber(report.availablePower)}
          </strong>
        ) : (
          formatNumber(report.availablePower)
        ),
      filter: { valueFormat: value => formatNumber(value).replace(/\./gi, '') }
    },
    {
      path: 'cost',
      display: true,
      label: t(`${baseTranslationPath}.cost`),
      isNumeric: true,
      viewColumns: true,
      content: report => formatMoneyAllowingEmpty(report.cost),
      filter: { valueFormat: formatMoneyAllowingEmpty }
    },
    {
      path: 'value',
      display: true,
      label: t(`${baseTranslationPath}.value`),
      isNumeric: true,
      viewColumns: true,
      content: report =>
        report.sourceName === t(`${baseTranslationPath}.total`) ? (
          <strong className={classes.boldValue}>
            {formatValueMoney(report.value)}
          </strong>
        ) : (
          formatMoneyAllowingEmpty(report.value)
        ),
      filter: { valueFormat: formatMoneyAllowingEmpty }
    },
    ...getStateColumns(statesList),
    {
      path: 'availableForSale',
      display: true,
      label: t(`${baseTranslationPath}.availableForSale`),
      viewColumns: true,
      common: true,
      content: report =>
        report.sourceName === t(`${baseTranslationPath}.total`) ? (
          <strong className={classes.boldValue}>
            {formatNumber(report.availableForSale)}
          </strong>
        ) : (
          formatNumber(report.availableForSale)
        )
    }
  ]);

  const translateString = string => t(`${baseTranslationPath}.${string}`);

  return (
    <>
      <DataTable
        dataTestId="allocation-by-state-tab"
        title={t(`${baseTranslationPath}.stateTitle`)}
        titleCustomStyle={classes.title}
        params={{}}
        filters={{}}
        columns={columns}
        values={getAllocationByStateData(statesList, translateString)}
        updateFilters={() => {}}
        localFilter
        localSort
        keepTotalAndBalanceRows
        options={{
          clearFiltersButton: true,
          exportButton: true,
          exportFile: () => {},
          filterColumns: true,
          pagination: false
        }}
      />
      <div className={classes.icms}>
        <AdditionalInformation
          title={t(`${baseTranslationPath}.icmsValues`)}
          value={ICMSCost}
        />
        <AdditionalInformation
          title={t(`${baseTranslationPath}.icmsNotCreditable`)}
          value={ICMSCostNotCreditable}
          valueColor="red"
        />
      </div>
    </>
  );
};

export default AllocationByState;
