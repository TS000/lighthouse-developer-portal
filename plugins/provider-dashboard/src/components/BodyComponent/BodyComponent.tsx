import React from 'react';
import { Grid, Button } from '@material-ui/core';
import {
  Header,
  Page,
  Content,
  ContentHeader,
  HeaderLabel,
  SupportButton,
} from '@backstage/core-components';
import { APIFetchComponent } from '../APIFetchComponent';

export const BodyComponent = () => {

  const handleAddClick = () => {
    return; // TODO When access management ticket completed
  };

  return (
    <Page themeId="tool">
      <Header title="Provider Dashboard" subtitle="">
        <HeaderLabel label="Owner" value="Team Quokka" />
        <HeaderLabel label="Lifecycle" value="Alpha" />
      </Header>
      <Content>
        <ContentHeader title="APIs">
          <Button
            disabled
            onClick={handleAddClick}
          >
            Add
          </Button>
          <SupportButton>Dashboard offers a set of tools to view/manage provider configurations, specifications, and automated test results.</SupportButton>
        </ContentHeader>
        <Grid container spacing={3} direction="column">
          <Grid item>
            <APIFetchComponent />
          </Grid>
        </Grid>
      </Content>
    </Page>
    )
};
