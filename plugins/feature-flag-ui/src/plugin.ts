import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRoute } from './routes';

export { useFeatureFlags } from './hooks';
export { FlagContext } from './components/FeatureFlagContext';

export const featureFlagsPagePlugin = createPlugin({
  id: 'feature-flags',
  routes: {
    root: rootRoute,
  },
});

export const FeatureFlagsPage = featureFlagsPagePlugin.provide(
  createRoutableExtension({
    component: () => import('./components').then(m => m.FeatureFlagsContainer),
    mountPoint: rootRoute,
    name: 'feature-flags',
  }),
);
