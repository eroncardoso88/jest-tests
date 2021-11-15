import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const HeaderButton = ({ handleClick, children, color, isDisabled }) => {
  const classes = useStyles();

  return (
    <Button
      data-testid="header-button"
      onClick={handleClick}
      variant="contained"
      color={color}
      className={classes.root}
      disabled={isDisabled}
    >
      {children}
    </Button>
  );
};

const useStyles = makeStyles({
  root: {
    marginRight: 8,
    marginLeft: 8
  }
});

HeaderButton.propTypes = {
  handleClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  color: PropTypes.oneOf(['primary', 'secondary'])
};

HeaderButton.defaultProps = {
  handleClick: () => {},
  isDisabled: false
};

export default React.memo(HeaderButton);
