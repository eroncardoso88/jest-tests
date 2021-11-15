import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';

import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';

import Header from '../../components/Table/Header';
import Body from '../../components/Table/Body';

import createTable from '../../utils/table';
import { useReport } from '../../store';

function TableUI({ report }) {
  const { id } = useParams();
  const { $report, setContracts } = useReport();
  const {
    revision,
    referenceMonth,
    type,
    manual,
    balance,
    active,
    contracts
  } = $report;
  async function fetchData() {
    const contracts = report.sources;
    const destinations = report.destinations;
    const data = createTable({ contracts, destinations });
    setContracts(data);
  }

  useEffect(() => {
    console.log('contracts changed!', contracts)
  }, [contracts])

  useEffect(() => {
    fetchData();
  }, []);

  function updateContracts(contract) {
    const listOfContracts = [
      ...contracts.columns.map(item => {
        if (item.stateName === contract.stateName) {
          return {
            ...contract
          };
        }
        return item;
      })
    ];

    setContracts({ ...contracts, columns: listOfContracts });
  }

  return Object.keys(contracts).length ? (
    <TableContainer data-testid="form" component={Paper}>
      <Table data-testid="table" aria-label="collapsible table">
        <Header header={contracts.header} />
        {Object.keys(contracts.columns).length ? (
          <TableBody>
           
            {contracts?.columns.map(state => (
              <Body
                key={state.stateName}
                state={state}
                updateContracts={updateContracts}
              />
              
            )
            )}
          </TableBody>
        ) : (
          'Nenhum resultado encontrado'
        )}
      </Table>
    </TableContainer>
  ) : null;
}

export default TableUI;
