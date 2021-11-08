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
} from '@backstage/core-components';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

export const StarterGuideComponent = () => {
  const [ text, setText ] = useState({ markdown: "" });

  useEffect( () => {
    fetch('https://raw.githubusercontent.com/department-of-veterans-affairs/lighthouse-backstage/landing-page/docs/starter-guide.md')
    .then(response => {
      return response.text()
    })
    .then(responseText => {
      setText({
        markdown: responseText
      })
    })
  }, [])

  const { markdown } = text;

  return (
  <Page themeId="tool">
    <Header title="Starter Guide" >
      <HeaderLabel label="Owner" value="Team Bandicoot" />
      <HeaderLabel label="Lifecycle" value="Alpha" />
    </Header>
    <Content>
      <ContentHeader title="Getting Started">
        <SupportButton>A description of your plugin goes here.</SupportButton>
      </ContentHeader>
      <Grid container spacing={3} direction="column">
        <Grid item>
          <InfoCard title="">
            <Typography variant="body1">
            <Markdown rehypePlugins={[rehypeRaw]}>
              {markdown}
            </Markdown>
            </Typography>
          </InfoCard>
        </Grid> 
      </Grid>
    </Content>
  </Page>
)};
