import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { contributingGuidePlugin, ContributingGuidePage } from '../src/plugin';

createDevApp()
  .registerPlugin(contributingGuidePlugin)
  .addPage({
    element: <ContributingGuidePage />,
    title: 'Root Page',
    path: '/contributing-guide'
  })
  .render();
