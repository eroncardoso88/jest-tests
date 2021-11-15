import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import HeaderButton from '../HeaderButton/HeaderButton';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(theme => ({
  left: {
    flex: '1 1 auto'
  },
  actions: {
    flex: '1 1 auto',
    textAlign: 'right'
  },
  titleRoot: {},
  titleText: {},
  icon: {
    '&:hover': {
      color: theme.palette.primary.main
    }
  },
  iconActive: {
    color: theme.palette.primary.main
  },
  filterPaper: {
    maxWidth: '50%'
  },
  searchIcon: {
    display: 'inline-flex',
    marginTop: '10px',
    marginRight: '8px'
  },
  [theme.breakpoints.down('sm')]: {
    titleRoot: {},
    titleText: {
      fontSize: '16px'
    },
    spacer: {
      display: 'none'
    },
    left: {
      padding: '8px 0px'
    },
    actions: {
      textAlign: 'right'
    }
  },
  [theme.breakpoints.down('xs')]: {
    root: {
      display: 'block'
    },
    left: {
      padding: '8px 0px 0px 0px'
    },
    titleText: {
      textAlign: 'center'
    },
    actions: {
      textAlign: 'center'
    }
  },
  '@media screen and (max-width: 480px)': {}
}));

const HistoryToolbar = ({ title, goBack }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Toolbar data-testid="history-toolbar">
      <div className={classes.left}>
        <div className={classes.titleRoot} aria-hidden={'true'}>
          <Typography
            variant="h6"
            className={classes.titleText}
            data-testid="history-toolbar-title"
          >
            {title}
          </Typography>
        </div>
      </div>

      <div className={classes.actions}>
        {Boolean(goBack) && (
          <HeaderButton
            color="secondary"
            handleClick={goBack}
          >
            {t('button_back')}
          </HeaderButton>
        )}
      </div>
    </Toolbar>
  );
};

export default HistoryToolbar;
