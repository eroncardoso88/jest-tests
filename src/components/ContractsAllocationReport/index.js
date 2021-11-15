import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import {
  ListContainer,
  ReportContainer,
  HistoryListContainer
} from './containers';
import { FilterProvider, ReportProvider } from './store';

const ContractsAllocationReport = ({ match }) => {
  const classes = useStyles();

  return (
    <FilterProvider>
      <ReportProvider>
        <div
          className={classes.gridContainer}
          data-testid="contracts-allocation-report-module"
        >
          <Paper square elevation={0} classes={{ root: classes.paper }}>
            <Switch>
              <Route exact path={`${match.path}`} component={ListContainer} />
              <Route
                exact
                path={`${match.path}/novo`}
                component={ReportContainer}
              />
              <Route
                exact
                path={`${match.path}/:id/edita`}
                component={ReportContainer}
              />
              <Route
                exact
                path={`${match.path}/:id/resumo`}
                component={ReportContainer}
              />
              <Route
                exact
                path={`${match.path}/:id/historico`}
                component={HistoryListContainer}
              />
              <Route
                exact
                path={`${match.path}/:id/historico/:revisionId/detalhe`}
                component={ReportContainer}
              />
            </Switch>
          </Paper>
        </div>
      </ReportProvider>
    </FilterProvider>
  );
};

const useStyles = makeStyles(theme => ({
  gridContainer: {
    paddingTop: 15,
    paddingLeft: 10,
    paddingRight: 10,
    minHeight: 850,
    display: 'flex',
    flexDirection: 'row',
    fontFamily: 'Arial',
    width: '100%',
    '& table': {
      width: 'max-content'
    }
  },
  paper: {
    minHeight: 850,
    borderTopColor: theme.palette.primary.main,
    borderTopWidth: 5,
    borderTopStyle: 'solid',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    width: '100%'
  }
}));

export default React.memo(ContractsAllocationReport);
