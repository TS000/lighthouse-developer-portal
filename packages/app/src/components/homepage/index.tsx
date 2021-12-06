import { Grid, Button } from '@material-ui/core';
import React, { PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';
import { MaintenanceBanner } from '../MaintenanceBanner/MaintenanceBanner';
import { Content, Header, InfoCard, Page } from '@backstage/core-components';

const homepage: any = {
  title: 'Embark Homepage',
  component: InfoCard,
};

export default homepage;

const Wrapper = ({ children }: PropsWithChildren<{}>) => (
  <Grid container spacing={4}>
    <Grid item xs={4}>
      {children}
    </Grid>
  </Grid>
);

export const HomePage = () => {
  return (
    <Page themeId="home">
      <Header title="Embark Developer Portal" />
      <MaintenanceBanner />
      <Content>
        <Wrapper>
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
        </Wrapper>
      </Content>
    </Page>
  );
};
