import React, { useState, useEffect } from 'react';
import { Typography, Grid } from '@material-ui/core';
import {
  InfoCard,
  Header,
  Page,
  Content,
  ContentHeader,
  HeaderLabel,
  SupportButton,
  MarkdownContent,
} from '@backstage/core-components';

export const StarterGuideComponent = () => {
  const [text, setText] = useState({ markdown: '' });
  useEffect(() => {
    fetch(
      'https://raw.githubusercontent.com/department-of-veterans-affairs/lighthouse-embark/main/docs/starter-guide.md',
    )
      .then(response => {
        return response.text();
      })
      .then(responseText => {
        setText({
          markdown: responseText,
        });
      });
  }, []);

  const { markdown } = text;

  return (
    <Page themeId="tool">
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
                <MarkdownContent content={markdown} />
              </Typography>
            </InfoCard>
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
