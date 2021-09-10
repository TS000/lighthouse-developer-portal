# feature-flags

Welcome to the feature-flags plugin!

_This plugin was created through the Backstage CLI_

## Getting started

Your plugin has been added to the example app in this repository, meaning you'll be able to access it by running `yarn start` in the root directory, and then navigating to [/feature-flags](http://localhost:3000/feature-flags).

You can also serve the plugin in isolation by running `yarn start` in the plugin directory.
This method of serving the plugin provides quicker iteration speed and a faster startup and hot reloads.
It is only meant for local development, and the setup for it can be found inside the [/dev](./dev) directory.

This plugin uses the [featureFlagApi](FeatureFlagRegistry) provided by backstage.

## FeatureFlagsPage

`<FeatureFlagsPage />`

This is the Feature Flag Page component. It renders a list of all registered Feature Flags and allows the user the toggle them.
The component will show an example of how to register a new feature flag if none are found.

## useFeatureFlags

`const { featureFlags, isActive, state, registerFeatureFlag, toggleFlag } = useFeatureFlags()`

https://backstage.io/docs/reference/utility-apis/FeatureFlagsApi#featureflag

A React Hook used for interacting with the Feature Flag API. This hook should primarily be used within components that need to check if a feature flag is enabled/disabled.

The hook takes no params and returns an object.

| Attribute Name      | Type                    | Descriptions                                                                                                             |
| ------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| featureFlags        | Array<string, string>   | List of registered feature flags containing name and pluginId                                                            |
| registerFeatureFlag | Function                | Creates a new Feature Flag, params include name and pluginId                                                             |
| isActive            | Function                | Accepts a feature flag name and returns whether it is enabled/disabled                                                   |
| toggleFlag          | Function                | Accepts a feature flag name and Enables/Disables it.                                                                     |
| state               | Object<string, boolean> | An object containing current feature flags as attribute names and listing the enabled/disabled state as a boolean value. |

## Feature Flag Registry

This component should be created and listed at a high level of the app that's using this plugin.

This allows all necessary feature flags to be registered when the app loads. It's also a great way to keep track of all currently registerd feature flags.

This registry must be a component in order to interact with the react hook. Be sure to return `null` otherwise the component will throw an error.

For Example:

```jsx
// Within FeatureFlagRegistry.jsx
import { useFeatureFlags } from 'feature-flags-plugin';

export const FeatureFlagRegistry = () => {
  const { registerFeatureFlag } = useFeatureFlags();

  // Register My Feature
  registerFeatureFlag('my-feature', 'my-feature-id');

  return null;
};

// Within App.tsx
import { FeatureFlagRegistry } from './FeatureFlagRegistry';

export const App = () => {
  return (
    <div>
      <FeatureFlagRegistry />
      {...appContent}
    </div>
  );
};
```
