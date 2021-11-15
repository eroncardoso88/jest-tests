import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import typeStatus from '../../utils/typeStatus';
import { formatNumber, formatBrToNumber } from '../../utils/formatValue';
import {
  DataTable,
  AdditionalInformation,
  FormattedNumberInput,
  ManualAllocationModal
} from '../../components';
import { useReport } from '../../store';

const baseTranslationPath =
  'contractsAllocationReport.containers.reportContainer';

const editingPlaceholder = '--,--';

const useStyles = makeStyles(theme => ({
  emptyValue: {
    display: 'flex',
    justifyContent: 'center'
  },
  informationWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '50%',
    '@media (max-width: 1279px)': {
      width: '100%'
    }
  },
  informationData: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    flex: 1,
    marginRight: '2%'
  },
  title: {
    fontSize: '20px',
    lineHeight: '23px',
    color: '#828282',
    fontWeight: 'normal',
    marginBottom: '2%'
  },
  button: {
    color: '#FFFFFF',
    backgroundColor: [theme.palette.primary.main],
    boxShadow: 'none',
    fontSize: '14px',
    lineHeight: '16px',
    padding: 8,
    fontWeight: 500,
    marginLeft: 50,
    '&:hover': {
      backgroundColor: [theme.palette.primary.main]
    },
    minWidth: '120px',
    textTransform: 'uppercase'
  },
  wrapperClassName: {
    display: 'flex'
  },
  tableTitle: {
    color: '#277E7A',
    textTransform: 'uppercase',
    fontSize: 20
  },
  redBorder: {
    borderColor: '#f43',
    border: '1px solid',
    borderRadius: '5px',
    padding: 10
  }
}));

