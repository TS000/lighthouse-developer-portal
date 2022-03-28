import { HomePageCompanyLogo } from '@backstage/plugin-home';
import React from 'react';
import { DVALogo } from './DVALogo';
import { makeStyles } from '@material-ui/core';

const useLogoStyles = makeStyles(theme => ({
    container: {
        margin: theme.spacing(0, 3),
    },
    svg: {
        width: 'auto',
        height: 100,
    },
    pathMain: {
        fillRule: 'evenodd',
        clipRule: 'evenodd',
        fill: theme.palette.primary.main
    },
    pathBackground: {
        fillRule: 'evenodd',
        clipRule: 'evenodd',
        fill: theme.palette.background.default
    }
}));

export const HomePageDVALogo = () => {
    const { container, svg, pathMain, pathBackground } = useLogoStyles();

    return (
        <HomePageCompanyLogo
            className={container}
            logo={<DVALogo classes={{ svg, pathMain, pathBackground }} />}
        />
    );
}