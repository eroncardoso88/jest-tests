import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import months from '../../utils/months';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
const baseTranslationPath = 'contractsAllocationReport.components.initialData';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column'
  },
  formGroup: {
    marginTop: '18px',
    display: 'flex',
    alignItems: 'center'
  },
  monthSelect: {
    width: 195,
    marginRight: 9,
    '@media (max-width: 959px)': {
      width: '100%'
    }
  },
  yearSelect: {
    width: 138,
    marginRight: 37,
    '@media (max-width: 959px)': {
      width: '100%'
    }
  },
  balanceSelect: {
    width: 404,
    marginRight: 29,
    '@media (max-width: 959px)': {
      width: '100%'
    }
  },
  label: {
    background: 'white',
    padding: '0 3px'
  },
  button: {
    flexShrink: 0
  },
  title: {
    fontSize: 19,
    margin: 0,
    color: theme.palette.primary.main,
    textTransform: 'uppercase'
  }
}));

const InitialData = ({
  handleChange,
  handleClick,
  disableSelect,
  selectValues,
  isCreatePage,
  balances
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const history = useHistory();
  return (
    <div className={classes.root}>
      <span className={classes.title}>
        {t(`${baseTranslationPath}.initialData`)}
      </span>
      <div className={classes.formGroup}>
        <FormControl variant="outlined" className={classes.monthSelect}>
          <InputLabel shrink className={classes.label}>
            {t(`${baseTranslationPath}.month`)}
          </InputLabel>
          <Select
            data-testid="select-month"
            value={selectValues.month}
            disabled={disableSelect.month}
            onChange={event => handleChange('month', event.target.value)}
          >
            {months.map(month => (
              <MenuItem
                data-testid="select-month-options"
                key={month}
                value={month}
              >
                {t(`${baseTranslationPath}.${month}`)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl variant="outlined" className={classes.yearSelect}>
          <InputLabel shrink className={classes.label}>
            {t(`${baseTranslationPath}.year`)}
          </InputLabel>
          <Select
            data-testid="select-year"
            value={selectValues.year}
            disabled={disableSelect.year}
            onChange={event => handleChange('year', event.target.value)}
          >
            {[2019, 2020, 2021].map(year => (
              <MenuItem
                data-testid="select-year-options"
                key={year}
                value={year}
              >
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl variant="outlined" className={classes.balanceSelect}>
          <InputLabel shrink className={classes.label}>
            {t(`${baseTranslationPath}.balance`)}
          </InputLabel>
          <Select
            data-testid="select-balance"
            value={selectValues.balance}
            disabled={disableSelect.balance}
            onChange={event => {
              handleChange('balance', event.target.value);
            }}
          >
            {balances.map(option => (
              <MenuItem
                data-testid="select-balance-options"
                key={option.id.toString()}
                value={option.id}
              >
                {option.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {isCreatePage && <Button
          onClick={() => {
            handleClick();
            // history.push('/alocacao-de-contratos/relatorio');
          }}
          variant="contained"
          className={classes.button}
          color="primary"
          disabled={disableSelect.button || !selectValues.balance}
          data-testid="generate-or-update-button"
        >
          {t(
            `${baseTranslationPath}.${
              isCreatePage ? 'generateReport' : 'updateReport'
            }`
          )}
        </Button>}
      </div>
    </div>
  );
};

InitialData.defaultProps = {
  isCreatePage: true,
  disableSelect: {
    month: false,
    year: false,
    balance: false
  },
  selectValues: {
    month: 'january',
    year: '2020',
    balance: 'balance'
  },
  balances: []
};

InitialData.propTypes = {
  handleChange: PropTypes.func.isRequired,
  handleClick: PropTypes.func.isRequired,
  isCreatePage: PropTypes.bool,
  disableSelect: PropTypes.shape({
    month: PropTypes.bool,
    year: PropTypes.bool,
    balance: PropTypes.bool
  }),
  selectValues: PropTypes.shape({
    month: PropTypes.oneOf(months),
    year: PropTypes.string,
    balance: PropTypes.string
  }),
  balances: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string
    })
  )
};
export default InitialData;
