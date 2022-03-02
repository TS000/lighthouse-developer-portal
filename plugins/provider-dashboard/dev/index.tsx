import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { providerDashboardPlugin, ProviderDashboardPage } from '../src/plugin';
import { ThemeProvider, CssBaseline } from '@material-ui/core';
import { lightThemeVA, darkThemeVA } from './themes/index';

createDevApp()
  .registerPlugin(providerDashboardPlugin)
  .addPage({
    element: <ProviderDashboardPage />,
    path: '/provider-dashboard',
  })
  .addThemes([
    {
      id: 'light-theme',
      title: 'Light Theme',
      variant: 'light',
      Provider: ({ children }) => (
        <ThemeProvider theme={lightThemeVA}>
          <CssBaseline>{children}</CssBaseline>
        </ThemeProvider>
      ),
    },
    {
      id: 'dark-theme',
      title: 'Dark Theme',
      variant: 'dark',
      Provider: ({ children }) => (
        <ThemeProvider theme={darkThemeVA}>
          <CssBaseline>{children}</CssBaseline>
        </ThemeProvider>
      ),
    },
  ])
  .render();
