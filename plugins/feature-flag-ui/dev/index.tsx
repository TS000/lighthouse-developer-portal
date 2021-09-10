import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { featureFlagsPagePlugin, FeatureFlagsPage } from '../src/plugin';

createDevApp()
  .registerPlugin(featureFlagsPagePlugin)
  .addPage({
    element: <FeatureFlagsPage />,
    title: 'Root Page',
    path: '/feature-flags',
  })
  .render();
