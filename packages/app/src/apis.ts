import {
  ScmIntegrationsApi,
  scmIntegrationsApiRef,
  ScmAuth,
} from '@backstage/integration-react';
import {
  AnyApiFactory,
  configApiRef,
  createApiFactory,
  analyticsApiRef,
  githubAuthApiRef,
  discoveryApiRef,
  oauthRequestApiRef,
} from '@backstage/core-plugin-api';
import { GoogleAnalytics } from '@backstage/plugin-analytics-module-ga';
import { GithubAuth } from '@backstage/core-app-api';

export const apis: AnyApiFactory[] = [
  createApiFactory({
    api: scmIntegrationsApiRef,
    deps: { configApi: configApiRef },
    factory: ({ configApi }) => ScmIntegrationsApi.fromConfig(configApi),
  }),
  // Instantiate and register the GA Analytics API Implementation.
  createApiFactory({
    api: analyticsApiRef,
    deps: { configApi: configApiRef },
    factory: ({ configApi }) => GoogleAnalytics.fromConfig(configApi),
  }),
  ScmAuth.createDefaultApiFactory(),
  createApiFactory({
    api: githubAuthApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      oauthRequestApi: oauthRequestApiRef,
    },
    factory: ({ discoveryApi, oauthRequestApi }) =>
      GithubAuth.create({
        discoveryApi,
        oauthRequestApi,
        defaultScopes: ['read:user', 'repo'],
      }),
  }),
];
