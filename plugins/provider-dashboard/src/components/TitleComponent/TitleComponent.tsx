import React, {ReactElement, useContext} from 'react';
import { 
  Grid,
  makeStyles, 
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { BackstageTheme } from '@backstage/theme';
import { Routes, Route } from 'react-router-dom';
import { EnvironmentSelectComponent } from '../EnvironmentSelectComponent';
import { BreadcrumbComponent } from '../BreadcrumbComponent';
import pluginConfig from '../../pluginConfig.json';
import EnvironmentContext from '../../EnvironmentContext';

const useStyles = makeStyles<BackstageTheme>(
  theme => ({
    markdown: {
      width: 1000,
      "& a": {
        color: theme.palette.link
      }
    },
    titleBox: {
      justifyContent: 'space-between',
    },
  }),
  { name: 'BackstageContentHeader' }
);

export const TitleComponent = (): ReactElement => {
  const classes = useStyles();
  const tabs = pluginConfig.tabs;

  const { envContext } = useContext(EnvironmentContext);
  const envLabel = pluginConfig.envLabels[envContext as 'qa' | 'staging' | 'prod'];

  return (
    <Grid container className={classes.titleBox}>
      <Grid item>
        <Typography
          variant="h4"
          component="h2"
          data-testid="header-title"
          className={classes.markdown}
        >
          <BreadcrumbComponent/>
        </Typography>
      </Grid>
      <Grid item>
        <Routes>
          <Route path={tabs.configuration.path} element={<EnvironmentSelectComponent/>} />
          <Route path={tabs.routing.path} element={<EnvironmentSelectComponent/>} />
          <Route path={tabs.versions.path} element={<EnvironmentSelectComponent/>} />
          <Route path={`${tabs.versions.path}/*`} element={<div><b>ENV:</b> {envLabel}</div>} />
        </Routes>
      </Grid>
    </Grid>
  );
};
