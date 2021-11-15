import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { formatValueMoney, formatValueDecimal } from '../../utils/formatValue';

const useStyles = makeStyles({
  wrapper: {
    border: `1px solid #ABABAB`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: '2.5%',
    paddingRight: '1.5%',
    '@media (min-width: 960px)': {
      flexDirection: 'row'
    },
    marginTop: '2%'
  },
  default: {
    color: '#595959'
  },
  green: {
    color: '#009688'
  },
  red: {
    color: '#EB5757'
  },
  title: {
    fontSize: '16px',
    lineHeight: '19px',
    fontWeight: 'bold'
  },
  value: {
    fontSize: '20px',
    lineHeight: '23px',
    whiteSpace: 'nowrap'
  }
});

const AdditionalInformation = ({
  title,
  value,
  valueColor,
  titleColor,
  valueType,
  hideValue
}) => {
  const classes = useStyles();

  const placeholder = '--,--';

  const formatMoney = any => `R$ ${any}`;
  const monetaryValue = value => formatMoney(formatValueMoney(value));

  const formatEnergy = any => `${any} MWh`;
  const energyValue = value => formatEnergy(formatValueDecimal(value));
  
  const valueFormated = () => {
    if (hideValue) {
      return valueType === 'money' ? formatMoney(placeholder) : formatEnergy(placeholder);
    }
   
    return valueType === 'money' ? monetaryValue(value) : energyValue(value);
  };

  return (
    <div
      className={classes.wrapper}
      data-testid="additional-information"
    >
      <h4
        className={`${classes[titleColor]} ${classes.title}`}
        data-testid="title"
      >
        {title}
      </h4>

      <span
        className={`${classes[valueColor]} ${classes.value}`}
        data-testid="value"
      >
        {valueFormated()}
      </span>
    </div>
  );
};

AdditionalInformation.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  valueColor: PropTypes.oneOf(['default', 'green', 'red']),
  titleColor: PropTypes.oneOf(['default', 'green', 'red']),
  valueType: PropTypes.oneOf(['money', 'energy'])
};

AdditionalInformation.defaultProps = {
  valueColor: 'default',
  titleColor: 'default',
  valueType: 'money',
  value: 0
};

export default AdditionalInformation;
