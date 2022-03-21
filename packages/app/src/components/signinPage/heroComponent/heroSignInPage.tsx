
import {
    Content,
    Progress,
    Page,
    Header
} from '@backstage/core-components';
import React from 'react';
import { getSignInProviders, useSignInProviders } from '../signinComponents/providers';
import { Grid, makeStyles  } from '@material-ui/core';
import { useStyles } from '../signinComponents/styles';
import { HeroSignInPageProps } from '../CustomSignInPage';
import { HomePageLogo, StatementCard } from '../../homepage';
import { configApiRef, useApi } from '@backstage/core-plugin-api';

const useHeroStyles = makeStyles(theme => ({
    container: {
        margin: theme.spacing(5, 0),
    },
    svg: {
        width: 'auto',
        height: 100,
    },
    path: {
        fill: '#7df3e1',
    },
}));

const useCardStyles = makeStyles(theme => ({
    VACard: {
        backgroundColor: theme.palette.grey[300]
    }
}));

const statementCardInfo = {
    title: 'Digital transfirmation is a key to modernizing the VA',
    bodyMainText: 'The Office of Information and Technology is committed to digitally transforming the VA.',
    bodySubText: `To do this, we\'re giving developers a space to catalog all VA services,
        making them easily searchable and accessible. We hope this portal will increase
        collaboration among teams and will give teams everything they need to manage their
        service, leveraging best practices, tools, and resources that help teams deliver code faster.`,
}

export const HeroSignInPage = ({
    onSignInSuccess,
    providers = [],
  }: HeroSignInPageProps) => {
    const configApi = useApi(configApiRef);
    const classes = useStyles();

    const signInProviders = getSignInProviders(providers);
    const [loading, providerElements] = useSignInProviders(
      signInProviders,
      onSignInSuccess,
    );
    const heroStyles = useHeroStyles();
    const cardStyles = useCardStyles();
    const cardProps = { ...cardStyles, ...statementCardInfo }
    if (loading) {
      return <Progress />;
    }

    return (
      <Page themeId="home">
        <Header title={configApi.getString('app.title')} />
        <Content>
            <Grid container justifyContent="center">
                <Grid item>
                    <HomePageLogo {...heroStyles} />
                </Grid>
            </Grid>
            <Grid
                container
                justifyContent="center"
                spacing={4}
                component="ul"
                classes={classes}
            >
                {providerElements}
            </Grid>
            <Grid container justifyContent="center">
                <Grid item>
                    <StatementCard {...cardProps} />
                </Grid>
            </Grid>
        </Content>
      </Page>
    );
  };