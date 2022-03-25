import { HomePageCompanyLogo } from '@backstage/plugin-home';
import React from 'react';
import { DVAHeader } from './DVAHeader';
import { Grid, makeStyles, Typography } from '@material-ui/core';

export const useHeaderStyles = makeStyles(theme => ({
    container: {
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 'auto',
        backgroundColor: theme.palette.info.main,
        margin: '-24px',
        marginBottom: '0px',
        width: 'auto'
    },
    gridText: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing(10),
    },
    mainText: {
        height: 'auto',
        weight: 'auto',
        margin: theme.spacing(5,5),
        color: theme.palette.background.default,
    },
    subText: {
        margin: theme.spacing(0,5),

        color: theme.palette.background.default,
        width: theme.spacing(70)
    },
    gridImage: {
        margin: theme.spacing(0,5),
        marginTop: '-8px',
    },
    svg: {
        width: 'auto',
        height: 'auto',
    },
    g: {
        clipPath: 'url(#clip0_675_1726)',
    },
    pathMain: {
        fillRule: 'evenodd',
        clipRule: 'evenodd',
        fill: theme.palette.background.paper
    },
    pathGrey: {
        fill: "#C4C4C4"
    },
    pathBackground: {
        fill: theme.palette.primary.main
    }
}));
const headerTitle = 'VA Lighthouse';
const headerSubtitle = 'The place to contribute, manage, maintain, and discover software across teams at VA.';

export const HomePageDVAHeader = () => {
    const { container, gridText, mainText, subText, gridImage, svg, g, pathMain, pathGrey, pathBackground } = useHeaderStyles();
    return (
        <Grid container className={container}>
        <Grid item className={gridText}>
            <Typography className={mainText} variant="h1" >
                {headerTitle}
            </Typography>
            <Typography className={subText} variant="h6" >
                {headerSubtitle}
            </Typography>
        </Grid>
        <Grid item className={gridImage}>
            <HomePageCompanyLogo
            logo={<DVAHeader classes={{ svg, g, pathMain, pathGrey, pathBackground }} />}
            />
        </Grid>
        </Grid>
    );
}
