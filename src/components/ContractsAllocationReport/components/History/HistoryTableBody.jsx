import React from 'react';
import MuiTableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import get from 'lodash/get';

const HistoryTableBody = ({
  columns,
  data,
  rowsPerPage,
  count,
  page,
  stableSort,
  getSorting
}) => {
  const renderCell = (item, column) => {
    let data;
    if (column.name === 'date') {
      data = <strong>{item.date}</strong>;
    }

    if (column.content) {
      data = column.content(item);
    } else {
      data = get(item, column.name);
    }

    return <TableCell style={{ whiteSpace: 'nowrap' }}>{data}</TableCell>;
  };

  if (count === 0) return <MuiTableBody />;

  return (
    <MuiTableBody data-testid="history-table-body">
      {stableSort(data, getSorting())
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((row, index) => (
          <TableRow key={index}>
            {columns.map((column, columnIndex) => (
              <React.Fragment key={columnIndex}>
                {renderCell(row, column)}
              </React.Fragment>
            ))}
          </TableRow>
        ))}
    </MuiTableBody>
  );
};

export default HistoryTableBody;
