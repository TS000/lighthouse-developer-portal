import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export { useFeatureFlags } from './hooks';
export { FlagContext } from './components/FeatureFlagContext';

export const featureFlagsPagePlugin = createPlugin({
  id: 'feature-flags',
  routes: {
    root: rootRouteRef,
  },
});

export const FeatureFlagsPage = featureFlagsPagePlugin.provide(
  createRoutableExtension({
    component: () => import('./components').then(m => m.FeatureFlagsContainer),
    mountPoint: rootRouteRef,
  }),
);
