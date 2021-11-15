import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import PersonIcon from '@material-ui/icons/Person';
import { makeStyles } from '@material-ui/core/styles';

const HistoryCard = ({ date, user, message }) => {
  const classes = useStyles();

  return (
    <Paper className={classes.root} data-testid="history-card-container">
      <div className={classes.firstRow}>
        <span>
          {new Date(date).toLocaleString('pt-BR').replace(' ', ' - ')}
        </span>
      </div>
      <div className={classes.secondRow}>
        <PersonIcon />
        <span className={classes.user}>{user}</span>
      </div>
      <span className={classes.message}>{message}</span>
    </Paper>
  );
};

const useStyles = makeStyles({
  root: {
    display: 'flex',
    maxWidth: 800,
    margin: '20px 0',
    flexDirection: 'column',
    padding: '10px 15px 15px',
    boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.15)'
  },
  firstRow: {
    height: 36,
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  secondRow: {
    marginBottom: 10,
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center'
  },
  user: {
    margin: '0 8px 0 5px'
  },
  message: {
    lineHeight: '1.5em'
  }
});

HistoryCard.propTypes = {
  date: PropTypes.string.isRequired,
  user: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired
};

export default React.memo(HistoryCard);
