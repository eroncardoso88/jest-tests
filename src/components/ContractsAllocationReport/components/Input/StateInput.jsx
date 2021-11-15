import React, { useState } from 'react';
import Input from './Input';

function StateInput({ value, onChange, formatter, ...rest }) {
  const [innerValue, setInnerValue] = useState(formatter(value));

  return (
    <Input
      value={innerValue}
      onChange={event => {
        setInnerValue(formatter(event.target.value));

        onChange(event);
      }}
      {...rest}
    />
  );
}

StateInput.defaultProps = {
  formatter: value => value,
  onChange: () => {},
};

export default React.memo(StateInput);
