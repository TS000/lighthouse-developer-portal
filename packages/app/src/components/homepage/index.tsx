import { Grid, Button } from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import { MaintenanceBanner } from '../MaintenanceBanner/MaintenanceBanner';
import { Content, Header, InfoCard, Page } from '@backstage/core-components';
import { Search } from '../search';

const homepage: any = {
  title: 'Embark Homepage',
  component: InfoCard,
};

export default homepage;

export const HomePage = () => {
  return (
    <Page themeId="home">
      <Header title="Embark Developer Portal" />
      <MaintenanceBanner />
      <Content>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Search />
          </Grid>
          <Grid item xs={4}>
            <InfoCard
              title="Starter Guide"
              subheader="A guide to getting started with Embark."
            >
              <p>
                Learn how to add Catalog Entities to the Embark Software Catalog
                and more!
              </p>
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
              subheader="A guide to getting started with contributing to Embark."
            >
              <p>Learn how to make meaningful contributions to Embark!</p>
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
