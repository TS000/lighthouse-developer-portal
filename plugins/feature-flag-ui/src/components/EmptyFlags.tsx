import React from 'react';
import { Button, Typography } from '@material-ui/core';
import { CodeSnippet, EmptyState } from '@backstage/core-components';

// Code example of using the FeatureFlagRegistry
const EXAMPLE = `import { useFeatureFlags } from '@this/package';

export const FeatureFlagRegistry = () => {
  const { registerFeatureFlag } = useFeatureFlags();

  // Decides whether to show extra info on the home page
  registerFeatureFlag('home-feature', 'home-feature-id');

  return null;
};
`;

/**
 * Displays helpful hints when there are no registered feature flags
 */
export const EmptyFlags = () => (
  <EmptyState
    missing="content"
    title="No Feature Flags"
    description="Feature Flags make it possible for plugins to register features in Backstage for users to opt into. You can use this to split out logic in your code for manual A/B testing, etc."
    action={
      <>
        <Typography variant="body1">
          An example for how to add a feature flag is highlighted below:
        </Typography>
        <CodeSnippet
          text={EXAMPLE}
          language="typescript"
          showLineNumbers
          highlightedNumbers={[7]}
          customStyle={{ background: 'inherit', fontSize: '115%' }}
        />
        <Button
          variant="contained"
          color="primary"
          href="https://backstage.io/docs/api/utility-apis"
        >
          Read More
        </Button>
      </>
    }
  />
);
