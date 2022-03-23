import {
  ScmIntegrationsApi,
  scmIntegrationsApiRef,
  ScmAuth,
} from '@backstage/integration-react';
import {
  AnyApiFactory,
  configApiRef,
  createApiFactory,
  githubAuthApiRef,
  discoveryApiRef,
  oauthRequestApiRef,
  storageApiRef,
} from '@backstage/core-plugin-api';
import { GithubAuth } from '@backstage/core-app-api';
import { exploreToolsConfigRef } from '@backstage/plugin-explore-react';
import { shortcutsApiRef, LocalStoredShortcuts } from '@backstage/plugin-shortcuts'
import { pluginManifest } from './pluginManifest';

export const apis: AnyApiFactory[] = [
  createApiFactory({
    api: scmIntegrationsApiRef,
    deps: { configApi: configApiRef },
    factory: ({ configApi }) => ScmIntegrationsApi.fromConfig(configApi),
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
  // Overwrite the explore plugin to remove defaults
  createApiFactory({
    api: exploreToolsConfigRef,
    deps: {},
    factory: () => ({
      async getTools() {
        return pluginManifest;
      },
    }),
  }),
  // Adds shortcuts plugin
  createApiFactory({
    api: shortcutsApiRef,
    deps: { storageApi: storageApiRef},
    factory: ({ storageApi }) => new LocalStoredShortcuts(storageApi.forBucket('shortcuts'))
  })
];
