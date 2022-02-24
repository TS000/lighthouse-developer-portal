import React from 'react';
import { Grid, Button } from '@material-ui/core';
import {
  Content,
  ContentHeader,
  SupportButton,
} from '@backstage/core-components';
import { APIFetchComponent } from '../APIFetchComponent';
import { TitleComponent } from '../TitleComponent';

export const APIListComponent = () => {

  const handleAddClick = () => {
    return; // TODO When access management ticket completed
  };

  return (
    <Content>
      <ContentHeader titleComponent={<TitleComponent/>} >
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
  )
};
