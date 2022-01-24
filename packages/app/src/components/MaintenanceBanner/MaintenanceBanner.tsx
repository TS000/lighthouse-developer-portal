import React from 'react';
import { DismissableBanner } from '@backstage/core-components';
import { useFeatureFlags } from '@internal/plugin-feature-flags';

const containerStyle = {
    width: '60%',
    gridArea: 'pageSubheader',
    margin: '10px auto',
};

// variant: error, info,
export const MaintenanceBanner = () => {
    const { isActive } = useFeatureFlags();

    return (
        <>{
        isActive('show-banner') && 
            <div style={containerStyle}>
                <DismissableBanner
                    message="This is a dismissable banner"
                    variant="info"
                    id="default_dismissable"
                />
            </div>
        }</>
    )
};