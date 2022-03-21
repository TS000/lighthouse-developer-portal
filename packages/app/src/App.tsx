import React, { useState, useEffect } from 'react';
import { hot } from 'react-hot-loader/root';
import { Route } from 'react-router';
import { apiDocsPlugin, ApiExplorerPage } from '@backstage/plugin-api-docs';
import { CatalogEntityPage, catalogPlugin } from '@backstage/plugin-catalog';
import { catalogImportPlugin } from '@backstage/plugin-catalog-import';
import { ScaffolderPage, scaffolderPlugin } from '@backstage/plugin-scaffolder';
import { SearchPage, SearchContextProvider } from '@backstage/plugin-search';
import { TechRadarPage } from '@backstage/plugin-tech-radar';
import {
  TechDocsReaderPage,
  TechDocsIndexPage,
  DefaultTechDocsHome,
  techdocsPlugin,
} from '@backstage/plugin-techdocs';
import { techDocsPage } from './components/techdocs';
import { UserSettingsPage } from '@backstage/plugin-user-settings';
import { apis } from './apis';
import { entityPage } from './components/catalog/EntityPage';
import { Root } from './components/Root';
import { initDatadogLogs } from './components/datadog';
import { searchPage } from './components/search/SearchPage';
import { FeatureFlagsPage, FlagContext } from '@internal/plugin-feature-flags';
import { FeatureFlagRegistry } from './FeatureFlagRegistry';
import { StarterGuide } from './components/starterGuide';
import { ContributingGuide } from './components/contributing';
import { EntityListProvider } from '@backstage/plugin-catalog-react';
import { ExplorePage, explorePlugin } from '@backstage/plugin-explore';
import { ExplorePage as CustomExplorePage } from './components/explore';
import { lightThemeVA, darkThemeVA } from './themes/index';
import { ThemeProvider, CssBaseline } from '@material-ui/core';
import {
  AlertDisplay,
  OAuthRequestDialog,
  SignInProviderConfig,
} from '@backstage/core-components';
import { orgPlugin } from '@backstage/plugin-org';
import { FlatRoutes } from '@backstage/core-app-api';
import { createApp } from '@backstage/app-defaults';
import { githubAuthApiRef, IconComponent } from '@backstage/core-plugin-api';
import './themes/overrides.css';
import { ProviderDashboardPage } from '@internal/plugin-provider-dashboard';
import { CustomCatalogImportPage } from './components/catalogImportPage';
import { CustomCatalogIndexPage } from './components/catalog';
import { PermissionedRoute } from '@backstage/plugin-permission-react';
import { viewExplorePagePermission } from './utils/';
import { Banner } from './components/banner';
import SlackIcon from './icons/Slack';
import { CustomSignInPage } from './components/signinPage'
import { HomePage } from './components/homepage/HomePage';

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
     <CustomSignInPage {...props} providers={['guest', githubProvider]} />
    ),
  },
  bindRoutes({ bind }) {
    bind(catalogPlugin.externalRoutes, {
      createComponent: scaffolderPlugin.routes.root,
      viewTechDoc: techdocsPlugin.routes.docRoot,
    });
    bind(apiDocsPlugin.externalRoutes, {
      registerApi: catalogImportPlugin.routes.importPage,
    });
    bind(scaffolderPlugin.externalRoutes, {
      registerComponent: catalogImportPlugin.routes.importPage,
    });
    bind(orgPlugin.externalRoutes, {
      catalogIndex: catalogPlugin.routes.catalogIndex,
    });
    bind(explorePlugin.externalRoutes, {
      catalogEntity: catalogPlugin.routes.catalogEntity,
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
  icons: {
    slack: SlackIcon as IconComponent,
  },
});

const AppProvider = app.getProvider();
const AppRouter = app.getRouter();

const routes = (
  <FlatRoutes>

    <Route path="/" element={<HomePage />} />
    <Route path="/search" element={<SearchPage />}>
      {searchPage}
    </Route>
    <Route path="/catalog" element={<CustomCatalogIndexPage />} />
    <Route
      path="/catalog/:namespace/:kind/:name"
      element={<CatalogEntityPage />}
    >
      {entityPage}
    </Route>
    <Route path="/docs" element={<TechDocsIndexPage />}>
      <DefaultTechDocsHome />
    </Route>
    <Route
      path="/docs/:namespace/:kind/:name/*"
      element={<TechDocsReaderPage />}
    >
      {techDocsPage}
    </Route>
    <Route path="/create" element={<ScaffolderPage />} />
    <Route path="/api-docs" element={<ApiExplorerPage />} />
    <Route
      path="/tech-radar"
      element={<TechRadarPage width={1500} height={800} />}
    />
    <Route path="/catalog-import" element={<CustomCatalogImportPage />} />
    <Route path="/search" element={<SearchPage />} />
    <Route path="/settings" element={<UserSettingsPage />} />
    <Route path="/feature-flags" element={<FeatureFlagsPage />} />
    <Route path="/starter-guide" element={<StarterGuide />} />
    <Route path="/contributing-guide" element={<ContributingGuide />} />
    <Route path="/provider-dashboard" element={<ProviderDashboardPage />} />
    <PermissionedRoute
      path="/plugins"
      permission={viewExplorePagePermission}
      element={<ExplorePage />}
    >
      <CustomExplorePage />
    </PermissionedRoute>
  </FlatRoutes>
);

const App = () => {
  const [flagState, setFlagState] = useState({});
  const currentFlags = ['radar-dashboard'];
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
        <Banner />
        <AppRouter>
          <SearchContextProvider>
            <EntityListProvider>
              <Root>{routes}</Root>
            </EntityListProvider>
          </SearchContextProvider>
        </AppRouter>
      </FlagContext.Provider>
    </AppProvider>
  );
};

export default hot(App);
