import React, { useState, useEffect } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import Link from '@material-ui/core/Link';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import History from '@material-ui/icons/History';
import Switch from '@material-ui/core/Switch';
import { Link as RouterLink } from 'react-router-dom';
import moment from 'moment';
import { DataTable, Modal, Loading } from '../../components';
import { useTranslation } from 'react-i18next';
import { useFilter, useReport } from '../../store';
import TYPE_STATUS from '../../utils/typeStatus';
import { useSnackBar } from '../../../../common/SnackBar';

const baseTranslationPath =
  'contractsAllocationReport.containers.listContainer';

const ListContainer = () => {
  const { t } = useTranslation();
  const { setSnackBarHttpSuccess, setSnackBarError } = useSnackBar();
  const {
    $filter,
    updateFilters,
    updateParams,
    clearReportFilters
  } = useFilter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    getReportsList,
    clearState,
    activateReport,
    deactivateReport
  } = useReport();
  const {
    reports: { filters, params }
  } = $filter;
  const [isJustifyModalOpen, setIsJustifyModalOpen] = useState(false);
  const [reportData, setReportData] = useState({});

  const formatToDateString = value => moment(value).format('DD/MM/YYYY');
  const [columns] = useState([
    {
      key: 'details',
      viewColumns: false,
      display: true,
      label: t(`${baseTranslationPath}.visualization`).toUpperCase(),
      common: true,
      content: item => {
        return (
          <Tooltip title={t(`${baseTranslationPath}.visualization`)}>
            <Link
              component={RouterLink}
              to={`/alocacao-de-contratos/relatorio/${item.id}/resumo`}
            >
              <IconButton>
                <Visibility />
              </IconButton>
            </Link>
          </Tooltip>
        );
      }
    },
    {
      key: 'history',
      viewColumns: false,
      display: true,
      label: t(`${baseTranslationPath}.history`).toUpperCase(),
      common: true,
      content: item => {
        return (
          <Tooltip title={t(`${baseTranslationPath}.history`)}>
            <Link
              component={RouterLink}
              to={`/alocacao-de-contratos/relatorio/${item.id}/historico`}
            >
              <IconButton>
                <History />
              </IconButton>
            </Link>
          </Tooltip>
        );
      }
    },
    {
      path: 'changeAt',
      label: t(`${baseTranslationPath}.reportDate`),
      display: true,
      viewColumns: true,
      content: item => formatToDateString(item.changeAt),
      filter: {
        valueFormat: formatToDateString,
      },
    },
    {
      path: 'referenceMonth',
      label: t(`${baseTranslationPath}.alocationDate`),
      display: true,
      viewColumns: true,
      content: item => formatToDateString(item.referenceMonth),
      filter: {
        valueFormat: formatToDateString,
      },
    },
    {
      path: 'balanceDate',
      label: t(`${baseTranslationPath}.balanceDate`),
      display: true,
      viewColumns: true,
      content: item => formatToDateString(item.balanceDate),
      filter: {
        valueFormat: formatToDateString,
      },
    },
    {
      path: 'icmsCost',
      label: t(`${baseTranslationPath}.icmsCost`),
      display: true,
      viewColumns: true,
      content: item => item.ICMSCost,
      filter: {
        valueFormat: cost => cost || 0,
      },
    },
    {
      path: 'icmsCostNotCreditable',
      label: t(`${baseTranslationPath}.icmsCostNotCreditable`),
      largeLabel: true,
      display: true,
      viewColumns: true,
      content: item => item.ICMSCostNotCreditable,
      filter: {
        valueFormat: cost => cost || 0,
      },
    },
    {
      path: 'type',
      label: t(`${baseTranslationPath}.editionStatus`),
      display: true,
      viewColumns: true,
      content: item => t(`${baseTranslationPath}.${item.type.toLowerCase()}`),
      filter: {
        type: 'select',
        options: [
          { value: '', text: t(`${baseTranslationPath}.all`) },
          {
            value: TYPE_STATUS.DRAFT,
            text: t(`${baseTranslationPath}.draft`)
          },
          {
            value: TYPE_STATUS.CONSOLIDATED,
            text: t(`${baseTranslationPath}.consolidated`)
          }
        ]
      }
    },
    {
      path: 'active',
      label: t(`${baseTranslationPath}.status`),
      display: true,
      viewColumns: true,
      filter: {
        type: 'select',
        options: [
          { value: '', text: t(`${baseTranslationPath}.all`) },
          { value: true, text: t(`${baseTranslationPath}.actives`) },
          { value: false, text: t(`${baseTranslationPath}.inactives`) }
        ]
      },
      content: parameter => (
        <Switch
          id={parameter.id}
          inputProps={{ 'data-testid': `switch-${parameter.id}` }}
          checked={parameter.active}
          color="primary"
          onChange={() => handleToggleChange(parameter)}
        />
      )
    }
  ]);

  useEffect(() => {
    clearState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleJustifyModalClose = () => {
    setIsJustifyModalOpen(false);
  };

  const handleConsolidateJustifyModal = async justification => {
    setIsLoading(true);
    if (reportData.active) {
      const response = await deactivateReport(reportData.id, {
        changeJustification: justification
      });
      if (!response) {
        setSnackBarError(t(`${baseTranslationPath}.failedToUpdateReport`));
        setIsLoading(false);
        return setIsJustifyModalOpen(false);
      }

      setIsJustifyModalOpen(false);
      await getReportsList();
      setIsLoading(false);
      return setSnackBarHttpSuccess(
        t(`${baseTranslationPath}.reportUpdatedSuccessfully`)
      );
    }

    const response = await activateReport(reportData.id, {
      changeJustification: justification
    });
    if (!response) {
      setSnackBarError(t(`${baseTranslationPath}.failedToUpdateReport`));
      setIsLoading(false);
      return setIsJustifyModalOpen(false);
    }

    setIsJustifyModalOpen(false);
    await getReportsList();
    setIsLoading(false);
    return setSnackBarHttpSuccess(
      t(`${baseTranslationPath}.reportUpdatedSuccessfully`)
    );
  };

  const handleToggleChange = parameter => {
    setReportData(parameter);
    setIsJustifyModalOpen(true);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <DataTable
        dataTestId="list-container"
        title={t(`${baseTranslationPath}.reports`)}
        columns={columns}
        getData={getReportsList}
        params={params}
        updateParams={arg => updateParams('reports', arg)}
        localFilter
        filters={filters}
        updateFilters={arg => updateFilters('reports', arg)}
        options={{
          pagination: true,
          filterColumns: true,
          addButton: {
            title: t(`${baseTranslationPath}.addReport`),
            url: `/alocacao-de-contratos/relatorio/novo`
          },
          exportButton: true,
          exportFile: () => {},
          clearFiltersButton: true,
          handleClearFilters: clearReportFilters
        }}
      />
      <Modal
        isOpen={isJustifyModalOpen}
        handleClose={handleJustifyModalClose}
        handleConsolidate={handleConsolidateJustifyModal}
        isJustifyModal
      />
    </>
  );
};

export default ListContainer;
