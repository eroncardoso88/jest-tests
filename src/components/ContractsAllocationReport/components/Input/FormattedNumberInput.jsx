import React, { useCallback, useMemo } from 'react';
import StateInput from './StateInput';
import {
  formatNumber,
  formatValueMoney,
  formatBrToNumber,
} from '../../utils/formatValue';

function FormattedNumberInput({ format, value, onChange, ...rest }) {
  const formatToBR = useMemo(
    () => format === 'currency' ? formatValueMoney : formatNumber,
    [format]
  );

  const formatter = useCallback(
    stringValue => formatToBR(formatBrToNumber(stringValue)),
    [formatToBR]
  );

  const handleCursorPosition = useCallback(({ target }) => {
    let cursorPosition = target.selectionStart;
    const newValue = target.value;
    const formattedValue = formatter(newValue);

    const dotCount = strValue => {
      const stringInterval = strValue.substr(0, cursorPosition + 1)
      const matches = stringInterval.match(/\./g);

      return matches ? matches.length : 0;
    };

    if(dotCount(formattedValue) > dotCount(newValue)) {
      cursorPosition++;
    }

    window.requestAnimationFrame(() => {
      target.selectionStart = cursorPosition;
      target.selectionEnd = cursorPosition;
    });
  }, [formatter]);
  
  return (
    <StateInput
      value={formatToBR(value)}
      formatter={formatter}
      onChange={event => {
        handleCursorPosition(event);
        onChange(event);
      }}
      {...rest}
    />
  );
}

FormattedNumberInput.defaultProps = {
  onChange: () => {},
  format: '',
};

export default React.memo(FormattedNumberInput);
