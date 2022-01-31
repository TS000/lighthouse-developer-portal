/*
 * Copyright 2021 The Backstage Authors
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
import React, { useContext } from 'react';
import { NavLink, useLocation, useResolvedPath } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { IconComponent } from '@backstage/core-plugin-api';
import classnames from 'classnames';
import { BackstageTheme } from '@backstage/theme';
import { SidebarItemWithSubmenuContext } from './sidebarSubmenuContext';
import { isLocationMatch } from '../../utils';

const useStyles = makeStyles<BackstageTheme>(theme => ({
  item: {
    height: 48,
    width: '100%',
    '&:hover': {
      background: '#6f6f6f',
      color: theme.palette.navigation.selectedColor,
    },
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.navigation.color,
    padding: 20,
    cursor: 'pointer',
    position: 'relative',
    background: 'none',
    border: 'none',
  },
  itemContainer: {
    width: '100%',
  },
  selected: {
    background: '#6f6f6f',
    color: '#FFF',
  },
  label: {
    margin: 14,
    marginLeft: 7,
    fontSize: 14,
  },
  dropdownArrow: {
    position: 'absolute',
    right: 21,
  },
  dropdown: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'end',
  },
  dropdownItem: {
    width: '100%',
    padding: '10px 0 10px 0',
  },
  textContent: {
    color: theme.palette.navigation.color,
    display: 'flex',
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      display: 'block',
      paddingLeft: theme.spacing(4),
    },
    fontSize: '14px',
  },
}));
/**
 * Holds submenu item content.
 *
 * title: Text content of submenu item
 * to: Path to navigate to when item is clicked
 * icon: Icon displayed on the left of text content
 * dropdownItems: Optional array of dropdown items displayed when submenu item is clicked.
 *
 * @public
 */
type SidebarSubmenuItemProps = {
  title: string;
  to: string;
  icon: IconComponent;
  callback?: () => void;
};

/**
 * Item used inside a submenu within the sidebar.
 *
 * @public
 */
export const SidebarSubmenuItem = (props: SidebarSubmenuItemProps) => {
  const { title, to, callback, icon: Icon } = props;
  const classes = useStyles();
  const { setIsHoveredOn } = useContext(SidebarItemWithSubmenuContext);
  const closeSubmenu = () => {
    setIsHoveredOn(false);

    // Unfocus the sidebar
    if (document.activeElement) {
      (document.activeElement as HTMLElement).blur();
    }

    // Trigger the callback if present
    if (callback) {
      callback();
    }
  };
  const toLocation = useResolvedPath(to);
  const currentLocation = useLocation();
  const isActive = isLocationMatch(currentLocation, toLocation);

  return (
    <div className={classes.itemContainer}>
      <Link
        component={NavLink}
        to={to}
        underline="none"
        className={classnames(
          classes.item,
          isActive ? classes.selected : undefined,
        )}
        onClick={closeSubmenu}
        onTouchStart={e => e.stopPropagation()}
      >
        <Icon fontSize="small" />
        <Typography variant="subtitle1" className={classes.label}>
          {title}
        </Typography>
      </Link>
    </div>
  );
};
