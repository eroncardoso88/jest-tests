import React from 'react';
import { TableRow, TableCell, TableBody } from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  tableLine: {
    position: 'relative'
  },
  lineThrough: {
    position: 'absolute',
    height: '2px',
    left: '0',
    right: '0',
    top: '50%',
    'z-index': '123'
  },
  alignRight: {
    textAlign: 'right'
  }
});

function CommonTableBody({ columns, data, valueProperty, toggleStatus }) {
  const styles = useStyles();

  const createKey = (item, column) =>
    item[valueProperty] + (column.path || column.key);

  const renderCell = (item, column, toggleStatus, index, totalCount) => {
    return column.content
      ? column.content(item, toggleStatus, index, totalCount)
      : item[column.path];
  };

  const lineThroughColors = {
    outdated: '#4F4F4F',
    disabled: '#BDBDBD'
  };

  return (
    <TableBody>
      {data.length > 0 ? (
        data.map((item, index) => {
          return (
            <TableRow key={index} hover>
              <>
                {columns.map(
                  column =>
                    column.display && (
                      <TableCell
                        key={createKey(item, column)}
                        className={`
                          ${styles.tableLine}
                          ${column.alignRight ? styles.alignRight : ''}`}
                      >
                        {(item.status === 'outdated' ||
                          item.status === 'disabled') && (
                          <div
                            className={styles.lineThrough}
                            style={{
                              backgroundColor: lineThroughColors[item.status]
                            }}
                          ></div>
                        )}
                        {renderCell(
                          item,
                          column,
                          toggleStatus,
                          index,
                          data.length
                        )}
                      </TableCell>
                    )
                )}
              </>
            </TableRow>
          );
        })
      ) : (
        <></>
      )}
    </TableBody>
  );
}

export default CommonTableBody;
