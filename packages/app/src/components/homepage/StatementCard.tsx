import { InfoCard } from '@backstage/core-components';
import { Box, CardContent, Typography } from '@material-ui/core';
import React from 'react';
import { HomePageDVALogo } from './';

export const StatementCard = (props: any) => {
    const { cardStyles, title, bodyMainText, bodySubText } = props;
    return (
        <InfoCard
            title={title}
            className={cardStyles}
        >
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center'}}>
                    <HomePageDVALogo />
                <Box>
                    <Typography gutterBottom variant="h6" component="div">
                        {bodyMainText}
                    </Typography>
                    <Typography variant="body2" >
                        {bodySubText}
                    </Typography>
                </Box>
                </Box>
            </CardContent>
        </InfoCard>
    );
}