
import React from 'react';
import { Grid, makeStyles, Typography } from '@material-ui/core';
import { HomePageDVALogo } from '.';

const useFooterStyles = makeStyles({
    container: {
        padding: '0px',
        bottom: '0px',
        zIndex: -100,
        position: 'fixed',
        margin: 'auto'
    },
    item: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export const DVAFooter = (props: any) => {
    const { container, item } = useFooterStyles();
    const { containerProps } = props;
    const containerStyles = [container, containerProps].join(" ");
    return (
        <Grid container className={containerStyles}>
            <Grid item className={item} xs={12}>
                <Typography>
                    The Office of Information and Technology is committed to digitally transforming the VA.
                </Typography>
                <HomePageDVALogo />
            </Grid>
        </Grid>
    );
};