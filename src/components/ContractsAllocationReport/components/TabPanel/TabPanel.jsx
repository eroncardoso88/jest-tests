import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    padding: 16,
    display: ({ value, index }) => (value !== index ? 'none' : 'block'),
    backgroundColor: 'white'
  }
});

const TabPanel = ({ children, value, index, customCss }) => {
  const classes = useStyles({ value, index });

  return (
    <div className={classes.root} data-testid="tab-panel-container">
      <div className={customCss}>{children}</div>
    </div>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  customCss: PropTypes.string
};

TabPanel.defaultProps = {
  children: <></>,
  customCss: ''
};

export default React.memo(TabPanel);
