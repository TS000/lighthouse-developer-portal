import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const providerDashboardPlugin = createPlugin({
  id: 'provider-dashboard',
  routes: {
    root: rootRouteRef,
  },
});

export const ProviderDashboardPage = providerDashboardPlugin.provide(
  createRoutableExtension({
    name: 'ProviderDashboardPage',
    component: () =>
      import('./components/BodyComponent').then(m => m.BodyComponent),
    mountPoint: rootRouteRef,
  }),
);
