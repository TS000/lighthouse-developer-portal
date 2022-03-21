import { HomePageCompanyLogo } from '@backstage/plugin-home';
import React from 'react';
import { TemplateBackstageLogo } from './CompanyLogo';


export const HomePageLogo = (props: any) => {
    const { container, svg, path } = props;
    return (
        <HomePageCompanyLogo
            className={container}
            logo={<TemplateBackstageLogo classes={{ svg, path }} />}
        />
    );
}
