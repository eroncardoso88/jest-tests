import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/core/styles';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Search from '@material-ui/icons/Search';
import Sort from '@material-ui/icons/Sort';
import InputAdornment from '@material-ui/core/InputAdornment';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const useStyles = makeStyles({
  positionEnd: {
    '@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none)': {
      '&>button': {
        marginRight: 12
      }
    }
  },
  root: {
    width: 160
  },
  smallCell: {
    paddingTop: 0,
    paddingBottom: 20,
    paddingLeft: 0,
    paddingRight: 0,
    minWidth: 220
  },
  autocomplete: {
    width: 160,
    fontFamily: 'Arial'
  },
  wrapper: {
    border: 0,
    margin: 0,
    display: 'inline-flex',
    padding: 0,
    position: 'relative',
    minWidth: 0,
    flexDirection: 'column',
    verticalAlign: 'top'
  },
  fullWidth: {
    width: '90%'
  }
});

const HistoryTableHead = ({
  columns,
  handleFilter,
  submitFilters,
  handleOrdering,
  filters
}) => {
  const classes = useStyles();

  const [selectedValue, setSelectedValue] = React.useState('date');

  const renderCell = (
    column,
    filters = {},
    handleFilter,
    submitFilters,
    handleOrdering,
    fullWidth
  ) => {
    if (column.basic) {
      return column.label;
    }

    if (column.radio) {
      return (
        <FormControlLabel
          label={column.label}
          control={
            <Radio
              data-testid="history-table-radio"
              inputProps={{ 'data-testid': 'history-table-radio-input' }}
              color="primary"
              id={column.name}
              name={column.name}
              value={column.name}
              checked={selectedValue === column.name}
              onChange={e => {
                setSelectedValue(e.target.value);
                handleFilter(column);
              }}
            />
          }
        />
      );
    }

    return (
      <React.Fragment>
        <TextField
          data-testid="history-table-textfield"
          inputProps={{ 'data-testid': 'history-table-textfield-input' }}
          classes={{ root: classes.root }}
          className={fullWidth ? classes.fullWidth : null}
          variant="outlined"
          type="text"
          label={column.label}
          placeholder={column.placeholder}
          InputLabelProps={{ shrink: true, style: { whiteSpace: 'nowrap' } }}
          value={filters[column.path]}
          onChange={e => {
            handleFilter(column.path, e.target.value);
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end" className={classes.positionEnd}>
                <IconButton edge="end" onClick={submitFilters}>
                  <Search />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        {!column.disableSort && (
          <IconButton
            data-testid={`disable-sort-button-${column.sortName || column.path}`}
            edge="end"
            onClick={() => handleOrdering(column.sortName || column.path)}
          >
            <Sort />
          </IconButton>
        )}
      </React.Fragment>
    );
  };

  return (
    <TableHead>
      <TableRow>
        {columns.map(column => {
          return (
            column.display && (
              <TableCell
                size="small"
                align="left"
                key={column.name || column.path || column.key}
              >
                {renderCell(
                  column,
                  filters,
                  handleFilter,
                  submitFilters,
                  handleOrdering,
                  column.fullWidth || false
                )}
              </TableCell>
            )
          );
        })}
      </TableRow>
    </TableHead>
  );
};

export default HistoryTableHead;
