import { useState, useCallback } from 'react';
import {
  featureFlagsApiRef,
  FeatureFlagState,
  useApi,
  FeatureFlag,
} from '@backstage/core-plugin-api';

/**
 * React Hook for interacting with the Feature Flags API
 * @see https://backstage.io/docs/reference/utility-apis/FeatureFlagsApi
 *
 * @returns an object containing relevant values and functions
 * registerFeatureFlag - Registers a new feature flag
 * featureFlags - Array of current feature flags active and inactive
 * isActive - Function to check if a feature flag is active
 * toggleFlag - Function to enable/disable a feature flag
 * state - The current state containing feature flags and whether they are active or not.
 */
export const useFeatureFlags = () => {
  // Allows interaction with the feature flags API
  const featureFlagsApi = useApi(featureFlagsApiRef);

  const [featureFlags, setFeatureFlags] = useState(
    featureFlagsApi.getRegisteredFlags(),
  );

  /**
   * Formats feature flags into an easy to consume array containing the name and whether the feature flag is enabled/disabled
   *
   * @param newFeatureFlags - An array of current feature flags
   *
   * @returns an object containing features flags and whether they are enabled/disabled
   */
  const handleStateUpdate = (
    newFeatureFlags: Array<FeatureFlag>,
  ): Record<string, boolean> =>
    Object.fromEntries(
      newFeatureFlags.map(({ name }) => [name, featureFlagsApi.isActive(name)]),
    );

  const [state, setState] = useState<Record<string, boolean>>(
    handleStateUpdate(featureFlags),
  );

  /**
   * Toggles the feature flag state from enabled/disabled.
   * Then updates the current state.
   *
   * @param flagName - The existing feature flag name to toggle
   */
  const toggleFlag = useCallback(
    (flagName: string): void => {
      const newState = featureFlagsApi.isActive(flagName)
        ? FeatureFlagState.None
        : FeatureFlagState.Active;

      featureFlagsApi.save({
        states: { [flagName]: newState },
        merge: true,
      });

      setState(prevState => ({
        ...prevState,
        [flagName]: newState === FeatureFlagState.Active,
      }));
    },
    [featureFlagsApi],
  );

  /**
   * Registers a new feature flag with the Feature Flag API and updates the featureFlags state.
   * Registration only occurs when the name doesn't already match a feature flag within state.
   *
   * @see https://backstage.io/docs/reference/utility-apis/FeatureFlagsApi
   *
   * @param name - The name of the feature flag
   * @param id - The ID of the feature flag
   */
  const registerFeatureFlag = (name: string, id: string): void => {
    if (state[name] === undefined) {
      featureFlagsApi.registerFlag({ name: name, pluginId: id });

      const updatedFeatureFlags = featureFlagsApi.getRegisteredFlags();
      const updatedState = handleStateUpdate(updatedFeatureFlags);

      setState(updatedState);
      setFeatureFlags(updatedFeatureFlags);
    }
  };

  /**
   * Checks if the passed flagName is active or not
   *
   * @param flagName - The feature flag name
   *
   * @returns whether the feature flag is enabled/disabled
   */
  const handleIsActive = (flagName: string): boolean =>
    featureFlagsApi.isActive(flagName);

  return {
    registerFeatureFlag,
    featureFlags,
    isActive: handleIsActive,
    toggleFlag,
    state,
  };
};
