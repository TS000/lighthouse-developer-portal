import React, { useContext } from 'react';
import ExtensionIcon from '@material-ui/icons/Extension';
import PersonIcon from '@material-ui/icons/Person';
import GroupIcon from '@material-ui/icons/Group';
import WebIcon from '@material-ui/icons/Web';
import GrainIcon from '@material-ui/icons/Grain';
import AppsIcon from '@material-ui/icons/Apps';
import { SidebarSubmenuItem } from '@backstage/core-components';
import {
  EntityKindFilter,
  useEntityList,
} from '@backstage/plugin-catalog-react';
import { IconComponent } from '@backstage/core-plugin-api';
import { SidebarItemWithSubmenuContext } from './config';

const catalogKindIcon: CatalogKindIcon = {
  Component: AppsIcon,
  API: ExtensionIcon,
  Group: GroupIcon,
  User: PersonIcon,
  System: GrainIcon,
  Domain: WebIcon,
};

interface CatalogKindIcon {
  [key: string]: IconComponent;
}

export const SidebarKinds = () => {
  const { isClickedOn, setIsClickedOn } = useContext(
    SidebarItemWithSubmenuContext,
  );
  const { updateFilters } = useEntityList();
  const handleFilterChange = (selectedKind: string): void => {
    updateFilters({
      kind: selectedKind ? new EntityKindFilter(selectedKind) : undefined,
    });
  };
  return (
    <>
      {['Component', 'API', 'Group', 'User', 'System', 'Domain'].map(kind => (
        <div
          aria-hidden
          key={kind}
          style={{ width: '100%' }}
          onClick={() => {
            handleFilterChange(kind.toLowerCase());

            // Unfocus the sidebar
            if (document.activeElement) {
              (document.activeElement as HTMLElement).blur();
            }

            // Set isClickedOn to false
            if (isClickedOn) {
              setIsClickedOn(false);
            }
          }}
        >
          <SidebarSubmenuItem
            title={`${kind}s`}
            to={`catalog?filters[kind]=${kind.toLowerCase()}`}
            icon={catalogKindIcon[kind] || AppsIcon}
          />
        </div>
      ))}
    </>
  );
};
