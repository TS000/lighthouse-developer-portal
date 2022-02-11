import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const contributingGuidePlugin = createPlugin({
  id: 'contributing-guide',
  routes: {
    root: rootRouteRef,
  },
});

export const ContributingGuidePage = contributingGuidePlugin.provide(
  createRoutableExtension({
    name: 'ContributingGuideComponent',
    component: () =>
      import('./components/ContributingGuideComponent').then(
        m => m.ContributingGuideComponent,
      ),
    mountPoint: rootRouteRef,
  }),
);
