import { InfoCard } from '@backstage/core-components';
import { Box, CardContent, CardMedia, Typography } from '@material-ui/core';
import React from 'react';

export const StatementCard = (props: any) => {
    const { cardStyles, title, bodyMainText, bodySubText } = props;
    return (
        <InfoCard
            title={title}
            className={cardStyles}
        >
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center'}}>
                    {/* This should probably be an SVG instead of an image*/}
                    <CardMedia
                    component="img"
                    height="140"
                    image="/static/images/some/path/to/image.jpg"
                    alt="Department of Veterans Affairs"
                    />
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