import React from 'react';
import Alert from '@material-ui/lab/Alert';
import useAsync from 'react-use/lib/useAsync';
import {
  Content,
  ContentHeader,
  InfoCard,
  Header,
  HeaderLabel,
  MarkdownContent,
  Page,
  Progress,
  SupportButton,
} from '@backstage/core-components';
import { Typography, Grid } from '@material-ui/core';

export const StarterGuide = () => {
  const { value, loading, error } = useAsync(async (): Promise<string> => {
    const response = await fetch(
      'https://raw.githubusercontent.com/department-of-veterans-affairs/lighthouse-embark/main/docs/starter-guide.md',
    );
    const body = await response.text();
    return body;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  } else if (!value) {
    const somethingBad = 'Uh Oh! Something went wrong...';
    return <Alert severity="error">{somethingBad}</Alert>;
  }

  return (
    <Page themeId="tool" data-testid="progress">
      <Header title="Starter Guide">
        <HeaderLabel label="Owner" value="Team Bandicoot" />
        <HeaderLabel label="Lifecycle" value="Alpha" />
      </Header>
      <Content>
        <ContentHeader title="Getting Started">
          <SupportButton>Need additional help getting started?</SupportButton>
        </ContentHeader>
        <Grid container spacing={3} direction="column">
          <Grid item>
            <InfoCard title="">
              <Typography variant="body1">
                <MarkdownContent content={value} />
              </Typography>
            </InfoCard>
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
