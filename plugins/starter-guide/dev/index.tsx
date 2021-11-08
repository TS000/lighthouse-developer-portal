import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { starterGuidePlugin, StarterGuidePage } from '../src/plugin';

createDevApp()
  .registerPlugin(starterGuidePlugin)
  .addPage({
    element: <StarterGuidePage />,
    title: 'Root Page',
    path: '/starter-guide'
  })
  .render();
