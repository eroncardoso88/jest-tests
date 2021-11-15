import React from 'react';
import TextField from '@material-ui/core/TextField';

function Input({ type = 'text', name, id, mask, ...rest }) {
  return (
    <TextField
      data-testid="input-container"
      variant="outlined"
      type={type}
      {...rest}
      id={id || name}
      name={name}
    />
  );
}

export default React.memo(Input);
