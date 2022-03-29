import React from 'react';
import { InfoCard } from '@backstage/core-components';
import { CardContent, Typography, Grid } from '@material-ui/core';
import SpeedIcon from '@material-ui/icons/Speed';

export const BetaBannerCard = (props: any) => {
    const { bannerStyles, bodyMainText, bodySubText } = props;
    return (
        <InfoCard noPadding className={bannerStyles}>
            <CardContent>
            <Grid container >
                <Grid item>
                    <SpeedIcon />
                </Grid>
                <Grid item>
                    <Typography gutterBottom variant="h5" component="div">
                        {bodyMainText}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        {...bodySubText}
                    </Typography>
                </Grid>
            </Grid>
            </CardContent>
        </InfoCard>
    );
}