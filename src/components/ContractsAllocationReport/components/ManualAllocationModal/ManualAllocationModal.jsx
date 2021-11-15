import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Autocomplete from '@material-ui/lab/Autocomplete';

import {makeStyles} from '@material-ui/core/styles'

import { useTranslation } from 'react-i18next';

const baseTranslationPath =
  'contractsAllocationReport.components.manualAllocationModal';

const useStyles = makeStyles({
  container: {
    color: '#595959',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
    lineHeight: 28,
    display: 'flex',
    justifyContent: 'center'
  },
  description: {
    lineHeight: 23,
    fontSize: 20,
    display: 'flex',
    justifyContent: 'center'
  },
  input: {
    width: '48%'
  },
  selectGroup: {
    display: 'flex',
    justifyContent: 'space-around',
    width: '70vw'
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center'
  },
  button: {
    width: '20%'
  }
})

const ManualAllocationModal = ({
  isOpen,
  handleClose,
  handleContinue,
  sourcesList,
  destinationsList,
  currentAllocation
}) => {
  const [selectedSource, setSelectedSource] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [filteredDestinationsList, setFilteredDestinationList] = useState([]);

  useEffect(() => {
    setSelectedSource(null);
    setSelectedDestination(null);
  }, [isOpen]);

  useEffect(() => {
    let filteredList = [];
    if (selectedSource) {
      const unitsInAllocation = currentAllocation.filter(source =>
        source.sourceName === selectedSource.sourceName
      ).reduce((acc, source) => [...acc, ...source.destinations], []);

      filteredList = unitsInAllocation.length
        ? destinationsList.filter(destination => !unitsInAllocation.find(unit => unit.unitId === destination.unitId))
        : destinationsList;
    }

    if (!filteredList.find(destination => destination.unitId === selectedDestination)) {
      setSelectedDestination(null);
    }

    setFilteredDestinationList(filteredList);
  }, [selectedSource]);

  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Dialog maxWidth='lg' open={isOpen} onClose={handleClose}>
        <DialogTitle className={classes.title}>{t(`${baseTranslationPath}.title`)}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t(`${baseTranslationPath}.description`)}
          </DialogContentText>
          <div className={classes.selectGroup}>
            <Autocomplete
              value={selectedSource}
              options={sourcesList}
              groupBy={source => t(`${baseTranslationPath}.${source.type}`)}
              getOptionLabel={option => option.sourceName}
              onChange={(_, newValue) => {
                setSelectedSource(newValue);
              }}
              renderInput={params => (
                <TextField
                  {...params}
                  label={t(`${baseTranslationPath}.chooseSource`)}
                  variant="outlined"
                />
              )}
              className={classes.input}
            />
            <Autocomplete
              value={selectedDestination}
              options={filteredDestinationsList}
              getOptionLabel={option => option.unitName}
              onChange={(_, newValue) => {
                setSelectedDestination(newValue);
              }}
              renderInput={params => (
                <TextField
                  {...params}
                  label={t(`${baseTranslationPath}.chooseDestination`)}
                  variant="outlined"
                />
              )}
              className={classes.input}
              disabled={!selectedSource}
            />
          </div>
        </DialogContent>
        <DialogActions className={classes.buttonGroup}>
          <Button onClick={handleClose} color="secondary" className={classes.button}>
            {t(`${baseTranslationPath}.cancel`)}
          </Button>
          <Button
            onClick={() => handleContinue(selectedSource, selectedDestination)}
            color="primary"
            disabled={!selectedSource || !selectedDestination}
            className={classes.button}
          >
            {t(`${baseTranslationPath}.continue`)}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

ManualAllocationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleContinue: PropTypes.func.isRequired,
  sourcesList: PropTypes.arrayOf(PropTypes.shape({
    sourceContractId: PropTypes.number,
    sourceUnitId: PropTypes.number,
    sourceName: PropTypes.string,
    type: PropTypes.string,
    availablePower: PropTypes.number
  })),
  destinationsList: PropTypes.arrayOf(PropTypes.shape({
    unitId: PropTypes.number,
    unitName: PropTypes.string,
    consumption: PropTypes.number
  }))
}

ManualAllocationModal.defaultProps = {
  sourcesList: [],
  destinationsList: []
}

export default ManualAllocationModal;
