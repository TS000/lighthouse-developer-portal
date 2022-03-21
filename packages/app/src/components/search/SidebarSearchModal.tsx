import React, { useState } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import { SidebarItem } from '@backstage/core-components';
import { IconComponent } from '@backstage/core-plugin-api';
import { SearchModal } from './SearchModal';

export type SidebarSearchModalProps = {
  icon?: IconComponent;
};

export const SidebarSearchModal = (props: SidebarSearchModalProps) => {
  const [open, setOpen] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const Icon = props.icon ? props.icon : SearchIcon;

  // This handles a situation where submitting a search query propagates up to the sidebarItem.
  // Which causes the modal to stay open when it should be closed.
  const handleToggleModal = (type?: string) => {
    if (type === 'submit') {
      setHasSubmitted(true);
    }
    setOpen(!open);
  };

  return (
    <>
      <SidebarItem
        className="search-icon"
        icon={Icon}
        text="Search"
        onClick={() => {
          // Prevents the modal from reopening from event propagation.
          if (hasSubmitted) {
            setHasSubmitted(false);
          } else {
            setOpen(!open);
          }
        }}
      />
      <SearchModal open={open} toggleModal={handleToggleModal} />
    </>
  );
};
