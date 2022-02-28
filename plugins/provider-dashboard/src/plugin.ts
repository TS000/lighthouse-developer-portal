import {
  // createPlugin,
  // createRoutableExtension,
    createPlugin,
    // createRouteRef,
    createApiFactory,
    createRoutableExtension,
    // createComponentExtension,
    discoveryApiRef,
} from '@backstage/core-plugin-api';
import { docServerApiRef, docServerApiClient } from './docServerApis';

import { rootRouteRef } from './routes';

export const providerDashboardPlugin = createPlugin({
  id: 'provider-dashboard',
  routes: {
    root: rootRouteRef,
  },
});

export const myCustomPlugin = createPlugin({
    id: 'plugin.docserver-api.service',

    // Configure a factory for myAwesomeApiRef
    apis: [
        createApiFactory({
            api: docServerApiRef,
            deps: { discoveryApi: discoveryApiRef },
            factory: ({ discoveryApi }) => new docServerApiClient({ discoveryApi }),
        }),
    ],
});

export const ProviderDashboardPage = providerDashboardPlugin.provide(
  createRoutableExtension({
    name: 'ProviderDashboardPage',
    component: () =>
      import('./components/BodyComponent').then(m => m.BodyComponent),
    mountPoint: rootRouteRef,
  }),
);
