import React from 'react';
import { List, Grid } from '@material-ui/core';
import { InfoCard, Header, Page, Content } from '@backstage/core-components';
import { FlagItem } from './FeatureFlagsItem';
import { EmptyFlags } from './EmptyFlags';
import { useFeatureFlags } from '../hooks';

/**
 * Contains the FeatureFlag Page for managing feature flags
 */
export const FeatureFlagsContainer = () => {
  const { featureFlags, isActive, toggleFlag } = useFeatureFlags();

  return (
    <Page themeId="tool">
      <Header
        title="Feature Flags"
        subtitle="A place to view and manage all registered Feature Flags for Embark."
      />
      <Content>
        <Grid container spacing={3} direction="column">
          <Grid item>
            <InfoCard>
              <List dense>
                {featureFlags.length ? (
                  featureFlags.map(featureFlag => (
                    <FlagItem
                      key={featureFlag.name}
                      flag={featureFlag}
                      enabled={isActive(featureFlag.name)}
                      toggleHandler={toggleFlag}
                    />
                  ))
                ) : (
                  <EmptyFlags />
                )}
              </List>
            </InfoCard>
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
