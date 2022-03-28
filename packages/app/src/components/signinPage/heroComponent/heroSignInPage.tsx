
import {
    Content,
    Progress,
    Page,
} from '@backstage/core-components';
import React from 'react';
import { getSignInProviders, useSignInProviders } from '../signinComponents/providers';
import { Grid, makeStyles, Theme, Typography } from '@material-ui/core';
import { useStyles } from '../signinComponents/styles';
import { HeroSignInPageProps } from '../CustomSignInPage';
import { BetaBannerCard, HomePageDVAHeader, HomePageDVALogo } from '../../homepage';
import { blue } from '../../../themes/colorTypes';

const useFooterStyles = makeStyles((theme: Theme) => ({
    container: {
        margin: theme.spacing(5,0),
        padding: 0
    },
    item: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
}));

const useBannerStyles = makeStyles((theme: Theme) =>({
    container: {
        margin: theme.spacing(5,0)
    },
    betaBanner: {
        backgroundColor: blue[200],
        },
    })
);

const bannerCardInfo = {
    bodyMainText: 'We are in early beta!',
    bodySubText: `Are you as over the moon with excitement as we are about this developer portal!?
        We would like to hear from you, sign in to GitHub to send us feedback.`,
}

const SignInFooter = () => {
    const { item } = useFooterStyles();
    return (
        <Grid item className={item} xs={12}>
            <Typography>
                The Office of Information and Technology is committed to digitally transforming the VA.
            </Typography>
            <HomePageDVALogo />
        </Grid>
    );
};

export const HeroSignInPage = ({
    onSignInSuccess,
    providers = [],
  }: HeroSignInPageProps) => {
    const classes = useStyles();

    const signInProviders = getSignInProviders(providers);
    const [loading, providerElements] = useSignInProviders(
      signInProviders,
      onSignInSuccess,
    );

    const footerStyle = useFooterStyles();
    const bannerStyles = useBannerStyles();
    const bannerProps = { bannerStyles: bannerStyles.betaBanner, ...bannerCardInfo };

    if (loading) {
      return <Progress />;
    }

    return (
      <Page themeId="home">
        <Content>
            <HomePageDVAHeader />
            <Grid container direction="column">
                <Grid item>
                    <Grid
                        container
                        justifyContent="center"
                        spacing={4}
                        component="ul"
                        classes={classes}
                    >
                        {providerElements}
                    </Grid>
                </Grid>
                <Grid item>
                    <Grid container className={bannerStyles.container}>
                        <Grid item xs={12}>
                            <BetaBannerCard {...bannerProps} />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <Grid container className={footerStyle.container}>
                        <SignInFooter />
                    </Grid>
                </Grid>
            </Grid>
        </Content>
      </Page>
    );
  };