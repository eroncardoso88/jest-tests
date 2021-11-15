import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Add from '@material-ui/icons/Add';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import Table from '@material-ui/core/Table';
import GetApp from '@material-ui/icons/GetApp';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Toolbar from '@material-ui/core/Toolbar';
import Popover from '@material-ui/core/Popover';
import ListItem from '@material-ui/core/ListItem';
import { Paper } from '@material-ui/core';
import ViewModule from '@material-ui/icons/ViewModule';
import Typography from '@material-ui/core/Typography';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PictureAsPdf from '@material-ui/icons/PictureAsPdf';
import { makeStyles } from '@material-ui/core/styles';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import { Link as RouterLink } from 'react-router-dom';
import SettingsIcon from '@material-ui/icons/Settings';
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';
import IconButton from '@material-ui/core/IconButton';
import Edit from '@material-ui/icons/Edit';
import cloneDeep from 'lodash/cloneDeep';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import CommonTableBody from './CommonTableBody';
import { Pagination, TableViewCol, CustomTableHead, Loading } from '..';

const baseTranslationPath = 'contractsAllocationReport.components.dataTable';

const useStyles = makeStyles(theme => ({
  titleText: {
    textTransform: 'uppercase',
    fontSize: 20,
    color: '#747678'
  },
  hideText: {
    '@media (max-width: 600px)': {
      display: 'none'
    }
  },
  hideButtonXs: {
    '@media (max-width: 600px)': {
      display: 'none'
    },
    '@media (min-width: 601px)': {
      display: 'flex'
    }
  },
  showButtonXs: {
    '@media (max-width: 600px)': {
      display: 'flex'
    },
    '@media (min-width: 601px)': {
      display: 'none'
    }
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingTop: '10px',
    paddingBottom: '10px'
  },
  main: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    marginBottom: '30px',

    '@media (max-width: 600px)': {
      flexWrap: 'wrap',
      justifyContent: 'space-between'
    }
  },
  editionHeader: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  editionHeaderTitle: {
    marginTop: '0px'
  },
  left: {
    flex: '1 1 auto'
  },
  actions: {
    flex: '1 1 auto',
    textAlign: 'right',
    '&>button': {
      marginLeft: 10
    },

    '@media (max-width: 600px)': {
      display: 'flex',
      flexGrow: 0
    }
  },
  titleRoot: {
    display: 'flex'
  },
  button: {
    color: '#FFFFFF',
    backgroundColor: [theme.palette.primary.main],
    boxShadow: 'none',
    fontSize: '0.7rem',
    padding: 10,
    marginLeft: 50,
    '&:hover': {
      backgroundColor: [theme.palette.primary.main]
    }
  },
  margin: {
    marginRight: 5
  },
  paper: {
    padding: theme.spacing(2)
  },
  responsiveScroll: {
    overflowX: ({ isPriorizationPage }) => !isPriorizationPage && 'auto'
  },
  editTitle: {
    display: 'flex',
    alignItems: 'center'
  }
}));

