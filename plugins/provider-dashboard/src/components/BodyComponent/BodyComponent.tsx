import React from 'react';
import { Grid } from '@material-ui/core';
import {
  Header,
  Page,
  Content,
  ContentHeader,
  HeaderLabel,
  SupportButton,
} from '@backstage/core-components';
import { APIFetchComponent } from '../APIFetchComponent';

export const BodyComponent = () => (
  <Page themeId="tool">
    <Header title="Provider Dashboard" subtitle="">
      <HeaderLabel label="Owner" value="Team Quokka" />
      <HeaderLabel label="Lifecycle" value="Alpha" />
    </Header>
    <Content>
      <ContentHeader title="">
        <SupportButton>A description of your plugin goes here.</SupportButton>
      </ContentHeader>
      <Grid container spacing={3} direction="column">
        <Grid item>
          <APIFetchComponent />
        </Grid>
      </Grid>
    </Content>
  </Page>
);
