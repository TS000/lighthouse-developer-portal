import React, { useState, useEffect } from 'react';
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
import { initDatadogLogs } from './components/datadog';
import { searchPage } from './components/search/SearchPage';
import { FeatureFlagsPage, FlagContext } from '@internal/plugin-feature-flags';
import { FeatureFlagRegistry } from './FeatureFLagRegistry';
import { StarterGuidePage } from '@internal/plugin-starter-guide';
import { DatadogDashboardPage } from '@internal/plugin-datadog-dashboard';

import { lightThemeVA, darkThemeVA } from './themes/index';
import { ThemeProvider, CssBaseline } from '@material-ui/core';

import {
  AlertDisplay,
  OAuthRequestDialog,
  SignInProviderConfig,
  SignInPage,
} from '@backstage/core-components';
import { FlatRoutes } from '@backstage/core-app-api';
import { createApp } from '@backstage/app-defaults';
import { githubAuthApiRef } from '@backstage/core-plugin-api';

const githubProvider: SignInProviderConfig = {
  id: 'github-auth-provider',
  title: 'GitHub',
  message: 'Sign in using GitHub',
  apiRef: githubAuthApiRef,
};

initDatadogLogs();

const app = createApp({
  apis,
  components: {
    SignInPage: props => (
      <SignInPage {...props} auto providers={['guest', githubProvider]} />
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
      Provider: ({ children }) => (
        <ThemeProvider theme={lightThemeVA}>
          <CssBaseline>{children}</CssBaseline>
        </ThemeProvider>
      ),
    },
    {
      id: 'dark-theme',
      title: 'Dark Theme',
      variant: 'dark',
      Provider: ({ children }) => (
        <ThemeProvider theme={darkThemeVA}>
          <CssBaseline>{children}</CssBaseline>
        </ThemeProvider>
      ),
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
    <Route path="/datadog" element={<DatadogDashboardPage />} />
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
    <Route path="/starter-guide" element={<StarterGuidePage />} />
  </FlatRoutes>
);

const App = () => {
  const [flagState, setFlagState] = useState({});
  const currentFlags = ['datadog-dashboard', 'radar-dashboard'];
  useEffect(() => {
    const loadLocalStorage = async () => {
      const activeFlags = (await localStorage.getItem('featureFlags')) || '';
      if (activeFlags) {
        setFlagState(JSON.parse(activeFlags));
      }
    };
    loadLocalStorage();
  }, []);

  const toggleFlag = (flagName: string, flatState: boolean) => {
    setFlagState({
      ...flagState,
      [flagName]: flatState,
    });
  };
  const value = {
    flagState,
    toggleFlag,
    currentFlags,
  };
  return (
    <AppProvider>
      <FlagContext.Provider value={value}>
        <FeatureFlagRegistry />
        <AlertDisplay />
        <OAuthRequestDialog />
        <AppRouter>
          <Root>{routes}</Root>
        </AppRouter>
      </FlagContext.Provider>
    </AppProvider>
  );
};

export default App;
