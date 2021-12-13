import React, { PropsWithChildren } from 'react';
import { Grid } from '@material-ui/core';
import {
  Header,
  Page,
  Content
} from '@backstage/core-components';

const Wrapper = ({ children }: PropsWithChildren<{}>) => (
  <Grid container spacing={4}>
    <Grid item xs={4}>
      {children}
    </Grid>
  </Grid>
);

export const BuildTimes = () => (
    <iframe title="dashboard-widget-buildtimes" src="https://app.datadoghq.com/graph/embed?token=a4ff3ea23129554e10ae4df743398e1dd3985d908db578821df7f1732a814da5&height=300&width=600&legend=true" width="600" height="300" frameBorder="0" />
)

export const BackendErrors = () => (
    <iframe title="dashboard-widget-backenderrors" src="https://app.datadoghq.com/graph/embed?token=bfab6fa6ea94b5fa6c26519619c283edf06420941d520b375b0a620c47036ad2&height=300&width=600&legend=true" width="600" height="300" frameBorder="0" />
)

export const DatadogDashboard = () => (
  <Page themeId="tool">
    <Header title="Datadog Dashboard" subtitle="Integrated Dashboard" />
    <Content>
      <Wrapper>
        <BuildTimes/>
      </Wrapper>
      <Wrapper>
        <BackendErrors/>
      </Wrapper>
    </Content>
  </Page>
);
