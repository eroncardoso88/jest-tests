import React from 'react';
import PropTypes from 'prop-types';
import TablePagination from '@material-ui/core/TablePagination';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

const baseTranslationPath = 'contractsAllocationReport.components.pagination';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing(2.5)
  },
  pagination: {
    marginTop: 20,
    '& .MuiTablePagination-spacer': {
      display: 'none'
    },
    '& .MuiSelect-root.MuiSelect-select.MuiTablePagination-select.MuiSelect-selectMenu.MuiInputBase-input.MuiInputBase-inputSelect': {
      color: 'transparent'
    },
    '&, & *': {
      boxSizing: 'border-box',
      padding: 0
    },
    '& > *': {
      justifyContent: 'flex-end',
      [theme.breakpoints.down('xs')]: {
        flexWrap: 'wrap',
        justifyContent: 'center'
      },
      '& p': {
        [theme.breakpoints.down('xs')]: {
          width: '100%',
          textAlign: 'center'
        }
      }
    }
  }
}));

const TablePaginationActions = ({ count, page, rowsPerPage, onChangePage }) => {
  const classes = useStyles();

  return (
    <div className={classes.root} data-testid="pagination-navigation">
      <IconButton
        data-testid="back-button"
        onClick={() => onChangePage(page - 1)}
        disabled={page === 0}
      >
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        data-testid="next-button"
        onClick={() => onChangePage(page + 1)}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
      >
        <KeyboardArrowRight />
      </IconButton>
    </div>
  );
};

const Pagination = ({
  itemsCount,
  pageSize,
  currentPage,
  onPageChange,
  onChangeRowsPerPage,
  pageOptions
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  return (
    <TablePagination
      data-testid="table-pagination-root"
      rowsPerPageOptions={pageOptions}
      component="div"
      count={itemsCount}
      rowsPerPage={pageSize}
      labelRowsPerPage={t(`${baseTranslationPath}.resultsPerPage`)}
      page={currentPage}
      onChangePage={onPageChange}
      labelDisplayedRows={({ from, to, count }) =>
        `${from}-${to} ${t('label_in')} ${count}`
      }
      onChangeRowsPerPage={onChangeRowsPerPage}
      ActionsComponent={TablePaginationActions}
      classes={{ root: classes.pagination }}
    />
  );
};

Pagination.propTypes = {
  itemsCount: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onChangeRowsPerPage: PropTypes.func.isRequired,
  pageOptions: PropTypes.arrayOf(PropTypes.string)
};

Pagination.defaultProps = {
  pageOptions: ['10', '50', '100']
};

export default React.memo(Pagination);
