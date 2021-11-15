import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import './styles.css';
import { formatBrToNumber, formatNumber } from '../../../utils/formatValue';

import Unit from './Unit';

export default function Body({ state, updateContracts }) {
  const [open, setOpen] = React.useState(false);

  function onHandleAllocationPower(
    event,
    selectedUnitId,
    selectedContractIndex
  ) {
    if (!event.target) {
      return;
    }

    const allocationValue = formatBrToNumber(event.target.value);

    const units = state.units.map(unit => {
      if (unit.unitId === selectedUnitId) {
        const contracts = unit.contracts.map((contract, index) => {
          if (index === selectedContractIndex) {
            contract = allocationValue;
          }
          return contract;
        });
        const allocationSum = contracts.reduce((a, b) => a + b);
        return {
          ...unit,
          deficit: allocationSum - unit.cost,
          cost: unit.cost,
          contracts
        };
      }
      return unit;
    });

    const allocatedContracts = state.allocatedContracts.map(
      (contract, index) => {
        if (index === selectedContractIndex) {
          const unitsContracts = units
            .map(unit =>
              unit.contracts.filter((contract, index) => {
                if (index === selectedContractIndex) {
                  return contract;
                }
              })
            )
            .flat(1);

          const totalAllocationByContract = unitsContracts.length ? unitsContracts.reduce(
            (a, b) => a + b
          ) : 0;

          contract = totalAllocationByContract;
        }
        return contract;
      }
    );

    const deficitMap = units.map(unit => unit.deficit);
    const deficit = deficitMap.reduce((a, b) => a + b);

    updateContracts({ ...state, deficit, allocatedContracts, units });
  }

  return (
    <React.Fragment>
      <TableRow data-testid="row">
        <TableCell  data-testid="cell" className="top-body-cell">
          <IconButton
            style={{ color: '#fff' }}
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

        <TableCell component="th" className="top-body-cell">
          {state?.stateName}
        </TableCell>
        <TableCell className="top-body-cell">
          {formatNumber(state?.icms_value)}
        </TableCell>
        <TableCell className="top-body-cell">
          {formatNumber(state?.cost)}
        </TableCell>
        <TableCell className="top-body-cell">
          {formatNumber(state?.deficit)}
        </TableCell>

        {state.allocatedContracts.map(contract => (
          <TableCell className="top-body-cell">
            {formatNumber(contract)}
          </TableCell>
        ))}
      </TableRow>
      <TableRow style={{width: '100% !important;'}}>
        <TableCell
          style={{ paddingBottom: 0, paddingTop: 0, paddingLeft: 0, paddingRight: 0, width: '100% !important;' }}
          colSpan={22.5}
        >
          <Collapse
            in={open}
            timeout="auto"
            unmountOnExit
            className="table-body"
          >
            <Box sx={{ margin: 1 }}>
              <Table size="large" aria-label="purchases">
                <TableBody>
                  {state.stateName.includes('MA') && (
                    <TableRow key={state.unitName} className="tester">
                      <TableCell component="th" className="top-body-cell-2">
                        <span>MA Comerc</span>
                      </TableCell>

                      <TableCell />
                      <TableCell />
                      <TableCell />

                      {state?.availableBySales.map(sale => (
                        <TableCell className="top-body-cell-2">
                          <span>{formatNumber(sale.availableForSale)}</span>
                        </TableCell>
                      ))}
                    </TableRow>
                  )}

                  {state?.units.map(unit => (
                    <Unit
                      unit={unit}
                      onHandleAllocationPower={onHandleAllocationPower}
                    />
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
