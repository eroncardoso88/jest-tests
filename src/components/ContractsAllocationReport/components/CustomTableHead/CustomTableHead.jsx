import React from 'react';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Search from '@material-ui/icons/Search';
import Sort from '@material-ui/icons/Sort';
import { Autocomplete } from '@material-ui/lab/';
import { makeStyles } from '@material-ui/core/styles';
import { SelectInput, DateInput } from '../../../../common/Inputs';
import { useTranslation } from 'react-i18next';

const baseTranslationPath =
  'contractsAllocationReport.components.customTableHeader';

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
  largeLabel: {
    width: 200
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
  },
  noMarginCell: {
    paddingLeft: '0'
  },
  alignRight: {
    textAlign: 'right'
  },
  sortButton: {
    marginRight: '0'
  }
});

function CustomTableHead({
  columns,
  filters,
  params,
  handleFilters,
  submitFilters,
  handleOrdering
}) {
  const { t } = useTranslation();

  const renderCell = (column, fullWidth) => {
    if (column.common) return column.label;
    if (column.commonWithSort) {
      return (
        <div>
          <span>{column.label}</span>
          {!column.disableSort && (
            <IconButton
              data-testid="sort-button"
              edge="end"
              onClick={() => handleOrdering(column.sortName || column.path)}
            >
              <Sort />
            </IconButton>
          )}
        </div>
      );
    }
    if (!column.path) return;

    if (column.filter && column.filter.type === 'date') {
      return (
        <React.Fragment>
          <DateInput
            data-testid="date-input"
            name={filters[column.path]}
            value={filters[column.path]}
            onChange={handleFilters(column.path)}
            label={column.label}
            placeholder={t(`${baseTranslationPath}.search`)}
            className={classes.root}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            endAdornment={
              <InputAdornment position="end">
                <IconButton edge="end" onClick={submitFilters}>
                  <Search />
                </IconButton>
              </InputAdornment>
            }
          />
          {!column.disableSort && (
            <IconButton
              data-testid="sort-button"
              edge="end"
              onClick={() => handleOrdering(column.sortName || column.path)}
            >
              <Sort />
            </IconButton>
          )}
        </React.Fragment>
      );
    }
    if (column.filter && column.filter.type === 'select') {
      return (
        <React.Fragment>
          <SelectInput
            data-testid="select-input"
            name={filters[column.path]}
            value={filters[column.path] || params[column.path]}
            label={column.label}
            options={column.filter.options}
            onChange={handleFilters(column.path, 'select')}
            className={classes.root}
            helperText={false}
          />
          {!column.disableSort && (
            <IconButton
              data-testid="sort-button"
              edge="end"
              onClick={() => handleOrdering(column.sortName || column.path)}
            >
              <Sort />
            </IconButton>
          )}
        </React.Fragment>
      );
    }
    if (column.filter && column.filter.type === 'autocomplete') {
      return (
        <React.Fragment>
          <div className={classes.wrapper} data-testid="autocomplete-input">
            <Autocomplete
              value={filters[column.path]}
              options={column.filter.options}
              getOptionLabel={column => column.text}
              onChange={handleFilters(column.path, 'autocomplete')}
              renderInput={inputParams => (
                <TextField
                  {...inputParams}
                  label={column.label}
                  className={classes.autocomplete}
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              )}
              noOptionsText={t('noOptions')}
            />
          </div>
          {!column.disableSort && (
            <IconButton
              data-testid="sort-button"
              edge="end"
              onClick={() => handleOrdering(column.sortName || column.path)}
            >
              <Sort />
            </IconButton>
          )}
        </React.Fragment>
      );
    }
    if (column.filter && column.filter.type === 'custom') {
      return <React.Fragment>{column.label} </React.Fragment>;
    }
    return (
      <React.Fragment>
        <TextField
          data-testid="textfield-input"
          classes={{
            root: column.largeLabel ? classes.largeLabel : classes.root
          }}
          className={fullWidth ? classes.fullWidth : null}
          variant="outlined"
          type="text"
          label={column.label}
          placeholder={t(`${baseTranslationPath}.search`)}
          InputLabelProps={{ shrink: true, style: { whiteSpace: 'nowrap' } }}
          value={filters[column.path]}
          onChange={handleFilters(column.path)}
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
            data-testid="sort-button"
            edge="end"
            onClick={() => handleOrdering(column.sortName || column.path)}
          >
            <Sort />
          </IconButton>
        )}
      </React.Fragment>
    );
  };

  const classes = useStyles();
  return (
    <TableHead data-testid="table-head-container">
      <TableRow>
        {columns.map((column, i) => {
          return (
            column.display === true && (
              <TableCell
                data-testid="head-item"
                size="small"
                align="left"
                key={column.path || column.key}
                className={`
                  ${column.hidePaddingLeft ? classes.noMarginCell : ''}
                  ${column.alignRight ? classes.alignRight : ''}`}
              >
                {renderCell(
                  column,
                  column.fullWidth || false
                )}
              </TableCell>
            )
          );
        })}
      </TableRow>
    </TableHead>
  );
}

export default CustomTableHead;
