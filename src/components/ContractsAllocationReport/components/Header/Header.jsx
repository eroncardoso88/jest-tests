import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import Edit from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import typeStatus from '../../utils/typeStatus';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { curryN } from 'lodash/fp';
import { useReport } from '../../store';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import createTable from '../../utils/table';

const baseTranslationPath = 'contractsAllocationReport.components.header';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 40
  },
  title: {
    fontSize: 19,
    marginRight: 15,
    textTransform: 'uppercase'
  },
  status: {
    padding: '0 25px',
    backgroundColor: '#E0E0E0',
    borderRadius: 15,
    marginRight: 15
  },
  emptySpace: {
    width: '10%'
  },
  button: {
    marginRight: 15
  }
});

const Header = ({
  status,
  handleClick,
  canDraft,
  canGoBack,
  doNotShowEdit
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { id } = useParams();
  const [displayReportButtons, setDisplayReportButtons] = useState(false);
  const [openSaving, setOpenSaving] = useState(false);
  const [openSaved, setOpenSaved] = useState(false);
  const [openCalculating, setOpenCalculating] = useState(false);
  const [openCalculated, setOpenCalculated] = useState(false);
  const [openErrorSave, setOpenErrorSave] = useState(false);
  const [openErrorCalculate, setOpenErrorCalculate] = useState(false);
  const { $report, saveReport, calculateReport, setContracts } = useReport();
  const [loading, setLoading] = useState(false);
  const {
    revision,
    referenceMonth,
    type,
    manual,
    balance,
    active,
    contracts,
    saved,
    destinations
  } = $report;
  

  const handleSave = useCallback(async () => {
    try {
      setLoading(true);
      setOpenSaving(true);
      await saveReport({
        contracts: contracts,
        id: id,
        revision: revision,
        referenceMonth: referenceMonth,
        type: type,
        manual: manual,
        balance: balance,
        active: active
      });
      setOpenSaved(true);
    } catch (e) {
      console.log(e);
      setOpenErrorSave(true);
    } finally {
      setLoading(false);
    }
  }, [saveReport, $report, contracts]);

  async function setTables(sources) {
    const data = createTable({ contracts: sources, destinations: destinations });
    setContracts(data);
  }

  const handleCalculate = useCallback(async () => {
    try {
      setLoading(true);
      setOpenCalculating(true);
      const request = await calculateReport({
        contracts: contracts,
        id: id,
        revision: revision,
        referenceMonth: referenceMonth,
        type: type,
        manual: manual,
        balance: balance,
        active: active
      });
      setTables(request.sources)
      setOpenCalculated(true);
    } catch (e) {
      console.log(e);
      setOpenErrorCalculate(true);
    } finally {
      setLoading(false);
    }
  }, [saveReport, $report, contracts]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSaving(false);
    setOpenSaved(false);
    setOpenCalculating(false);
    setOpenCalculated(false);
  };

  useEffect(() => {
    if (contracts.length) return setDisplayReportButtons(true);
    setDisplayReportButtons(false);
  }, [contracts]);

  return (
    <div className={classes.root} data-testid="header">
      {type.trim() ? (<span className={classes.title} data-testid="title">
        {t(`${baseTranslationPath}.contractsAllocationReport`)} 
      </span>) : ''}
      {(status && type.trim()) ? (
        <>
          <span className={classes.status}>
            {t(`${baseTranslationPath}.${status}`)}
          </span>
          {/* {!doNotShowEdit && (
            <Tooltip title={t(`${baseTranslationPath}.edit`)}>
              <IconButton
                onClick={() => handleClick('edit')}
                data-testid="edit-icon"
              >
                <Edit color="primary" />
              </IconButton>
            </Tooltip>
          )} */}
        </>
      ) : ''}

      <div className={classes.emptySpace}></div>

      <Button
        data-testid="back-button"
        onClick={() => handleClick('back')}
        variant="contained"
        className={classes.button}
        color="secondary"
        disabled={!canGoBack}
      >
        {t(`${baseTranslationPath}.back`)}
      </Button>

      {/* <Button
        data-testid="draft-button"
        onClick={() => handleClick('draft')}
        variant="contained"
        className={classes.button}
        color="primary"
        disabled={status === typeStatus.CONSOLIDATED || !canDraft}
      >
        {t(`${baseTranslationPath}.draft`)}
      </Button> */}
      {contracts?.columns?.length > 0 && (type !== 'draft' && type !== 'Draft') && !saved &&(
        <>
        <Button
          data-testid="consolidate-button"
          onClick={handleSave}
          variant="contained"
          className={classes.button}
          color="primary"
          disabled={loading}
        >
          {t(`${baseTranslationPath}.save`)}
        </Button>
        <Button
          data-testid="consolidate-button"
          onClick={handleCalculate}
          variant="contained"
          className={classes.button}
          color="primary"
          disabled={loading}
        >
          {t(`${baseTranslationPath}.calculate`)}
        </Button>
        </>
      )}
      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={openSaving} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="info" sx={{ width: '50%' }}>
          Salvando...
        </Alert>
      </Snackbar>
      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={openSaved} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '50%' }}>
          Relatório salvo!
        </Alert>
      </Snackbar>
      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={openErrorSave} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="danger" sx={{ width: '50%' }}>
          Erro ao salvar o relatório. Favor tentar novamente.
        </Alert>
      </Snackbar>

      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={openCalculating} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="info" sx={{ width: '50%' }}>
          Calculando...
        </Alert>
      </Snackbar>
      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={openCalculated} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '50%' }}>
          Relatório calculado! Campos alterados com bordas em vermelho.
        </Alert>
      </Snackbar>
      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={openErrorCalculate} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="danger" sx={{ width: '50%' }}>
          Erro ao calcular o relatório. Favor tentar novamente.
        </Alert>
      </Snackbar>
    </div>
  );
};

Header.defaultProps = {
  status: false,
  canDraft: false,
  canGoBack: true,
  doNotShowEdit: false
};

Header.propTypes = {
  handleClick: PropTypes.func.isRequired,
  status: PropTypes.oneOf([false, 'Consolidated', 'Draft']),
  canDraft: PropTypes.bool,
  canGoBack: PropTypes.bool,
  doNotShowEdit: PropTypes.bool
};

export default React.memo(Header);
