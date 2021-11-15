import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  spinner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  },
  loading: {
    width: '115px'
  }
});

const Loading = () => {
  const classes = useStyles();
  return (
    <div className={classes.spinner} data-testid="loading">
      <img
        className={classes.loading}
        src="/static/images/loading.gif"
        alt="Carregando"
      />
    </div>
  );
};

export default Loading;
