import React, { useState } from 'react';
import { Route } from 'react-router';
import { apiDocsPlugin, ApiExplorerPage } from '@backstage/plugin-api-docs';
import {
  CatalogEntityPage,
  CatalogIndexPage,
  catalogPlugin,
} from '@backstage/plugin-catalog';
import {
  CatalogImportPage,
  catalogImportPlugin,
} from '@backstage/plugin-catalog-import';
import { ScaffolderPage, scaffolderPlugin } from '@backstage/plugin-scaffolder';
import { SearchPage } from '@backstage/plugin-search';
import { TechRadarPage } from '@backstage/plugin-tech-radar';
import {
  DefaultTechDocsHome,
  TechDocsIndexPage,
  TechDocsReaderPage,
  techdocsPlugin,
} from '@backstage/plugin-techdocs';
import { UserSettingsPage } from '@backstage/plugin-user-settings';
import { apis } from './apis';
import { entityPage } from './components/catalog/EntityPage';
import { Root } from './components/Root';
import { HomePage } from './components/homepage';
import { Datadog } from './components/datadog/Datadog';
import { searchPage } from './components/search/SearchPage';
import { lightThemeVA, darkThemeVA } from './themes/index';
import { FeatureFlagsPage, FlagContext } from '@internal/plugin-feature-flags';
import { FeatureFlagRegistry } from './FeatureFLagRegistry';
import { StarterGuidePage } from '@internal/plugin-starter-guide';

import { AlertDisplay, OAuthRequestDialog, SignInProviderConfig, SignInPage } from '@backstage/core-components';
import { createApp, FlatRoutes } from '@backstage/core-app-api';
import { githubAuthApiRef } from '@backstage/core-plugin-api';

const githubProvider: SignInProviderConfig = {
  id: 'github-auth-provider',
  title: 'GitHub',
  message: 'Sign in using GitHub',
  apiRef: githubAuthApiRef,
};

const app = createApp({
  apis,
  components: {
    SignInPage: props => (
      <SignInPage {...props} auto providers={[githubProvider]} />
    ),
  },
  bindRoutes({ bind }) {
    bind(catalogPlugin.externalRoutes, {
      createComponent: scaffolderPlugin.routes.root,
      viewTechDoc: techdocsPlugin.routes.docRoot,
    });
    bind(apiDocsPlugin.externalRoutes, {
      createComponent: scaffolderPlugin.routes.root,
    });
    bind(scaffolderPlugin.externalRoutes, {
      registerComponent: catalogImportPlugin.routes.importPage,
    });
  },
  themes: [
    {
      id: 'light-theme',
      title: 'Light Theme',
      variant: 'light',
      theme: lightThemeVA,
    },
    {
      id: 'dark-theme',
      title: 'Dark Theme',
      variant: 'dark',
      theme: darkThemeVA,
    },
  ],
});

const AppProvider = app.getProvider();
const AppRouter = app.getRouter();

const routes = (
  <FlatRoutes>
    <Route path="/" element={<HomePage />} />
    <Route path="/search" element={<SearchPage />}>
      {searchPage}
    </Route>
    <Route path="/catalog" element={<CatalogIndexPage />} />
    <Route
      path="/catalog/:namespace/:kind/:name"
      element={<CatalogEntityPage />}
    >
      {entityPage}
    </Route>
    <Route path="/docs" element={<TechDocsIndexPage />}>
      <DefaultTechDocsHome />
    </Route>
    <Route path="/datadog" element={<Datadog />} />
    <Route
      path="/docs/:namespace/:kind/:name/*"
      element={<TechDocsReaderPage />}
    />
    <Route path="/create" element={<ScaffolderPage />} />
    <Route path="/api-docs" element={<ApiExplorerPage />} />
    <Route
      path="/tech-radar"
      element={<TechRadarPage width={1500} height={800} />}
    />
    <Route path="/catalog-import" element={<CatalogImportPage />} />
    <Route path="/search" element={<SearchPage />} />
    <Route path="/settings" element={<UserSettingsPage />} />
    <Route path="/feature-flags" element={<FeatureFlagsPage />} />
    <Route path="/starter-guide" element={<StarterGuidePage />}/>
  </FlatRoutes>
);

const App = () => { 
  const [ flagState, setFlagState ] = useState(false);

  return (
    <AppProvider>
      <FlagContext.Provider value={{ flagState, setFlagState }}>
        <FeatureFlagRegistry />
        <AlertDisplay />
        <OAuthRequestDialog />
        <AppRouter>
          <Root>{routes}</Root>
        </AppRouter>
      </FlagContext.Provider>
    </AppProvider>
  );
}

export default App;
