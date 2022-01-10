import { Grid } from '@material-ui/core';
import React, { PropsWithChildren } from 'react';

export const EntityListContainer = ({ children }: PropsWithChildren<{}>) => (
  <Grid item xs={12} lg={10}>
    {children}
  </Grid>
);