const AllocationByUnit = ({
  id,
  onValidityChange = () => {},
  onBlockCalculation,
  onEditingStatusChange = () => {}
}) => {
  const classes = useStyles();
  const {
    $report,
    setField,
    getAllocationByUnitData,
    calculateManualAllocation
  } = useReport();

  const [modalIsOpen, openModal] = useState(false);
  const [isEditing, setEditing] = useState(false);

  useEffect(() => {
    onEditingStatusChange(isEditing);
  }, [isEditing]);

  const {
    sources,
    destinations: allDestinations,
    sourcesList,
    balance,
    type
  } = $report;
  const { t } = useTranslation();
  const translateString = string => t(`${baseTranslationPath}.${string}`);

  const originTotal = sources.reduce(
    (totalSum, { availablePower }) => totalSum + availablePower,
    0
  );
  const destinationTotal = sources
    .reduce((allUnits, { destinations }) => {
      const sourceUnits = [];
      destinations.forEach(sourceDestination => {
        const findUnitByIdIn = arr =>
          arr.find(({ unitId }) => sourceDestination.unitId === unitId);

        if (!findUnitByIdIn(allUnits)) {
          sourceUnits.push(findUnitByIdIn(allDestinations));
        }
      });

      return [...allUnits, ...sourceUnits];
    }, [])
    .reduce((sum, { consumption }) => sum + consumption, 0);

  const getTotalAllocatedPower = withSale =>
    sources.reduce(
      (totalSum, { availableForSale, destinations }) =>
        totalSum +
        destinations.reduce(
          (sourceSum, { allocatedPower }) => sourceSum + allocatedPower,
          withSale ? availableForSale : 0
        ),
      0
    );

  const originBalance = originTotal - getTotalAllocatedPower(true);
  const destinationBalance = destinationTotal - getTotalAllocatedPower(false);

  const addAllocation = (selectedSource, selectedDestination) => {
    const sourceOnListIndex = sources.findIndex(
      source =>
        source.sourceName === selectedSource.sourceName &&
        source.balance === balance
    );
    const destination = {
      unitId: selectedDestination.unitId,
      unitName: selectedDestination.unitName,
      allocatedPower: 0,
      ICMSCost: 0,
      ICMSCostNotCreditable: 0
    };

    if (sourceOnListIndex !== -1) {
      const destinations = sources[sourceOnListIndex].destinations;
      destinations.push(destination);
      sources[sourceOnListIndex].destinations = destinations;
      return;
    }

    sources.push({
      ...selectedSource,
      availableForSale: 0,
      cost: 0,
      balance,
      destinations: [destination],
      manual: true
    });
  };

  const prepareCalculatePayload = () => {
    const calculateSources =
      type === typeStatus.CONSOLIDATED
        ? sources
            .filter(source => source.balance === balance && source.manual)
            .map(({ manual, ...rest }) => rest)
        : sources;

    return {
      balance,
      changeJustification: 'calculate',
      sources: calculateSources
    };
  };

  const tableData = getAllocationByUnitData(translateString);

  const getValidity = () => {
    const hasNegativeAllocation = tableData.data.results.some(
      row => row.sourceBalance < 0 || row.unitBalance < 0
    );
    const hasTotalAllocation = originBalance === 0 || destinationBalance === 0;

    return hasTotalAllocation && !hasNegativeAllocation;
  };

  const [isValid, setValid] = useState(getValidity());

  useEffect(() => {
    onValidityChange(isValid);
  }, [isValid]);

  const formatICMS = value =>
    isEditing ? editingPlaceholder : formatNumber(value);
  const columns = [
    {
      path: 'sourceName',
      display: true,
      label: t(`${baseTranslationPath}.sourceName`),
      viewColumns: true,
      content: report => report.sourceName
    },
    {
      path: 'sourceTotal',
      display: true,
      label: t(`${baseTranslationPath}.sourceTotal`),
      isNumeric: true,
      viewColumns: true,
      content: report => formatNumber(report.sourceTotal),
      filter: { valueFormat: value => formatNumber(value).replace(/\./gi, '') }
    },
    {
      path: 'sourceBalance',
      display: true,
      label: t(`${baseTranslationPath}.sourceBalance`),
      isNumeric: true,
      viewColumns: true,
      content: report => (
        <div className={report.sourceBalance < 0 ? classes.redBorder : ''}>
          {formatNumber(report.sourceBalance)}
        </div>
      ),
      filter: { valueFormat: value => formatNumber(value).replace(/\./gi, '') }
    },
    {
      path: 'unitName',
      display: true,
      label: t(`${baseTranslationPath}.unitName`),
      viewColumns: true,
      content: report => report.unitName
    },
    {
      path: 'unitTotal',
      display: true,
      label: t(`${baseTranslationPath}.unitTotal`),
      isNumeric: true,
      viewColumns: true,
      content: report => formatNumber(report.unitTotal),
      filter: {
        valueFormat: value =>
          formatNumber(value) && formatNumber(value).replace(/\./gi, '')
      }
    },
    {
      path: 'unitBalance',
      display: true,
      label: t(`${baseTranslationPath}.unitBalance`),
      isNumeric: true,
      viewColumns: true,
      content: report => (
        <div className={report.unitBalance < 0 ? classes.redBorder : ''}>
          {formatNumber(report.unitBalance)}
        </div>
      ),
      filter: {
        valueFormat: value =>
          formatNumber(value) && formatNumber(value).replace(/\./gi, '')
      }
    },
    {
      path: 'allocatedPower',
      display: true,
      label: t(`${baseTranslationPath}.allocatedPower`),
      isNumeric: true,
      viewColumns: true,
      content: report => (
        <FormattedNumberInput
          name="allocatedPower"
          id="allocatedPower"
          inputProps={{ 'data-testid': 'allocated-power' }}
          disabled={!isEditing || !report.balanceId === balance}
          value={report.allocatedPower}
          onBlur={({ target: { value: stringValue } }) => {
            const newValue = stringValue === '' ? '0' : stringValue;
            const newAllocation = formatBrToNumber(newValue);

            const newSources = sources.map(source => {
              if (source.sourceContractId === report.sourceContractId) {
                const { availableForSale, destinations } = source;

                const newAvailableForSale =
                  report.unitId === false ? newAllocation : availableForSale;

                const newDestinations = destinations.map(destination =>
                  destination.unitId === report.unitId
                    ? { ...destination, allocatedPower: newAllocation }
                    : destination
                );

                return {
                  ...source,
                  availableForSale: newAvailableForSale,
                  destinations: newDestinations
                };
              }

              return source;
            });

            setField('sources', newSources);
            setValid(getValidity());
          }}
        />
      ),
      filter: {
        valueFormat: value =>
          formatNumber(value) && formatNumber(value).replace(/\./gi, '')
      }
    },
    {
      path: 'ICMSCost',
      display: true,
      label: t(`${baseTranslationPath}.icmsCost`),
      isNumeric: true,
      viewColumns: true,
      content: report => formatICMS(report.ICMSCost),
      filter: { valueFormat: value => formatICMS(value).replace(/\./gi, '') }
    },
    {
      path: 'ICMSCostNotCreditable',
      display: true,
      label: t(`${baseTranslationPath}.icmsCostNotCreditable`),
      isNumeric: true,
      viewColumns: true,
      content: report => formatICMS(report.ICMSCostNotCreditable),
      filter: { valueFormat: value => formatICMS(value).replace(/\./gi, '') }
    }
  ];

  const handleCalculateButtonClick = () => {
    if (isValid) {
      setEditing(false);
      return calculateManualAllocation(prepareCalculatePayload(), id);
    }

    if (onBlockCalculation) {
      onBlockCalculation();
    }
  };

  const renderButtons = () => (
    <div className={classes.buttonWrapper}>
      <Button
        variant="contained"
        onClick={() => openModal(true)}
        classes={{ contained: classes.button }}
      >
        {t(`${baseTranslationPath}.newAllocation`)}
      </Button>
      <Button
        size="small"
        variant="contained"
        classes={{ contained: classes.button }}
        onClick={handleCalculateButtonClick}
      >
        {t(`${baseTranslationPath}.calculate`)}
      </Button>
    </div>
  );

  return (
    <>
      <DataTable
        dataTestId="allocation-by-unit-tab"
        title={t(`${baseTranslationPath}.unitTitle`)}
        titleCustomStyle={classes.tableTitle}
        params={{}}
        filters={{}}
        columns={columns}
        values={tableData}
        updateParams={() => {}}
        updateFilters={() => {}}
        localFilter
        localSort
        options={{
          custom: isEditing ? renderButtons() : () => {},
          clearFiltersButton: true,
          exportButton: !isEditing,
          exportFile: () => {},
          filterColumns: false,
          pagination: false,
          wrapperClassName: classes.wrapperClassName,
          editionHeaderTitle: !isEditing,
          handleEditClick: () => {
            setField('manual', true);
            setEditing(true);
            onValidityChange(isValid);
          }
        }}
      />
      <div className={classes.informationWrapper}>
        <div className={classes.informationData}>
          <h5 className={classes.title}>
            {t(`${baseTranslationPath}.sourceName`).toUpperCase()}
          </h5>
          <AdditionalInformation
            title={t(`${baseTranslationPath}.total`)}
            value={originTotal}
            hideValue={isEditing}
            valueType="energy"
            titleColor="green"
          />
          <AdditionalInformation
            title={t(`${baseTranslationPath}.balance`)}
            value={originBalance}
            hideValue={isEditing}
            valueType="energy"
            titleColor="red"
          />
        </div>
        <div className={classes.informationData}>
          <h5 className={classes.title}>
            {t(`${baseTranslationPath}.unitName`).toUpperCase()}
          </h5>
          <AdditionalInformation
            title={t(`${baseTranslationPath}.total`)}
            value={destinationTotal}
            hideValue={isEditing}
            valueType="energy"
            titleColor="green"
          />
          <AdditionalInformation
            title={t(`${baseTranslationPath}.balance`)}
            value={destinationBalance}
            hideValue={isEditing}
            valueType="energy"
            titleColor="red"
          />
        </div>
        <ManualAllocationModal
          isOpen={modalIsOpen}
          handleClose={() => openModal(false)}
          handleContinue={(selectedSource, selectedDestination) => {
            openModal(false);
            addAllocation(selectedSource, selectedDestination);
          }}
          sourcesList={sourcesList}
          destinationsList={allDestinations}
          currentAllocation={sources.filter(
            source => source.balance === balance
          )}
        />
      </div>
    </>
  );
};

AllocationByUnit.propTypes = {
  disableFields: PropTypes.bool
};

AllocationByUnit.defaultProps = {
  disableFields: false
};

export default AllocationByUnit;
