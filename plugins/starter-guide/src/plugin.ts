import { createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const starterGuidePlugin = createPlugin({
  id: 'starter-guide',
  routes: {
    root: rootRouteRef,
  },
});

export const StarterGuidePage = starterGuidePlugin.provide(
  createRoutableExtension({
    name: 'StarterGuidePage',
    component: () =>
      import('./components/StarterGuideComponent').then(m => m.StarterGuideComponent),
    mountPoint: rootRouteRef,
  }),
);
