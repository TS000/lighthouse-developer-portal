import {
    Content,
    ContentHeader,
    Header,
    Page,
    SupportButton,
  } from '@backstage/core-components';
  import { configApiRef, useApi } from '@backstage/core-plugin-api';
  import { Grid } from '@material-ui/core';
  import React from 'react';
  import { CustomImportInfoCard } from '../CustomImportInfoCard';
  import { ImportStepper } from '@backstage/plugin-catalog-import';

  /**
   * A custom catalog import page.
   *
   * @public
   */
  export const CustomImportPage = () => {
    const configApi = useApi(configApiRef);
    const appTitle = configApi.getOptional('app.title') || 'Backstage';

    return (
      <Page themeId="home">
        <Header title="Register an existing component" />
        <Content>
          <ContentHeader title={`Start tracking your component in ${appTitle}`}>
            <SupportButton>
              Start tracking your component in {appTitle} by adding it to the
              software catalog.
            </SupportButton>
          </ContentHeader>

          <Grid container spacing={2} direction="row-reverse">
            <Grid item xs={12} md={4} lg={6} xl={8}>
              <CustomImportInfoCard />
            </Grid>

            <Grid item xs={12} md={8} lg={6} xl={4}>
              <ImportStepper />
            </Grid>
          </Grid>
        </Content>
      </Page>
    );
  };
