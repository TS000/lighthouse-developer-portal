import { Content, InfoCard, Link, Page } from '@backstage/core-components';
import { Button, CardActions, CardContent, Divider, Grid, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { blue } from '../../themes/colorTypes';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import AddCircleOutlineRounded from '@material-ui/icons/AddCircleOutlineRounded';
import FormatListBulletedSharp from '@material-ui/icons/FormatListBulletedSharp';
import { Search } from '../search';
import { HomePageDVAHeader, BetaBannerCard, DVAFooter } from '../homepage';

const useStyles = makeStyles(theme => ({
    searchBar: {
        display: 'flex',
        maxWidth: '60vw',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[1],
        padding: '8px',
        borderRadius: '50px',
        margin: 'auto',
        paddingBottom: '16px',
    },
    contentText: {
    },
    infoCardContainer: {
        marginTop: '8px',
    },
    infoCardHeader: {
        justifyContent: 'flex-start',
        padding: '5px 16px'
    },
    infoCardIcon : {
        justifyContent: 'flex-start',
        padding: '0px',
    },
    infoCardFooter: {
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '11px'
    },
    betaBannerGridItem: {
        marginBottom: '8px',
    },
    betaBanner: {
        backgroundColor: blue[200],
        },
    footerContainerOpen: {
        left: '120px'
    },
}));

export const useHeaderStyles = makeStyles(theme => ({
    container: {
        margin: theme.spacing(0, 0),
        justifyContent: 'center',
        width: 100
    },
}));

const menuBookIcon = (title: string, classes: any) => (
    <div>
        <MenuBookIcon className={classes.infoCardIcon} />
        <Typography variant="h6">
            {title}
        </Typography>
    </div>

);

const addCircleOutlineRounded = (title: string, classes: any) => (
    <div>
        <AddCircleOutlineRounded className={classes.infoCardIcon} />
        <Typography variant="h6">
            {title}
        </Typography>
    </div>

);

const formatListBulletedSharp = (title: string, classes: any) => (
   <div>
        <FormatListBulletedSharp className={classes.infoCardIcon} />
        <Typography variant="h6">
            {title}
        </Typography>
    </div>
);

const cardInfo = [
    {
        action: menuBookIcon,
        title: "Starter Guide",
        contentBody: "Read the starter guide to learn more about the VA Lighthouse dev portal and how to use it.",
        buttonText: "READ THE STARTER GUIDE",
        linkUrl: "/starter-guide"
    },
    {
        action: addCircleOutlineRounded,
        title: "Add to the Catalog",
        contentBody: "Add, manage and search for VA software, including APIs, backend services, data pipelines, and other components.",
        buttonText: "REGISTER A COMPONENT",
        linkUrl: "catalog-import"
    },
    {
        action: formatListBulletedSharp,
        title: "Explore the Catalog",
        contentBody: "Manage all your services and software components, all in one place.",
        buttonText: "EXPLORE CATALOG",
        linkUrl: "catalog"
    }
];

const bannerCardInfo = {
    bodyMainText: 'We are in early beta!',
    bodySubText: `Are you as over the moon with excitement as we are about this developer portal!?
        We would like to hear from you, sign in to GitHub to send us feedback.`,
}

export const HomePage = () => {
    const classes = useStyles();
    const bannerProps = { bannerStyles: classes.betaBanner, ...bannerCardInfo };
    const openFooterProps = { containerProps: classes.footerContainerOpen };

    return (
        <Page themeId="home">
            <Content>
                <Grid container>
                <Grid item xs={12}>
                    <HomePageDVAHeader />
                </Grid>
                
                <Grid container alignItems="center" direction="row">
                    <Grid item xs={12} className={classes.contentText}>
                    <Typography variant="h5" className={classes.contentText}>
                        Things you can do to get started
                    </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Search />
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container className={classes.infoCardContainer}>
                    {cardInfo.map( e => (
                        <Grid item xs={12} md={4}>
                        <InfoCard
                            variant="gridItem"
                            >
                            <CardActions className={classes.infoCardHeader}>
                                {e.action(e.title, classes)}
                            </CardActions>
                            <Divider />
                            <CardContent>
                            <Typography>
                                {e.contentBody}
                            </Typography>
                            </CardContent>
                            <Divider />
                            <CardContent className={classes.infoCardFooter}>
                                <Link to={e.linkUrl}>
                                    <Button size="small">{e.buttonText}</Button>
                                </Link>
                            </CardContent>
                        </InfoCard>
                        </Grid>
                    ))}
                    </Grid>
                </Grid>
                <Grid item xs={12} className={classes.betaBannerGridItem}>
                    <BetaBannerCard {...bannerProps}/>
                </Grid>
                
            </Grid>
            </Content>
            <DVAFooter {...openFooterProps} />
        </Page>
    );
}