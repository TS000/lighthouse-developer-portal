import React from 'react';
import { Grid } from '@material-ui/core';
import {
  Content,
  ContentHeader,
  SupportButton,
} from '@backstage/core-components';
import { APIFetchComponent } from '../APIFetchComponent';
import { TitleComponent } from '../TitleComponent';
import pluginConfig from '../../pluginConfig.json';

export const APIListComponent = () => {

  return (
    <Content>
      <ContentHeader titleComponent={<TitleComponent/>} >
        <SupportButton>{pluginConfig.supportText}</SupportButton>
      </ContentHeader>
      <Grid container spacing={3} direction="column">
        <Grid item>
          <APIFetchComponent />
        </Grid>
      </Grid>
    </Content>
  )
};
