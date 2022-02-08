import { Permission } from '@backstage/plugin-permission-common';

export const RESOURCE_TYPE_EXPLORE_PAGE = 'explore';
/**
 * This permission is used to authorize actions that involve accessing the explore page.
 *
 * If this permission is not authorized, it will appear that the explore page cannot be found.
 * @public
 */
export const viewExplorePagePermission: Permission = {
  name: 'explore.page.view',
  attributes: {
    action: 'read',
  },
};
