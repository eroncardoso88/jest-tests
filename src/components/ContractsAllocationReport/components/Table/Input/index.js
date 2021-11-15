import React from 'react';
import TableCell from "@material-ui/core/TableCell";


function Input({ contracts }) {
  const [unit, setUnit] = useState(contracts);

  return (
    {.map((contract, index) => (
        <TableCell align="right">
          <TextField
            className="text-field"
            key={contract?.unitName}
            variant="outlined"
            //disabled={!editAllocation}
            value={contract}
            size="small"
            type="text"
            onBlur={event => {
              onHandleAllocationPower(event, unit, index);
            }}
          />
        </TableCell>
      ))}
    )
}

export default Input;