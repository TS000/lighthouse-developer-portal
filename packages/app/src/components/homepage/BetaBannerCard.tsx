import React from 'react';
import { InfoCard } from '@backstage/core-components';
import { CardContent, Typography } from '@material-ui/core';

export const BetaBannerCard = (props: any) => {
    const { bannerStyles, bodyMainText, bodySubText } = props;
    return (
        <InfoCard className={bannerStyles}>
            <CardContent>
            <Typography gutterBottom variant="h5" component="div">
                {bodyMainText}
            </Typography>
            <Typography variant="body2" color="textSecondary">
                {...bodySubText}
            </Typography>
            </CardContent>
        </InfoCard>
    );
}