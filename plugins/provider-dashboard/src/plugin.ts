import {
  createPlugin,
  createApiFactory,
  createRoutableExtension,
  discoveryApiRef,
} from '@backstage/core-plugin-api';
import { docServerApiRef, DocServerApiClient } from './docServerApis';

import { rootRouteRef } from './routes';

export const docServerApiFactoryConfig = createApiFactory({
  api: docServerApiRef,
  deps: { discoveryApi: discoveryApiRef },
  factory: ({ discoveryApi }) => new DocServerApiClient({ discoveryApi }),
});

export const providerDashboardPlugin = createPlugin({
  id: 'provider-dashboard',
  routes: {
    root: rootRouteRef,
  },
  apis: [docServerApiFactoryConfig],
});

export const ProviderDashboardPage = providerDashboardPlugin.provide(
  createRoutableExtension({
    name: 'ProviderDashboardPage',
    component: () =>
      import('./components/BodyComponent').then(m => m.BodyComponent),
    mountPoint: rootRouteRef,
  }),
);
