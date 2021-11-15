import React, { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Search from '@material-ui/icons/Search';
import Table from '@mui/material/Table';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useTranslation } from 'react-i18next';
import { AdditionalInformation } from '..';
import { Container } from './styles';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Edit from '@material-ui/icons/Edit';
import GetApp from '@material-ui/icons/GetApp';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ViewModule from '@material-ui/icons/ViewModule';
import List from '@material-ui/core/List';
import SettingsIcon from '@material-ui/icons/Settings';
import TableViewCol from 'components/common/TableViewCol';

import { useReport } from '../../store';

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
  },
  titleText: {
    textTransform: 'uppercase',
    fontSize: 20,
    color: '#007e7a',
    marginRight: '20px'
  },
  hideText: {
    '@media (max-width: 600px)': {
      display: 'none'
    }
  },
  margin: {
    marginRight: 5
  },
  greenButton: {
    color: '#fff',
    backgroundColor: '#007e7a'
  }
});

const baseTranslationPath =
  'contractsAllocationReport.containers.reportContainer';

function Row(props) {
  const { row, headerSourceUnits } = props;
  const [open, setOpen] = React.useState(false);

  const rowValues = Object.entries(row);

  return (
    <React.Fragment>
      {console.log(row)}
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {rowValues[0][1]}
        </TableCell>
        {rowValues.map(
          (value, index) =>
            index > 0 &&
            index < rowValues.length - 1 && (
              <TableCell key={index} align="right">
                {value[1]}
              </TableCell>
            )
        )}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              {/* <Typography variant="h6" gutterBottom component="div">
                History
              </Typography> */}
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>ICMS</TableCell>
                    <TableCell>CONSUMO</TableCell>
                    <TableCell>Déficit</TableCell>

                    {headerSourceUnits.map(
                      (source, index) =>
                        source.sourceName !== 'TOTAL' &&
                        source.sourceName !== 'SALDO' && (
                          <TableCell key={index} align="right">
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column'
                              }}
                            >
                              <p>{source.sourceName}</p>
                              <p>{`R$ ${source.cost}/MWh `}</p>
                            </div>
                          </TableCell>
                        )
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.units.map((unitRow, index) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">
                        {unitRow.name}
                      </TableCell>
                      <TableCell align="right">{unitRow.icms}</TableCell>
                      <TableCell align="right">{unitRow.consumo}</TableCell>
                      <TableCell align="right">{unitRow.deficit}</TableCell>
                      <TableCell align="right">{unitRow.usina1}</TableCell>
                      <TableCell align="right">{unitRow.usina2}</TableCell>
                      <TableCell align="right">{unitRow.usina3}</TableCell>
                      <TableCell align="right">{unitRow.contrato1}</TableCell>
                      <TableCell align="right">{unitRow.contrato2}</TableCell>
                      <TableCell align="right">{unitRow.contrato3}</TableCell>
                    </TableRow>
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

export default function CollapsibleTable({ report }) {
  const [open, setOpen] = useState(false);
  const [allowedStates] = useState([
    'Rio de Janeiro',
    'São Paulo',
    'Minas Gerais',
    'Maranhão',
    'Pará'
  ]);
  const { t } = useTranslation();
  const translateString = string => t(`${baseTranslationPath}.${string}`);
  const {
    $report: { sources, ICMSCost, ICMSCostNotCreditable },
    getAllocationByStateData
  } = useReport();
  const {
    $report,
    setField,
    getAllocationByUnitData,
    calculateManualAllocation
  } = useReport();
  const { destinations: allDestinations, sourcesList, balance, type } = $report;

  const dataByState = getAllocationByStateData(allowedStates, translateString);

  const classes = useStyles();

  function createData(...args) {
    return {
      ...args,
      units: [
        {
          name: 'Água Limpa',
          icms: '325235',
          consumo: '12424',
          deficit: '1213',
          usina1: '56456',
          usina2: '346346',
          usina3: '46346',
          contrato1: '63634',
          contrato2: '63634',
          contrato3: '346346'
        },
        {
          name: 'Brucutu',
          icms: '325235',
          consumo: '12424',
          deficit: '1213',
          usina1: '56456',
          usina2: '346346',
          usina3: '46346',
          contrato1: '63634',
          contrato2: '63634',
          contrato3: '346346'
        }
      ]
    };
  }

  const rows = [
    createData(
      'Distribuição MG (MWh)',
      'icms',
      'consumo',
      'deficit',
      ...dataByState.data.results.map((source, index) =>
        source.hasOwnProperty(['Minas Gerais']) &&
        index < dataByState.data.results.length - 2
          ? source['Minas Gerais']
          : ''
      )
    ),
    createData(
      'Distribuição PA (MWh)',
      'icms',
      'consumo',
      'deficit',
      ...dataByState.data.results.map((source, index) =>
        source.hasOwnProperty(['Pará']) ? source['Pará'] : ''
      )
    ),
    createData(
      'Distribuição MA (MWh)',
      'icms',
      'consumo',
      'deficit',
      ...dataByState.data.results.map((source, index) =>
        source.hasOwnProperty(['Maranhão']) ? source['Maranhão'] : ''
      )
    ),
    createData(
      'Distribuição ES (MWh)',
      'icms',
      'consumo',
      'deficit',
      ...dataByState.data.results.map((source, index) =>
        source.hasOwnProperty(['Espírito Santo'])
          ? source['Espírito Santo']
          : ''
      )
    ),
    createData(
      'Distribuição RJ (MWh)',
      'icms',
      'consumo',
      'deficit',
      ...dataByState.data.results.map((source, index) =>
        source.hasOwnProperty(['Rio de Janeiro'])
          ? source['Rio de Janeiro']
          : ''
      )
    ),
    createData(
      'Distribuição MA Comercial (MWh)',
      'icms',
      'consumo',
      'deficit'
      // ...dataByState.data.results.map((source, index) =>
      //   source.hasOwnProperty(['Minas Gerais'])
      //     ? source['Minas Gerais']
      //     : ''
      // )
    )
  ];

  return (
    <Container>
      <div className="title-toolbar-container">
        <Typography variant="h6" className={classes.titleText}>
          ALOCAÇÃO
        </Typography>
        <Button
          size="small"
          className={classes.greenButton}
          // data-testid="filter-columns-button"
          // aria-describedby={id}
          variant="contained"
          // onClick={handleClick}
        >
          Redistribuir
        </Button>
        <>
          <Button
            data-testid="export-button"
            size="small"
            variant="outlined"
            // onClick={handleClickExport}
          >
            <GetApp className={classes.margin} />
            <span className={classes.hideText}>Exportar</span>
          </Button>
          <Popover
            // open={openExport}
            // anchorEl={anchorExport}
            // onClose={handleCloseExport}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center'
            }}
          >
            <List component="nav" data-testid="export-modal">
              {/* Not yet implemented for that module, uncomment when functionality is ready /}
                {/ <ListItem
                  data-testid="export-pdf-button"
                  button
                  onClick={() => {
                    handleExport({ type: 'pdf', fileName: ''});
                    handleCloseExport();
                  }}
                >
                  <ListItemIcon>
                    <PictureAsPdf />
                  </ListItemIcon>
                  <ListItemText primary="PDF" />
                </ListItem> */}
              <ListItem
                data-testid="export-xlsx-button"
                button
                onClick={() => {
                  // handleExport('xlsx');
                  // handleCloseExport();
                }}
              >
                <ListItemIcon>
                  <ViewModule />
                </ListItemIcon>
                <ListItemText primary="XLSX" />
              </ListItem>
            </List>
          </Popover>
        </>
        <>
          <Tooltip title={'Filtrar colunas'}>
            <Button
              size="small"
              data-testid="filter-columns-button"
              // aria-describedby={id}
              variant="outlined"
              // onClick={handleClick}
            >
              <SettingsIcon />
            </Button>
          </Tooltip>
          <Popover
            open={open}
            // anchorEl={anchorEl}
            // onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center'
            }}
          >
            <TableViewCol
            // columns={columns}
            // onColumnUpdate={toggleViewColumn}
            />
          </Popover>
        </>
        <Button
          size="small"
          className={classes.greenButton}
          // data-testid="filter-columns-button"
          // aria-describedby={id}
          variant="contained"
          // onClick={handleClick}
        >
          Nova Alocação
        </Button>
        {/* <Button
          size="small"
          className={classes.greenButton}
          data-testid="filter-columns-button"
          aria-describedby={id}
          variant="contained"
          onClick={handleClick}
        >
          Calcular
        </Button> */}
      </div>

      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell />
              <TableCell>
                <TextField
                  focused
                  data-testid="regular-input"
                  className="filter-input-icms"
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
                        // className={classes.positionEnd}
                      >
                        <IconButton
                          data-testid="input-search-icon"
                          edge="end"
                          onClick={() => {}}
                        >
                          <Search style={{ color: '#009688' }} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </TableCell>
              <TableCell>
                <TextField
                  focused
                  data-testid="regular-input"
                  className="filter-input-icms"
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
                        // className={classes.positionEnd}
                      >
                        <IconButton
                          data-testid="input-search-icon"
                          edge="end"
                          onClick={() => {}}
                        >
                          <Search style={{ color: '#009688' }} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </TableCell>
              <TableCell>
                <TextField
                  focused
                  data-testid="regular-input"
                  className="filter-input-icms"
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
                        // className={classes.positionEnd}
                      >
                        <IconButton
                          data-testid="input-search-icon"
                          edge="end"
                          onClick={() => {}}
                        >
                          <Search style={{ color: '#009688' }} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </TableCell>

              {dataByState.data.results.map((source, index) =>
                source.sourceName !== 'TOTAL' &&
                source.sourceName !== 'SALDO' ? (
                  <TableCell key={index} align="right">
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <p>{source.sourceName}</p>
                      <p>{`R$ ${source.cost}/MWh `}</p>
                    </div>
                  </TableCell>
                ) : (
                  <TableCell key={index} align="right">
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <p>{source.sourceName}</p>
                    </div>
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <Row
                key={index}
                row={row}
                headerSourceUnits={dataByState.data.results}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className={classes.icms}>
        <AdditionalInformation title={'VALOR DE ICMS'} value={ICMSCost} />
        <AdditionalInformation
          title={'VALOR DE ICMS NÃO PASSÍVEL DE CRÉDITO'}
          value={ICMSCostNotCreditable}
          valueColor="red"
        />
      </div>
    </Container>
  );
}
