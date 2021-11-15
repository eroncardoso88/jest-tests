import React from 'react';

import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import InputAdornment from '@material-ui/core/InputAdornment';
import Search from '@material-ui/icons/Search';
import IconButton from '@mui/material/IconButton';
import './styles.css';

function Header({ header }) {
  return (
    <TableHead>
      <TableRow>
        <TableCell />
        <TableCell />
        <TableCell align="left">
          <span>
            <p className="contract-name">Valor total de ICMS (R$)</p>
          </span>
        </TableCell>

        <TableCell align="left">
          <span>
            <p className="contract-name">Consumo (MWh)</p>
          </span>
        </TableCell>

        <TableCell align="left">
          <span>
            <p className="contract-name">Déficit</p>
          </span>
        </TableCell>

        {header?.map(item => (
          <TableCell style={{ paddingLeft: '0px' }}>
            <span className="contract-name-cost">
              <p className="contract-name">{item?.sourceName}</p>
              <p> {item?.cost} </p>
            </span>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default Header;
