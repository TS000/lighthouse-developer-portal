import React from 'react';
import SearchIcon from '@material-ui/icons/Search';
import { SidebarItem } from '@backstage/core-components';
import { IconComponent } from '@backstage/core-plugin-api';
import { SearchModal } from './SearchModal';
import { useSearch } from '@backstage/plugin-search';

export type SidebarSearchModalProps = {
  icon?: IconComponent;
};

export const SidebarSearchModal = (props: SidebarSearchModalProps) => {
  const { open, toggleModal } = useSearch();
  const Icon = props.icon ? props.icon : SearchIcon;

  return (
    <>
      <SidebarItem
        className="search-icon"
        icon={Icon}
        text="Search"
        onClick={toggleModal}
      />
      <SearchModal open={open} toggleModal={toggleModal} />
    </>
  );
};
