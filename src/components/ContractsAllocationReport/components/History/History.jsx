import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import HistoryToolbar from './HistoryToolbar';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import MuiTable from '@material-ui/core/Table';
import HistoryTableHead from './HistoryTableHead';
import HistoryTableBody from './HistoryTableBody';
import Pagination from '../Pagination/Pagination';

const useStyles = makeStyles({
  tableRoot: {
    outline: 'none'
  },
  responsiveScroll: {
    overflowX: 'auto',
    display: 'flex',
    flexGrow: 1,
    padding: 10
  },
  paper: {
    height: '100%'
  }
});

const History = ({
  title,
  columns,
  data,
  options,
  goBack,
  toolbar,
  pagination,
  divider,
  setFilterState
}) => {
  const classes = useStyles();
  const [rows, setRows] = React.useState([]);
  const [orderBy] = React.useState('date');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [latestSort, setLatestSort] = React.useState('');

  useEffect(() => {
    setRows(data);
  }, [data]);

  function stableSort(array, cmp) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = cmp(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
  }

  function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  const getSorting = () => (a, b) => desc(a, b, orderBy);

  const handleChangePage = page => {
    setPage(page);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleFilter = (column, value) => {
    setFilterState(prev => ({
      ...prev,
      [column]: value
    }));
  };

  const handleSort = column => {
    const rowsCopy = [...rows];

    const sortColumnAndDirection = latestSort === '' ? column : latestSort;
    const isSortingByValue = column === 'value';

    if (sortColumnAndDirection[0] === '-') {
      rowsCopy.sort((a, b) => {
        const firstValue = isSortingByValue ? a[column] : a[column].value;
        const secondValue = isSortingByValue ? b[column] : b[column].value;

        if (firstValue > secondValue) {
          return 1;
        }

        return -1;
      });

      setLatestSort(column);
    } else {
      rowsCopy.sort((a, b) => {
        const firstValue = isSortingByValue ? a[column] : a[column].value;
        const secondValue = isSortingByValue ? b[column] : b[column].value;

        if (firstValue <= secondValue) {
          return 1;
        }

        return -1;
      });

      setLatestSort(`-${column}`);
    }

    setRows(rowsCopy);
  };

  return (
    <React.Fragment>
      {toolbar && <HistoryToolbar title={title} goBack={goBack} />}

      {divider && <Divider data-testid="divider" />}

      <div className={classes.responsiveScroll} data-testid="history-table">
        <MuiTable
          size={options.tablesize}
          tabIndex="0"
          className={classes.tableRoot}
        >
          <HistoryTableHead
            columns={columns}
            handleFilter={handleFilter}
            handleOrdering={handleSort}
          />

          <HistoryTableBody
            columns={columns}
            data={rows}
            count={rows.length}
            stableSort={stableSort}
            getSorting={getSorting}
            page={page}
            rowsPerPage={rowsPerPage}
          />
        </MuiTable>
      </div>
      {pagination && (
        <Pagination
          itemsCount={rows.length}
          pageSize={rowsPerPage}
          currentPage={page}
          onPageChange={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      )}
    </React.Fragment>
  );
};

History.propTypes = {
  title: PropTypes.string,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      display: PropTypes.bool,
      label: PropTypes.string,
      basic: PropTypes.bool,
      content: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
        PropTypes.element,
        PropTypes.func
      ]),
      radio: PropTypes.bool
    })
  ),
  data: PropTypes.array,
  options: PropTypes.object,
  goBack: PropTypes.func,
  toolbar: PropTypes.bool,
  pagination: PropTypes.bool,
  divider: PropTypes.bool,
  setFilterState: PropTypes.func
};

History.defaultProps = {
  title: '',
  columns: [],
  data: [],
  options: {},
  goBack: undefined,
  toolbar: true,
  pagination: true,
  divider: false,
  setFilterState: () => {}
};

export default History;
