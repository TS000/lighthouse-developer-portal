import { Grid } from '@material-ui/core';
import React, { PropsWithChildren } from 'react';

export const FilteredEntityLayout = ({ children }: PropsWithChildren<{}>) => (
  <Grid container style={{ position: 'relative' }}>
    {children}
  </Grid>
);