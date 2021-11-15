import React from 'react';

import TextField from '@material-ui/core/TextField';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import './styles.css';
import {
  formatNumber
} from '../../../../utils/formatValue';
import { useReport } from 'components/ContractsAllocation/ContractsAllocationReport/store';
import Field from './Field';

function Unit({ unit, onHandleAllocationPower }) {
  const { $report } = useReport();
  const {
    type, saved
  } = $report;

  return (
    <TableRow data-testid="unidade" key={unit.unitName} >
      <TableCell component="th" className="body-cell">
        <span>{unit.unitName}</span>
      </TableCell>
      <TableCell className="body-cell">
        <span>{formatNumber(unit.icms_value)}</span>
      </TableCell>
      <TableCell className="body-cell">
        <span>{formatNumber(unit.cost)}</span>
      </TableCell>
      <TableCell className="body-cell">
        <span>{formatNumber(unit.deficit)}</span>
      </TableCell>

      {unit.contracts.map((contract, index) => (
        <TableCell className="body-cell-input">
        <span>
          {' '}
          <TextField
            className="text-field"
            type="text"
            variant="outlined"
            disabled={false}
            defaultValue={contract && formatNumber(contract)}
            style={{ width: 105 }}
            size="small"
            onBlur={event =>
              onHandleAllocationPower(event, unit.unitId, index)
            }
            disabled={type === 'draft' || type === 'Draft' || saved}
          />
        </span>
      </TableCell>
    ))}
    </TableRow>
  );
}

export default Unit;
