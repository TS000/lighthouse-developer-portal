import { useFeatureFlags } from '@internal/plugin-feature-flags';

/**
 * This component should be used to register all feature flags used within the app.
 *
 * To add a new feature flag simply call the registerFeatureFlag function with the feature name and id
 *
 * *Note:* The useFeatureFlags hook needs to be uncommented when registering your first hook.
 *
 * @example
 * ```
 * registerFeatureFlag('test-feature', 'test-feature-id')
 * ```
 *
 * New feature flags can also be registered when creating a new plugin.
 * @see https://backstage.io/docs/reference/createPlugin-feature-flags
 *
 * @returns Nothing, we have to use a component in order to use the useFeatureFlags hook.
 */
export const FeatureFlagRegistry = () => {
  const { registerFeatureFlag } = useFeatureFlags();

  // Decides whether to show extra info on the home page
  registerFeatureFlag('starter-guide', 'starter-guide-id');
  registerFeatureFlag('radar-dashboard', 'radar-dashboard-id');

  return null;
};
