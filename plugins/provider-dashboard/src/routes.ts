import { createRouteRef, createSubRouteRef } from '@backstage/core-plugin-api';

export const rootRouteRef = createRouteRef({
  id: 'provider-dashboard',
});

export const apiRoutesRef = createSubRouteRef({
  id: 'provider-dashboard-route-params',
  parent: rootRouteRef,
  path: '/apis/:apiName',
});
