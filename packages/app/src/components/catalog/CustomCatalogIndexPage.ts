
import { catalogPlugin } from '@backstage/plugin-catalog';
import { createRoutableExtension } from '@backstage/core-plugin-api';

export const CustomCatalogIndexPage = catalogPlugin.provide(
  createRoutableExtension({
    name: 'CustomCatalogIndexPage',
    component: () =>
      import('./CustomCatalogPage/CatalogPage').then(m => m.CatalogPage),
    mountPoint: catalogPlugin.routes.catalogIndex,
  }),
);