import React from 'react';
import PropTypes from 'prop-types';
import MUITabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  tab: {
    backgroundColor: '#007E7A'
  },
  tabLabel: {
    fontSize: 16
  }
});

const Tabs = ({ tabs, value, handleTabChange }) => {
  const classes = useStyles();

  return (
    <MUITabs
      data-testid="tabs-container"
      value={value}
      onChange={handleTabChange}
      classes={{ indicator: classes.tab }}
    >
      {tabs.map((tab, index) => (
        <Tab
          data-testid="tab-item"
          key={`tab-${index}-${tab}`}
          label={tab}
          className={classes.tabLabel}
        />
      ))}
    </MUITabs>
  );
};

Tabs.propTypes = {
  value: PropTypes.number.isRequired,
  tabs: PropTypes.array.isRequired,
  handleTabChange: PropTypes.func.isRequired
};

export default React.memo(Tabs);
