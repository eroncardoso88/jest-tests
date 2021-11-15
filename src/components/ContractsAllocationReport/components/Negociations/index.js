import React, { useState } from 'react';
import './styles.css';
import Table from '../../components/Table';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import GetApp from '@material-ui/icons/GetApp';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ViewModule from '@material-ui/icons/ViewModule';
import List from '@material-ui/core/List';
import { AdditionalInformation } from '..';
import { useReport } from '../../store';
import PictureAsPdf from '@material-ui/icons/PictureAsPdf';
import { useTranslation } from 'react-i18next';

const baseTranslationPath = 'contractsAllocationReport.components.dataTable';

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
    backgroundColor: '#007e7a',
    marginRight: '15px'
  }
});

function Negociations({ report, exportAllocationFile }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorExport, setAnchorExport] = useState(null);

  const { t } = useTranslation();

  const {
    $report: { ICMSCost, ICMSCostNotCreditable },
    getAllocationByStateData
  } = useReport();

  const classes = useStyles();

  function handleClickExport(event) {
    setAnchorExport(event.currentTarget);
  }

  function handleCloseExport() {
    setAnchorExport(null);
  }

  const openExport = Boolean(anchorExport);

  const handleExport = () => {};

  return (
    <div className="container" data-testid="table-negociation-root"
    >
      <div className="title-toolbar-container">
        <Typography variant="h6" className={classes.titleText}>
          ALOCAÇÃO
        </Typography>
        <>
          <Button
            data-testid="export-button"
            size="small"
            variant="outlined"
            onClick={handleClickExport}
          >
            <GetApp className={classes.margin} />
            <span className={classes.hideText}>
              {t(`${baseTranslationPath}.export`).toUpperCase()}
            </span>
          </Button>
          <Popover
            open={openExport}
            anchorEl={anchorExport}
            onClose={handleCloseExport}
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
              {/* <ListItem
                data-testid="export-pdf-button"
                button
                onClick={() => {
                  exportAllocationFile(report.id, 'pdf');
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
                  exportAllocationFile(report.id, 'xlsx');
                }}
              >
                <ListItemIcon>
                  <ViewModule />
                </ListItemIcon>
                <ListItemText primary="EXCEL" />
              </ListItem>
            </List>
          </Popover>
        </>
      </div>

      <Table report={report} />

      <div className={classes.icms}>
        <AdditionalInformation
          title={t(`${baseTranslationPath}.icmsValues`)}
          value={ICMSCost}
        />
        <AdditionalInformation
          title={t(`${baseTranslationPath}.icmsNotCreditable`)}
          value={ICMSCostNotCreditable}
          valueColor="red"
        />
      </div>
    </div>
  );
}

export default Negociations;
