
import { createRoutableExtension } from '@backstage/core-plugin-api';
import { catalogImportPlugin } from '@backstage/plugin-catalog-import';

export const CustomCatalogImportPage = catalogImportPlugin.provide(
  createRoutableExtension({
    name: 'CustomCatalogImportPage',
    component: () => import('./CustomCatalogImportPage/ImportPage').then(m => m.ImportPage),
    mountPoint: catalogImportPlugin.routes.importPage,
  }),
);