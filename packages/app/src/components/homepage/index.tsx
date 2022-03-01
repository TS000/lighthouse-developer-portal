import { Grid, Button } from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import { MaintenanceBanner } from '../MaintenanceBanner/MaintenanceBanner';
import { Content, Header, InfoCard, Page } from '@backstage/core-components';
import { Search } from '../search';

const homepage: any = {
  title: 'Homepage',
  component: InfoCard,
};

export default homepage;

export const HomePage = () => {
  return (
    <Page themeId="home">
      <Header title="Home" />
      <MaintenanceBanner />
      <Content>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Search />
          </Grid>
          <Grid item xs={4}>
            <InfoCard
              title="Starter Guide"
              subheader="A guide to getting started with the Lighthouse developer portal."
            >
              <p>Learn how to add catalog entities to the software catalog and more!</p>
              <Button
                component={Link}
                to="/starter-guide"
                variant="contained"
                color="primary"
              >
                Read More
              </Button>
            </InfoCard>
          </Grid>
          <Grid item xs={4}>
            <InfoCard
              title="Contributing Guide"
              subheader="A guide to contributing to the Lighthouse developer portal."
            >
              <p>Learn how to build plugins, submit feedback, and more!</p>
              <Button
                component={Link}
                to="/contributing-guide"
                variant="contained"
                color="primary"
              >
                Read More
              </Button>
            </InfoCard>
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
