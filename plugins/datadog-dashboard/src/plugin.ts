import { createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';

import { rootRoute } from './routes';

export const datadogDashboardPlugin = createPlugin({
  id: 'datadog-dashboard',
  routes: {
    root: rootRoute,
  },
});

export const DatadogDashboardPage = datadogDashboardPlugin.provide(
  createRoutableExtension({
    name: 'DatadogDashboardPage',
    component: () =>
      import('./components/DatadogDashboard').then(m => m.DatadogDashboard),
    mountPoint: rootRoute,
  }),
);
