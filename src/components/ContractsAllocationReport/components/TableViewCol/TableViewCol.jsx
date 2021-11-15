import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(theme => ({
  root: {
    padding: '16px 24px 16px 24px',
    fontFamily: 'Roboto'
  },
  title: {
    marginLeft: '-7px',
    fontSize: '14px',
    color: theme.palette.text.secondary,
    textAlign: 'left',
    fontWeight: 500
  },
  formGroup: {
    marginTop: '8px'
  },
  formControl: {},
  checkbox: {
    padding: '0px',
    width: '32px',
    height: '32px'
  },
  checkboxRoot: {
    '&$checked': {
      color: theme.palette.primary.main
    }
  },
  checked: {},
  label: {
    fontSize: '15px',
    marginLeft: '8px',
    color: theme.palette.text.primary
  }
}));

const baseTranslationPath = 'contractsAllocationReport.components.tableViewCol';

const TableViewCol = ({ columns, onColumnUpdate, limit }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const handleColChange = index => {
    onColumnUpdate(index);
  };

  const count = columns.reduce((acc, current) => {
    if (current.display && current.viewColumns) {
      return acc + 1;
    }
    return acc;
  }, 0);

  return (
    <FormControl
      className={classes.root}
      data-testid="table-view-col-container"
    >
      <Typography variant="caption" className={classes.title}>
        {t(`${baseTranslationPath}.filters`)}
      </Typography>
      <FormGroup>
        {columns.map((column, index) => {
          return (
            column.display !== 'excluded' &&
            column.viewColumns !== false && (
              <FormControlLabel
                data-testid="table-view-item"
                key={index}
                control={
                  <Checkbox
                    inputProps={{ 'data-testid': 'table-view-checkbox' }}
                    checked={column.display === true}
                    value={column.name}
                    onChange={handleColChange.bind(null, index)}
                    color="primary"
                    disabled={column.display !== true && count === limit}
                  />
                }
                label={column.label}
              />
            )
          );
        })}
      </FormGroup>
    </FormControl>
  );
};

TableViewCol.propTypes = {
  columns: PropTypes.array.isRequired,
  onColumnUpdate: PropTypes.func.isRequired,
  limit: PropTypes.number
};

TableViewCol.defaultProps = {
  limit: null
};

export default React.memo(TableViewCol);
