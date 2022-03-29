import { Content, InfoCard, Link, Page } from '@backstage/core-components';
import { Button, CardActions, CardContent, Divider, Grid, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { blue } from '../../themes/colorTypes';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import AddCircle from '@material-ui/icons/AddCircle';
import ArrowForward from '@material-ui/icons/ArrowForward';
import FormatListBulletedSharp from '@material-ui/icons/FormatListBulletedSharp';
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
        padding: '8px',
        paddingTop: '24px',
    },
    infoCardContainer: {
        marginTop: '8px',
    },
    infoCardHeader: {
        justifyContent: 'flex-start',
        padding: '5px 8px'
    },
    infoCardIcon : {
        padding: '0px',
    },
    infoCardContent: {
        padding: '0px 8px',
        marginBottom: '16px'
    },
    infoCardFooter: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '0px 8px',
    },
    infoCardLink: {
        "&:hover": {
            textDecoration: 'none'
          },
    },
    infoCardButton: {
        padding: '0px',
        color: theme.palette.info.main,
    },
    infoCardFooterIcon: {
        margin: '0px 8px',
    },
    betaBanner: {
        padding: '0px',
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

const addCircle = (title: string, classes: any) => (
    <div>
        <AddCircle className={classes.infoCardIcon} />
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
        action: addCircle,
        title: "Add an API",
        contentBody: "Add APIs, TechDocs, and other items to the catalog.",
        buttonText: "Add to catalog",
        linkUrl: "catalog-import"
    },
    {
        action: formatListBulletedSharp,
        title: "Explore the Catalog",
        contentBody: "Manage all your services and software components, all in one place.",
        buttonText: "EXPLORE CATALOG",
        linkUrl: "catalog"
    },
    {
        action: menuBookIcon,
        title: "Starter Guide",
        contentBody: "Read the starter guide to learn more about the VA Lighthouse dev portal and how to use it.",
        buttonText: "READ THE STARTER GUIDE",
        linkUrl: "/starter-guide"
    },
  
];

const bannerCardInfo = {
    bodyMainText: 'We are in early Alpha!',
    bodySubText: `Have comments, questions, or suggestions about this alpha site?
        Give us, sign in to GitHub to send us feedback.`,
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
                </Grid>
                <Grid item xs={12}>
                    <Grid container className={classes.infoCardContainer}>
                    {cardInfo.map( e => (
                        <Grid item xs={12} md={4}>
                        <InfoCard
                            variant='gridItem'
                            >
                            <div  style={{height: '100%', display:'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                            <CardActions className={classes.infoCardHeader}>
                                {e.action(e.title, classes)}
                            </CardActions>
                            <CardContent className={classes.infoCardContent}>
                                <Divider />
                                <Typography>
                                    {e.contentBody}
                                </Typography>
                            </CardContent>
                            <CardContent className={classes.infoCardFooter}>
                                <Divider />
                                <Link to={e.linkUrl} className={classes.infoCardLink}>
                                    <Button size="small" className={classes.infoCardButton}>{e.buttonText}
                                        <ArrowForward className={classes.infoCardFooterIcon}/>
                                    </Button>
                                </Link>
                            </CardContent>
                            </div>
                        </InfoCard>
                        </Grid>
                    ))}
                    </Grid>
                </Grid>
                <Grid item xs={12} style={{padding: '0px'}}>
                    <BetaBannerCard {...bannerProps}/>
                </Grid>
                
            </Grid>
            </Content>
            <DVAFooter {...openFooterProps} />
        </Page>
    );
}