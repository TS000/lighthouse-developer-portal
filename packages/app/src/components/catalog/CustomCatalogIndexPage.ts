
import { catalogPlugin } from '@backstage/plugin-catalog'
import { catalogRouteRef } from '@backstage/plugin-catalog-react';
import { createRoutableExtension } from '@backstage/core-plugin-api';

export const CustomCatalogIndexPage = catalogPlugin.provide(
    createRoutableExtension({
      name: 'CustomCatalogIndexPage',
      component: () =>
        import('./CustomCatalogPage/CatalogPage').then(m => m.CatalogPage),
      mountPoint: catalogRouteRef,
    }),
  );