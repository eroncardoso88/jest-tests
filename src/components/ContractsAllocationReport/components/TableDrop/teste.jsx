import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Search from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Edit from '@material-ui/icons/Edit';
import { Container, Table, Thead, Tr, Th, Tbody, Td, FilterTr } from './styles';
import { AdditionalInformation } from '..';

const useStyles = makeStyles({
  icms: {
    display: 'flex',
    flexDirection: 'column',
    width: '40%',
    justifyContent: 'space-between',
    '@media (max-width: 600px)': {
      width: '100%'
    },
    '@media (min-width: 601px) and (max-width: 960px)': {
      minWidth: '522px'
    }
  }
});

function TableDrop() {
  const classes = useStyles();

  const rows = [
    {
      Estado: {
        id: 1,
        nome: 'Distribuição MG (MWh)',
        valor1: '1.546,96',
        valor2: '1.546,96',
        valor3: '1.546,96',
        valor4: '1.546,96',
        valor5: '1.546,96',
        valor6: '1.546,96',
        valor7: '1.546,96',
        valor8: '1.546,96',
        valor9: '1.546,96',
        Municipios: [
          {
            id: 1,
            nome: 'Agua Limpa',
            valor1: '1.146,96',
            valor2: '1.346,96',
            valor3: '1.446,96',
            valor4: '1.646,96',
            valor5: '1.236,96',
            valor6: '1.546,96',
            valor7: '1.0846,96',
            valor8: '1.546,96',
            valor9: '1.546,96'
          },
          {
            id: 2,
            nome: 'Burucatu',
            valor1: '1.546,96',
            valor2: '1.546,96',
            valor3: '1.546,96',
            valor4: '1.546,96',
            valor5: '1.546,96',
            valor6: '1.546,96',
            valor7: '1.546,96',
            valor8: '1.546,96',
            valor9: '1.546,96'
          }
        ]
      }
    },
    {
      Estado: {
        id: 2,
        nome: 'Distribuição RJ (MWh)',
        valor1: '1.546,96',
        valor2: '1.546,96',
        valor3: '1.546,96',
        valor4: '1.546,96',
        valor5: '1.546,96',
        valor6: '1.546,96',
        valor7: '1.546,96',
        valor8: '1.546,96',
        valor9: '1.546,96',
        Municipios: [
          {
            id: 1,
            nome: 'Rio1',
            valor1: '1.546,96',
            valor2: '1.546,96',
            valor3: '1.546,96',
            valor4: '1.546,96',
            valor5: '1.546,96',
            valor6: '1.546,96',
            valor7: '1.546,96',
            valor8: '1.546,96',
            valor9: '1.546,96'
          },
          {
            id: 2,
            nome: 'Rio2',
            valor1: '1.546,96',
            valor2: '1.546,96',
            valor3: '1.546,96',
            valor4: '1.546,96',
            valor5: '1.546,96',
            valor6: '1.546,96',
            valor7: '1.546,96',
            valor8: '1.546,96',
            valor9: '1.546,96'
          }
        ]
      }
    }
  ];
  return (
    <>
      <Container>
        <div className="title-container">
          <Typography variant="h6">ALOCAÇÃO</Typography>
          <Tooltip title={'editar'}>
            <IconButton onClick={() => {}}>
              <Edit color="primary" />
            </IconButton>
          </Tooltip>
        </div>

        <Table>
          <Thead>
            <FilterTr>
              <Th />
              <Th />
              <Th>
                <TextField
                  data-testid="regular-input"
                  className="filter-input"
                  variant="outlined"
                  type="text"
                  label={'Valor total de ICMS (R$)'}
                  // placeholder={"placeholder"}
                  InputLabelProps={{
                    shrink: true,
                    style: { whiteSpace: 'nowrap' }
                  }}
                  // value={"value"}
                  onChange={() => {}}
                  onKeyPress={() => {}}
                  InputProps={{
                    'data-testid': 'regular-input-ref',
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        className={classes.positionEnd}
                      >
                        <IconButton
                          data-testid="input-search-icon"
                          edge="end"
                          onClick={() => {}}
                        >
                          <Search />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Th>
              <Th>
                <TextField
                  data-testid="regular-input"
                  className="filter-input"
                  variant="outlined"
                  type="text"
                  label={'Consumo (MWh)'}
                  // placeholder={"placeholder"}
                  InputLabelProps={{
                    shrink: true,
                    style: { whiteSpace: 'nowrap' }
                  }}
                  // value={"value"}
                  onChange={() => {}}
                  onKeyPress={() => {}}
                  InputProps={{
                    'data-testid': 'regular-input-ref',
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        className={classes.positionEnd}
                      >
                        <IconButton
                          data-testid="input-search-icon"
                          edge="end"
                          onClick={() => {}}
                        >
                          <Search />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Th>
              <Th>
                <TextField
                  data-testid="regular-input"
                  className="filter-input"
                  variant="outlined"
                  type="text"
                  label={'Déficit'}
                  // placeholder={"placeholder"}
                  InputLabelProps={{
                    shrink: true,
                    style: { whiteSpace: 'nowrap' }
                  }}
                  // value={"value"}
                  onChange={() => {}}
                  onKeyPress={() => {}}
                  InputProps={{
                    'data-testid': 'regular-input-ref',
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        className={classes.positionEnd}
                      >
                        <IconButton
                          data-testid="input-search-icon"
                          edge="end"
                          onClick={() => {}}
                        >
                          <Search />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Th>
              <Th> USINA PRÓPRIA 1</Th>
              <Th> USINA PRÓPRIA 2</Th>
              <Th> USINA PRÓPRIA 3</Th>
              <Th> CONTRATO 1</Th>
              <Th> CONTRATO 2</Th>
              <Th> CONTRATO 3</Th>
            </FilterTr>
          </Thead>
          {rows.map(estado => {
            return <TableFilho estado={estado} />;
          })}
        </Table>
      </Container>

      <div className={classes.icms}>
        <AdditionalInformation title={'VALOR DE ICMS'} value={6543423} />
        <AdditionalInformation
          title={'VALOR DE ICMS NÃO PASSÍVEL DE CRÉDITO'}
          value={37486236}
          valueColor="red"
        />
      </div>
    </>
  );
}

function TableFilho({ estado }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Thead>
        <Tr key={estado.Estado.id}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {' '}
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
          <Th id="estado-nome">{estado.Estado.nome}</Th>
          <Th> {estado.Estado.valor1}</Th>
          <Th> {estado.Estado.valor2}</Th>
          <Th> {estado.Estado.valor3}</Th>
          <Th> {estado.Estado.valor4}</Th>
          <Th> {estado.Estado.valor5}</Th>
          <Th> {estado.Estado.valor6}</Th>
          <Th> {estado.Estado.valor7}</Th>
          <Th> {estado.Estado.valor8}</Th>
          <Th> {estado.Estado.valor9}</Th>
        </Tr>
      </Thead>
      {open && (
        <Tbody>
          {estado.Estado.Municipios.map(municipios => {
            return (
              <>
                <Tr className="trBody">
                  <Td id="nome">
                    <span>{municipios.nome}</span>
                  </Td>
                  <Td>{estado.Estado.valor20}</Td>
                  <Td>{estado.Estado.valor20}</Td>
                  <Td>{estado.Estado.valor20}</Td>
                  <Td>{estado.Estado.valor20}</Td>
                  <Td>{estado.Estado.valor20}</Td>
                  <Td>{estado.Estado.valor20}</Td>
                  <Td>{estado.Estado.valor20}</Td>
                  <Td>{estado.Estado.valor20}</Td>
                  <Td>{estado.Estado.valor20}</Td>
                </Tr>
              </>
            );
          })}
        </Tbody>
      )}
    </>
  );
}

export default TableDrop;
