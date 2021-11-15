import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useTranslation } from 'react-i18next';

const baseTranslationPath = 'contractsAllocationReport.components.modal';

const Modal = ({
  isOpen,
  handleClose,
  handleConsolidate,
  isJustifyModal,
  isBlockingModal
}) => {
  const [justification, setJustification] = React.useState('');
  const { t } = useTranslation();

  return (
    <div data-testid="modal">
      <Dialog open={isOpen} onClose={handleClose}>
        {isJustifyModal ? (
          <>
            <DialogTitle>{t(`${baseTranslationPath}.consolidate`)}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                {t(
                  `${baseTranslationPath}.afterConsolidatingYouWontBeAbbleToEditThisData`
                )}
              </DialogContentText>
              <TextField
                data-testid="justification-input"
                autoFocus
                label={t('justification')}
                type="text"
                fullWidth
                multiline
                value={justification}
                onChange={e => setJustification(e.target.value)}
              />
            </DialogContent>
          </>
        ) : isBlockingModal ? (
          <DialogContent>
            <DialogContentText>
              {t(
                `${baseTranslationPath}.theCurrentAllocationIsInvalidCheckRedFieldsAndTotalValues`
              )}
            </DialogContentText>
          </DialogContent>
        ) : (
          <DialogContent>
            <DialogContentText>
              {t(`${baseTranslationPath}.createReport`)}
            </DialogContentText>
          </DialogContent>
        )}
        <DialogActions>
          <Button
            data-testid="close-button"
            onClick={handleClose}
            color="secondary"
          >
            {t(`${baseTranslationPath}.${isJustifyModal ? 'cancel' : 'leave'}`)}
          </Button>
          {!isBlockingModal && (
            <Button
              data-testid="consolidate-button"
              onClick={() => handleConsolidate(justification)}
              color="primary"
              disabled={isJustifyModal && !justification}
            >
              {t(
                `${baseTranslationPath}.${
                  isJustifyModal ? 'consolidate' : 'visualize'
                }`
              )}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isJustifyModal: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleConsolidate: PropTypes.func.isRequired
};

Modal.defaultProps = {
  isJustifyModal: false
};

export default React.memo(Modal);