export const DataTableToolbar = ({
  title,
  addButton,
  captions,
  prioritizeButton,
  exportButton,
  filterColumns,
  columns,
  toggleViewColumn,
  handleExport,
  custom,
  wrapperClassName,
  titleCustomStyle,
  editionHeaderTitle,
  handleEditClick,
  clearFilters,
  handleClearFilters
}) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorExport, setAnchorExport] = useState(null);
  const classes = useStyles();

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function handleClickExport(event) {
    setAnchorExport(event.currentTarget);
  }

  function handleCloseExport() {
    setAnchorExport(null);
  }

  const open = Boolean(anchorEl);
  const openExport = Boolean(anchorExport);
  const id = open ? 'simple-popover' : undefined;

  return (
    <Toolbar className={classes.root}>
      <div className={classes.main}>
        <div className={classes.left}>
          <div className={classes.titleRoot} aria-hidden={'true'}>
            {title !== '' && (
              <div className={classes.editTitle}>
                <Typography
                  variant="h6"
                  className={`${
                    titleCustomStyle.length
                      ? titleCustomStyle
                      : classes.titleText
                  }`}
                >
                  {title}
                </Typography>
                {editionHeaderTitle && (
                  <Tooltip title={t(`${baseTranslationPath}.edit`)}>
                    <IconButton onClick={handleEditClick}>
                      <Edit color="primary" />
                    </IconButton>
                  </Tooltip>
                )}
              </div>
            )}
            {addButton && (
              <Link
                className={classes.hideButtonXs}
                component={RouterLink}
                to={addButton.url}
                underline="none"
              >
                <Button
                  data-testid="add-button"
                  size="small"
                  variant="contained"
                  classes={{ contained: classes.button }}
                  onClick={addButton.onClick}
                >
                  <Add />
                  {addButton.title}
                </Button>
              </Link>
            )}
            {prioritizeButton && (
              <Link
                className={classes.hideButtonXs}
                component={RouterLink}
                to={prioritizeButton.url}
                underline="none"
              >
                <Button
                  data-testid="prioritize-button"
                  size="small"
                  variant="contained"
                  classes={{ contained: classes.button }}
                  onClick={prioritizeButton.onClick}
                >
                  {prioritizeButton.title}
                </Button>
              </Link>
            )}
          </div>
        </div>
        <div className={wrapperClassName}>
          {custom}
          <div className={classes.actions}>
            {addButton && (
              <Link
                className={classes.showButtonXs}
                component={RouterLink}
                to={addButton.url}
                underline="none"
              >
                <Button
                  size="small"
                  variant="contained"
                  classes={{ contained: classes.button }}
                  onClick={addButton.onClick}
                >
                  <Add />
                  {addButton.title}
                </Button>
              </Link>
            )}

            {Boolean((captions || []).length) &&
              captions.map(caption => (
                <span
                  data-testid="caption-title"
                  key={caption.title}
                  style={{
                    color: caption.color,
                    textDecoration: 'line-through',
                    display: 'inline-block',
                    padding: '0 10px',
                    fontSize: '14px'
                  }}
                >
                  {caption.title}
                </span>
              ))}

            {clearFilters && (
              <Button
                data-testid="clear-filters-button"
                size="small"
                variant="outlined"
                onClick={handleClearFilters}
              >
                <ClearAllIcon className={classes.margin} />
                <span className={classes.hideText}>
                  {t(`label_clear_filters`).toUpperCase()}
                </span>
              </Button>
            )}

            {exportButton && (
              <>
                <Button
                  data-testid="export-button"
                  size="small"
                  variant="outlined"
                  onClick={handleClickExport}
                >
                  <GetApp className={classes.margin} />
                  <span className={classes.hideText}>
                    {t(`${baseTranslationPath}.export`).toUpperCase()}
                  </span>
                </Button>
                <Popover
                  open={openExport}
                  anchorEl={anchorExport}
                  onClose={handleCloseExport}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center'
                  }}
                >
                  <List component="nav" data-testid="export-modal">
                    <ListItem
                      data-testid="export-pdf-button"
                      button
                      onClick={() => {
                        handleExport('pdf');
                      }}
                    >
                      <ListItemIcon>
                        <PictureAsPdf />
                      </ListItemIcon>
                      <ListItemText primary="PDF" />
                    </ListItem>
                    <ListItem
                      data-testid="export-csv-button"
                      button
                      onClick={() => {
                        handleExport('csv');
                      }}
                    >
                      <ListItemIcon>
                        <ViewModule />
                      </ListItemIcon>
                      <ListItemText primary="CSV" />
                    </ListItem>
                  </List>
                </Popover>
              </>
            )}

            {filterColumns && (
              <>
                <Tooltip title={t(`${baseTranslationPath}.filterColumns`)}>
                  <Button
                    data-testid="filter-columns-button"
                    aria-describedby={id}
                    variant="outlined"
                    onClick={handleClick}
                  >
                    <SettingsIcon />
                  </Button>
                </Tooltip>
                <Popover
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center'
                  }}
                >
                  <TableViewCol
                    columns={columns}
                    onColumnUpdate={toggleViewColumn}
                  />
                </Popover>
              </>
            )}
          </div>
        </div>
      </div>
    </Toolbar>
  );
};

