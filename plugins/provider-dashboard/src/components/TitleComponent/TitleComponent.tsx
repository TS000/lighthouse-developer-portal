import React, {ReactElement} from 'react';
import { Link } from 'react-router-dom';
import { 
  makeStyles, 
} from '@material-ui/core';
import {
  useRouteRefParams,
} from '@backstage/core-plugin-api';
import Typography from '@material-ui/core/Typography';
import { BackstageTheme } from '@backstage/theme';
import { apiRoutesRef } from '../../routes';

const useStyles = makeStyles<BackstageTheme>(
  theme => ({
    markdown: {
      "& a": {
        color: theme.palette.link
      }
    },
  }),
  { name: 'BackstageContentHeader' }
);

const TitleContents = (): ReactElement => {
  const params = useRouteRefParams(apiRoutesRef);
  const homeView = `/provider-dashboard/`;
  // TODO Full implementation of method is for breadcrumb ticket

  if(params.apiName) {
    return (
      <>
        <Link to={homeView}>APIs</Link>&nbsp;&gt;&nbsp;{params.apiName}
      </>
    );
  }

  return (<>APIs</>);
}

export const TitleComponent = (): ReactElement => {
  const classes = useStyles();

  return (
    <Typography
      variant="h4"
      component="h2"
      data-testid="header-title"
      className={classes.markdown}
    >
      <TitleContents/>
    </Typography>
  );
};
