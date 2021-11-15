import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import { useHistory, useParams } from 'react-router-dom';
import {
  Loading,
  InitialData,
  Header,
  Modal,
  Tabs,
  TabPanel,
  HistoryCard,
  Negociations
} from '../../components';
import months from '../../utils/months';
import AllocationByState from './AllocationByState';
import AllocationByUnit from './AllocationByUnit';
import typeStatus from '../../utils/typeStatus';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackBar } from 'components/common/SnackBar';
import { useReport } from '../../store';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const baseTranslationPath =
  'contractsAllocationReport.containers.reportContainer';

const useStyles = makeStyles({
  root: {
    padding: '20px'
  },
  pai: {
    backgroundColor: 'pink'
  },
  tabs: {
    marginTop: '2%',
    boxShadow: '0px 6px 5px -4px rgba(0, 0, 0, 0.17)',
    marginBottom: '26px'
  },
  commentaryTitle: {
    color: '#277E7A',
    textTransform: 'uppercase',
    fontSize: 20,
    fontStyle: 'normal',
    fontWeight: 'normal'
  },
  box: {
    marginTop: 20
  }
});

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ReportContainer = () => {
  const history = useHistory();
  const params = useParams();
  const classes = useStyles();
  const { t } = useTranslation();
  const { setSnackBarHttpSuccess, setSnackBarError } = useSnackBar();
  const [tabIndex, setTabIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setValid] = useState(true);
  const [shouldBlockNavigation, setBlockNavigation] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [justifyModalAction, setJustifyModalAction] = useState(false);
  const [isBlockingModalOpen, setBlockingModalOpen] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [id, setId] = useState(null)
  const [disableFields, setDisable] = useState({
    year: false,
    month: false,
    balance: false,
    button: true
  });
  const {
    $report,
    generateReport,
    getReport,
    getHistoryDetail,
    updateReport,
    clearState,
    getBalances,
    setField,
    sendReport,
    getSourcesAndDestinations,
    consolidateReport,
    exportAllocationFile,
    setContracts,
  } = useReport();
  const { sources, type, selectValues, balances, manual, destinations } = $report;
  const tabs = [
    t(`${baseTranslationPath}.state`),
    t(`${baseTranslationPath}.unity`)
  ];

  const isNew = !Boolean(Object.keys(params).length);

  if (!isNew) {
    tabs.push(t(`${baseTranslationPath}.commentaries`));
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const getReportDetails = useCallback(id => getReport(id), [params.id]);
  const getHistory = useCallback(
    (id, revisionId) => getHistoryDetail(id, revisionId),
    [params.id, params.revisionId]
  );
  const getSourcesAndDestinationsDetails = useCallback(
    balanceId =>{ 
      getSourcesAndDestinations(balanceId)
      setId(balanceId)
    },
    [$report.balance]
  );

  useEffect(() => {
    const fetchBalances = async () => {
      const month = months.indexOf(selectValues.month) + 1;
      await getBalances(selectValues.year, month);

      if (!balances.find(({ id }) => $report.balance === id)) {
        handleInitialDataChange('balance', null);
      }
    };

    fetchBalances();
  }, [selectValues.year, selectValues.month]);

  useEffect(() => {
    const fetchSourceDestinationData = async () => {
      await getSourcesAndDestinationsDetails($report.balance);

      setIsLoading(false);
      return;
    };

    if ($report.balance) {
      setIsLoading(true);
      fetchSourceDestinationData();
    }
  }, [$report.balance]);

  useEffect(() => {
    const fetchData = async () => {
      if (params.revisionId) {
        await getHistory(params.id, params.revisionId);
        setIsLoading(false);
        return;
      }

      await getReportDetails(params.id);

      setIsLoading(false);
      return;
    };

    if (!sources.length && !isNew) {
      setIsLoading(true);

      setDisable(prev => ({
        ...prev,
        year: true,
        month: true,
        balance: true,
        button: true
      }));

      fetchData();
    }
  }, [getHistory, getReport, params.id, params.revisionId]);

  const handleReportModalClose = () => {
    clearState();
    setIsReportModalOpen(false);
  };
  const handleJustifyModalClose = () => setJustifyModalAction(false);
  const handleBlockingModalClose = () => setBlockingModalOpen(false);

  const handleConsolidateReportModal = () => {
    history.push(`/alocacao-de-contratos/relatorio/${id}/resumo`);
    setIsReportModalOpen(false);
  };

  const handleConsolidateJustifyModal = async justification => {
    setIsLoading(true);

    let response;
    if (
      justifyModalAction === typeStatus.CONSOLIDATED &&
      type === typeStatus.DRAFT
    ) {
      response = await consolidateReport(id, justification);
    } else {
      response = isNew
        ? await sendReport($report, justification)
        : await updateReport($report, justification);
    }

    setIsLoading(false);
    setJustifyModalAction(false);

    if (!response) {
      setSnackBarError(t(`${baseTranslationPath}.failedToUpdateReport`));
      return;
    }

    history.push(`/alocacao-de-contratos/relatorio/${response.id}/resumo`);
    return setSnackBarHttpSuccess(
      t(`${baseTranslationPath}.reportUpdatedSuccessfully`)
    );
  };

  const handleHeaderOnEdit = () => {
    setDisable(prev => ({
      ...prev,
      balance: false,
      button: true
    }));

    setField('selectValues', {
      year: selectValues.year,
      month: selectValues.month,
      balance: null
    });
  };

  const handleHeaderClick = actionType => {
    const actions = {
      back: () => {
        if (shouldBlockNavigation) return;
        history.goBack();
      },
      draft: async () => {
        if (isValid) {
          if (manual || !isNew) {
            setJustifyModalAction(typeStatus.DRAFT);
            return;
          }
          setIsLoading(true);
          const response = await sendReport($report, '');
          setIsLoading(false);
          if (!response) {
            setSnackBarError(t(`${baseTranslationPath}.failedToUpdateReport`));
            return;
          }

          history.push(
            `/alocacao-de-contratos/relatorio/${response.id}/resumo`
          );
          return setSnackBarHttpSuccess(
            t(`${baseTranslationPath}.reportUpdatedSuccessfully`)
          );
        } else {
          setBlockingModalOpen(true);
        }
      },
      consolidate: () => {
        if (isValid) {
          setJustifyModalAction(typeStatus.CONSOLIDATED);
        } else {
          setBlockingModalOpen(true);
        }
      },
      edit: handleHeaderOnEdit
    };
    actions[actionType]();
  };

  const handleInitialDataClick = async () => {
    try {
      setIsLoading(true);

      const response = await generateReport(
        selectValues.year,
        months.indexOf(selectValues.month) + 1,
        selectValues.balance
      );
      history.push(`/alocacao-de-contratos/relatorio/${id}/resumo`);
    } catch (e) {
      setOpen(true);
    } finally {
      setIsLoading(false);
    }

    setDisable(prev => ({
      ...prev,
      balance: true,
      year: true,
      month: true,
      button: true
    }));

    return;
  };

  const handleInitialDataChange = (field, value) => {
    const newSelectValues = {
      ...selectValues,
      [field]: value
    };
    if (field === 'balance' && value)
      setDisable(prev => ({ ...prev, button: false }));
    setField('selectValues', newSelectValues);
  };

  const handleTabChange = (_, newValue) =>
    shouldBlockNavigation || setTabIndex(newValue);

  const handleTabEditingStatusChange = isEditingTab => {
    setBlockNavigation(isEditingTab);
  };

  const renderTab = {
    0: () => (
      <TabPanel index={0} value={tabIndex}>
        <AllocationByState />
      </TabPanel>
    ),
    1: () => (
      <TabPanel index={1} value={tabIndex}>
        <AllocationByUnit
          id={params.id || 0}
          onValidityChange={setValid}
          onBlockCalculation={() => setBlockingModalOpen(true)}
          onEditingStatusChange={handleTabEditingStatusChange}
        />
      </TabPanel>
    ),
    2: () => (
      <TabPanel index={2} value={tabIndex}>
        <h4 className={classes.commentaryTitle} data-testid="comments-tab">
          {t(`${baseTranslationPath}.commentaries`)}
        </h4>
        {$report &&
          $report.comments &&
          $report.comments.map(comment => (
            <HistoryCard
              date={comment.changeAt}
              user={comment.user}
              message={comment.message}
            />
          ))}
      </TabPanel>
    )
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className={classes.root} data-testid="report-container">
      <Header
        handleClick={handleHeaderClick}
        status={Boolean(type.length) && !isReportModalOpen && type}
        canDraft={Boolean(sources.length) && $report.id === 0}
        canGoBack={!shouldBlockNavigation}
        doNotShowEdit={Boolean(params.revisionId) || $report.id === 0}
      />
      <InitialData
        handleChange={handleInitialDataChange}
        handleClick={handleInitialDataClick}
        selectValues={selectValues}
        disableSelect={disableFields}
        isCreatePage={isNew}
        balances={balances}
      />
      <div>
        {Boolean(sources.length) && !isReportModalOpen && (
          <Box className={classes.box}>
            {$report && $report.destinations.length && (
              <Negociations
                report={$report}
                exportAllocationFile={exportAllocationFile}
              />
            )}
          </Box>
        )}
      </div>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} sx={{ width: '100%' }} severity="error">
          Impossível gerar o relatório. Alíquota de ICMS não cadastrada para um
          dos estados referenciados no relatório.
        </Alert>
      </Snackbar>

      <Modal
        isOpen={isReportModalOpen}
        handleClose={handleReportModalClose}
        handleConsolidate={handleConsolidateReportModal}
      />
      <Modal
        isOpen={isBlockingModalOpen}
        handleClose={handleBlockingModalClose}
        isBlockingModal
      />
      <Modal
        isOpen={!!justifyModalAction}
        handleClose={handleJustifyModalClose}
        handleConsolidate={handleConsolidateJustifyModal}
        isJustifyModal
      />
    </div>
  );
};

export default ReportContainer;
