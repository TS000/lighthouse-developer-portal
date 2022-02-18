/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useContext, PropsWithChildren } from 'react';
import { Link, makeStyles } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import ExtensionIcon from '@material-ui/icons/Extension';
import ListIcon from '@material-ui/icons/List';
import PersonIcon from '@material-ui/icons/Person';
import GroupIcon from '@material-ui/icons/Group';
import WebIcon from '@material-ui/icons/Web';
import BarChartIcon from '@material-ui/icons/BarChart';
import GrainIcon from '@material-ui/icons/Grain';
import MapIcon from '@material-ui/icons/MyLocation';
import LibraryBooks from '@material-ui/icons/LibraryBooks';
import CreateComponentIcon from '@material-ui/icons/AddCircleOutline';
import Flag from '@material-ui/icons/Flag';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import AppsIcon from '@material-ui/icons/Apps';
import LayersIcon from '@material-ui/icons/Layers';
import LogoFull from './LogoFull';
import LogoIcon from './LogoIcon';
import { NavLink } from 'react-router-dom';
import { Settings as SidebarSettings } from '@backstage/plugin-user-settings';
import {
  SidebarSearchModal,
  SearchContextProvider,
} from '@backstage/plugin-search';
import {
  Sidebar,
  SidebarPage,
  sidebarConfig,
  SidebarContext,
  SidebarItem,
  SidebarDivider,
  SidebarSpace,
  SidebarSubmenuItem,
  SidebarSubmenu,
} from '@backstage/core-components';
import {
  EntityKindFilter,
  useEntityListProvider,
} from '@backstage/plugin-catalog-react';
import { HideableSidebarItem } from '../hideableSidebarItem/HideableSitebarItem';
import { VersionAndEnv } from '../versionAndEnv/VersionAndEnv';
import { FeedbackModal } from '../feedback';
import { IconComponent } from '@backstage/core-plugin-api';

const useSidebarLogoStyles = makeStyles({
  root: {
    width: sidebarConfig.drawerWidthClosed,
    height: 3 * sidebarConfig.logoHeight,
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    marginBottom: -14,
  },
  link: {
    width: sidebarConfig.drawerWidthClosed,
    marginLeft: 24,
  },
  hideItem: {
    display: 'none',
  },
  showItem: {
    display: 'flex',
  },
});

const SidebarLogo = () => {
  const classes = useSidebarLogoStyles();
  const { isOpen } = useContext(SidebarContext);

  return (
    <div className={classes.root}>
      <Link
        component={NavLink}
        to="/"
        underline="none"
        className={classes.link}
      >
        {isOpen ? <LogoFull /> : <LogoIcon />}
      </Link>
    </div>
  );
};

interface CatalogKindIcon {
  [key: string]: IconComponent;
}

const catalogKindIcon: CatalogKindIcon = {
  Component: AppsIcon,
  API: ExtensionIcon,
  Group: GroupIcon,
  User: PersonIcon,
  System: GrainIcon,
  Domain: WebIcon,
};

export const Root = ({ children }: PropsWithChildren<{}>) => {
  const { updateFilters } = useEntityListProvider();
  const handleFilterChange = (selectedKind: string): void => {
    updateFilters({
      kind: selectedKind ? new EntityKindFilter(selectedKind) : undefined,
    });
  };

  return (
    <SidebarPage>
      <Sidebar>
        <SidebarLogo />
        <SearchContextProvider>
          <SidebarSearchModal />
        </SearchContextProvider>
        <SidebarDivider />
        {/* Global nav, not org-specific */}
        <SidebarItem icon={HomeIcon} to="/" text="Home" />
        <SidebarItem icon={ListIcon} to="/catalog" text="Catalog">
          <SidebarSubmenu title="Catalog">
            {['Component', 'API', 'Group', 'User', 'System', 'Domain'].map(
              kind => (
                <div
                  aria-hidden
                  style={{ width: '100%' }}
                  onClick={() => {
                    handleFilterChange(kind.toLowerCase());

                    // Unfocus the sidebar
                    if (document.activeElement) {
                      (document.activeElement as HTMLElement).blur();
                    }
                  }}
                >
                  <SidebarSubmenuItem
                    title={`${kind}s`}
                    to={`catalog?filters[kind]=${kind.toLowerCase()}`}
                    icon={catalogKindIcon[kind] || AppsIcon}
                  />
                </div>
              ),
            )}
          </SidebarSubmenu>
        </SidebarItem>
        <SidebarItem icon={LibraryBooks} to="docs" text="Docs" />
        <HideableSidebarItem
          flagName="datadog-dashboard"
          to="datadog"
          text="Datadog"
          icon={BarChartIcon}
        />
        <SidebarItem
          icon={CreateComponentIcon}
          to="catalog-import"
          text="Register New"
        />
        <SidebarItem icon={Flag} to="/feature-flags" text="Feature Flags" />
        {/* End global nav */}
        <SidebarDivider />
        <HideableSidebarItem
          flagName="radar-dashboard"
          to="tech-radar"
          text="Tech Radar"
          icon={MapIcon}
        />
        <SidebarItem
          icon={MenuBookIcon}
          to="/starter-guide"
          text="Starter Guide"
        />
        <SidebarItem icon={LayersIcon} to="plugins" text="Plugins" />
        <SidebarSpace />
        <SidebarSettings />
        <FeedbackModal />
        <SidebarDivider />
        <VersionAndEnv />
      </Sidebar>
      {children}
    </SidebarPage>
  );
};
