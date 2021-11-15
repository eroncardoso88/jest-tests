import React, {useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import TableCell from '@material-ui/core/TableCell';
import {
    formatNumber
  } from '../../../../utils/formatValue';
export default function Field ({contract, unit, index, onHandleAllocationPower, type, saved}) {
    // const [fieldValue, setFieldValue] = useState(null);
    // useEffect(() => {
    //     setFieldValue(contract)
    //     console.log('contract changed', contract)
    // }, [contract])
    return (
        <TableCell className="body-cell-input">
          <span>
            {' '}
            <TextField
              className="text-field"
              type="text"
              variant="outlined"
              disabled={false}
            //   value={fieldValue}
              style={{ width: 105 }}
              defaultValue={contract}
            //   onChange={(event) => setFieldValue(event.target.value)}
              size="small"
              onBlur={event =>
                onHandleAllocationPower(event, unit.unitId, index)
              }
              disabled={type === 'draft' || type === 'Draft' || saved}
            />
          </span>
        </TableCell>
    )
}