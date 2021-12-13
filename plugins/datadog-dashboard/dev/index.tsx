import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { datadogDashboardPlugin, DatadogDashboardPage } from '../src/plugin';

createDevApp()
  .registerPlugin(datadogDashboardPlugin)
  .addPage({
    element: <DatadogDashboardPage />,
    title: 'Root Page',
    path: '/datadog-dashboard'
  })
  .render();
