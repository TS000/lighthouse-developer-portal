import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import {
  providerDashboardPlugin,
  ProviderDashboardPage,
  docServerApiFactoryConfig,
} from '../src/plugin';

createDevApp()
  .registerPlugin(providerDashboardPlugin)
  .addPage({
    element: <ProviderDashboardPage />,
    title: 'Provider Dashboard',
    path: '/provider-dashboard',
  })
  .registerApi(docServerApiFactoryConfig)
  .render();
