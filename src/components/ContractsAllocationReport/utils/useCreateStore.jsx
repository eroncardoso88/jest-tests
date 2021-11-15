import * as React from 'react';

const warnNoProvider = () => {
  // tslint:disable-next-line
  console.warn('[useCreateStore] Missing Provider');
};
const canUseProxy =
  (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') &&
  typeof Proxy !== 'undefined';

const defaultValue = canUseProxy
  ? new Proxy({}, { get: warnNoProvider, apply: warnNoProvider })
  : {};

export default useValue => {
  const Context = React.createContext(defaultValue);

  const Provider = props => {
    const value = useValue(props);

    return <Context.Provider value={value}>{props.children}</Context.Provider>;
  };

  const useContext = () => React.useContext(Context);

  useContext.Context = Context;

  useContext.Provider = Provider;

  return useContext;
};