const DataTable = ({
  title,
  titleCustomStyle,
  columns,
  getData,
  values,
  options,
  filters,
  updateFilters,
  params,
  updateParams,
  isPriorizationPage,
  localFilter,
  localSort,
  keepTotalAndBalanceRows,
  dataTestId
}) => {
  const [data, setData] = useState([]);
  const [filteredReportData, setFilteredReportData] = useState([]);
  const [lastSortOrder, setLastSortOrder] = useState('ASC');
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [cols, setCols] = useState(columns);
  const classes = useStyles({ isPriorizationPage });
  const { t } = useTranslation();

  const filterColumns = useMemo(
    () => columns.map(({ path }) => path).filter(column => !!column),
    [columns]
  );

  const createClearFilters = () =>
    filterColumns.reduce((acc, column) => ({ ...acc, [column]: '' }), {});
  const [filterState, setFilterState] = useState(createClearFilters());

  useEffect(() => {
    setCols(columns);
  }, [columns]);

  useEffect(() => {
    if (values.data.results.length !== 0) {
      setData(values.data.results);
      return;
    }

    const doFetch = async () => {
      setIsLoading(true);

      try {
        const queryAndParams = { ...params, perPage: pageSize };
        Object.keys(queryAndParams).forEach(key => {
          if (queryAndParams[key] === '') {
            delete queryAndParams[key];
          }
        });
        const { data } = await getData(queryAndParams);
        setData(data.results);
        setCount(data.count);
      } catch (error) {
        console.log(error);
      }

      setIsLoading(false);
    };

    doFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, getData, pageSize, data.results, data.count, values.results]);

  useEffect(() => {
    let balanceRow;
    let totalRow;

    const totalTranslatedString = t(`${baseTranslationPath}.total`);
    const balanceTranslatedString = t(`${baseTranslationPath}.balance`);

    const filterResult = data.filter(report => {
      if (report.providerName === totalTranslatedString) {
        totalRow = report;
        return false;
      }

      if (report.providerName === balanceTranslatedString) {
        balanceRow = report;
        return false;
      }

      const columnIsInFilter = columnName => {
        const column = columns.find(column => column.path === columnName);

        const value =
          column && column.filter && column.filter.valueFormat
            ? column.filter.valueFormat(report[columnName])
            : report[columnName];

        if (
          !filterState.hasOwnProperty(columnName) ||
          filterState[columnName] === ''
        ) {
          return true;
        }

        const filterValue = column.isNumeric
          ? filterState[columnName].replace(/\./gi, '')
          : filterState[columnName];

        return typeof filterValue !== 'string'
          ? filterValue === value
          : _.deburr(value)
              .toLocaleLowerCase()
              .includes(_.deburr(filterValue).toLocaleLowerCase());
      };

      if (filterColumns.every(columnIsInFilter)) {
        return report;
      }

      return false;
    });

    if (keepTotalAndBalanceRows && totalRow && balanceRow) {
      setFilteredReportData([...filterResult, totalRow, balanceRow]);

      return;
    }

    setFilteredReportData([...filterResult]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterState, data]);

  const handlePageChange = page => {
    setCurrentPage(page);
    updateParams({ page: page + 1 });
  };

  const handleChangeRowsPerPage = event => {
    setCurrentPage(0);
    setPageSize(event.target.value);
    updateParams({ page: 1 });
  };

  const handleFilters = (name, input) => (event, newValue) => {
    event.persist();

    if (localFilter) {
      setFilterState(prev => ({
        ...prev,
        [name]: event.target.value
      }));
    } else {
      if (input === 'select') {
        updateParams({
          [name]: event.target.value,
          page: 1
        });
      } else if (isEmpty(event.target.value)) {
        delete params[name];
        updateParams({ page: 1 });
      }

      updateFilters({
        [name]: input === 'autocomplete' ? newValue : event.target.value,
        page: 1
      });

      setCurrentPage(0);
    }
  };

  const handleExport = async type => {
    try {
      await options.exportFile(type, { ...params, page_size: pageSize });
    } catch (e) {
      alert(e);
    }
  };

  const submitFilters = () => {
    if (filters.create_date) {
      filters.date_creation_start = moment(
        filters.create_date,
        'DD-MM-YYYY'
      ).format('YYYY-MM-DD');
      filters.date_creation_end = moment(
        filters.create_date,
        'DD-MM-YYYY'
      ).format('YYYY-MM-DD');
    }

    if (isEmpty(filters.create_date)) {
      delete filters.date_creation_start;
      delete filters.date_creation_end;
      delete filters.create_date;
      delete params.date_creation_start;
      delete params.date_creation_end;
      delete params.create_date;
    }

    updateParams({ ...filters });
  };

  const handleOrdering = name => {
    if (localSort) {
      const listCopy = [...data];

      if (lastSortOrder === 'ASC') {
        listCopy.sort((a, b) => {
          const firstValue = a[name];
          const secondValue = b[name];

          if (firstValue > secondValue) {
            return 1;
          }

          if (firstValue < secondValue) {
            return -1;
          }

          return 0;
        });
        setLastSortOrder('DESC');
      } else {
        listCopy.sort((a, b) => {
          const firstValue = a[name];
          const secondValue = b[name];

          if (firstValue < secondValue) {
            return 1;
          }

          if (firstValue > secondValue) {
            return -1;
          }

          return 0;
        });
        setLastSortOrder('ASC');
      }

      setData(listCopy);
    } else {
      if (!params.sort) {
        return updateParams({ sort: name });
      }

      if (params.sort === name) {
        return updateParams({ sort: '-' + name });
      }

      return updateParams({ sort: name });
    }
  };

  const toggleViewColumn = index => {
    setCols(prevColumns => {
      const columns = cloneDeep(prevColumns);
      columns[index].display = !columns[index].display;
      return columns;
    });
  };

  const clearAllFilters = () => {
    setFilterState(createClearFilters());

    options.handleClearFilters && options.handleClearFilters();
  };

  return (
    <Paper elevation={0} className={classes.paper} data-testid={dataTestId}>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {!options.hideToolbar && (
            <DataTableToolbar
              title={title}
              titleCustomStyle={titleCustomStyle}
              addButton={options.addButton}
              captions={options.captions}
              prioritizeButton={options.prioritizeButton}
              custom={options.custom}
              customAction={options.customAction}
              exportButtonComponent={options.exportButtonComponent}
              exportButton={options.exportButton}
              handleExport={handleExport}
              filterColumns={options.filterColumns}
              columns={cols}
              toggleViewColumn={toggleViewColumn}
              editionHeaderTitle={options.editionHeaderTitle}
              handleEditClick={options.handleEditClick}
              handleGoBackClick={options.handleGoBackClick}
              wrapperClassName={options.wrapperClassName}
              clearFilters={options.clearFiltersButton}
              handleClearFilters={clearAllFilters}
            />
          )}
          <div
            style={{ position: 'relative' }}
            className={classes.responsiveScroll}
          >
            <Table size="small" data-testid="data-table">
              <CustomTableHead
                columns={cols}
                filters={filterState}
                params={params}
                handleFilters={handleFilters}
                submitFilters={submitFilters}
                handleOrdering={handleOrdering}
              />
              <CommonTableBody columns={cols} data={filteredReportData} />
            </Table>
          </div>
          {Boolean(options.pagination) && (
            <Pagination
              itemsCount={count}
              pageSize={Number(pageSize)}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          )}
        </>
      )}
    </Paper>
  );
};

DataTable.propTypes = {
  apiBudget: PropTypes.bool,
  title: PropTypes.string.isRequired,
  columns: PropTypes.array,
  getData: PropTypes.func,
  options: PropTypes.object.isRequired,
  titleCustomStyle: PropTypes.string,
  filters: PropTypes.object,
  params: PropTypes.object,
  isPriorizationPage: PropTypes.bool,
  localFilter: PropTypes.bool,
  localSort: PropTypes.bool,
  keepTotalAndBalanceRows: PropTypes.bool,
  updateParams: PropTypes.func,
  dataTestId: PropTypes.string
};

DataTable.defaultProps = {
  columns: [],
  captions: [],
  getData: () => {},
  values: { data: { results: [] }, options: [] },
  localFilter: false,
  localSort: false,
  titleCustomStyle: '',
  filters: {},
  params: {},
  isPriorizationPage: false,
  keepTotalAndBalanceRows: false,
  updateParams: () => {},
  dataTestId: ''
};

export default React.memo(DataTable);
