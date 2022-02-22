/*
 * Copyright 2020 The Backstage Authors
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

import { IconComponent, useElementFilter } from '@backstage/core-plugin-api';
import { BackstageTheme } from '@backstage/theme';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Badge from '@material-ui/core/Badge';
import Typography from '@material-ui/core/Typography';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import classnames from 'classnames';
import React, { forwardRef, ReactNode, useContext, useState } from 'react';
import { SidebarItemWithSubmenuContext } from './config';
import {
  Link,
  NavLinkProps,
  resolvePath,
  useLocation,
  useResolvedPath,
} from 'react-router-dom';
import {
  sidebarConfig,
  SidebarContext,
  SidebarSubmenuItemProps,
  SidebarSubmenuProps,
} from '@backstage/core-components';
import { SidebarSubmenu } from './SidebarSubmenu';
import { isLocationMatch } from '../../utils';
import { Location } from 'history';

/** @public */
export type SidebarItemClassKey =
  | 'root'
  | 'buttonItem'
  | 'closed'
  | 'open'
  | 'highlightable'
  | 'highlighted'
  | 'label'
  | 'iconContainer'
  | 'searchRoot'
  | 'searchField'
  | 'searchFieldHTMLInput'
  | 'searchContainer'
  | 'secondaryAction'
  | 'closedItemIcon'
  | 'submenuArrow'
  | 'expandButton'
  | 'arrows'
  | 'selected';

const useStyles = makeStyles<BackstageTheme>(
  theme => {
    const {
      selectedIndicatorWidth,
      drawerWidthClosed,
      drawerWidthOpen,
      iconContainerWidth,
    } = sidebarConfig;
    return {
      root: {
        color: theme.palette.navigation.color,
        display: 'flex',
        flexFlow: 'row nowrap',
        alignItems: 'center',
        height: 48,
        cursor: 'pointer',
      },
      buttonItem: {
        background: 'none',
        border: 'none',
        width: '100%',
        margin: 0,
        padding: 0,
        textAlign: 'inherit',
        font: 'inherit',
      },
      closed: {
        width: drawerWidthClosed,
        justifyContent: 'center',
      },
      open: {
        [theme.breakpoints.up('sm')]: {
          width: drawerWidthOpen,
        },
      },
      highlightable: {
        '&:hover': {
          background:
            theme.palette.navigation.navItem?.hoverBackground ?? '#404040',
        },
      },
      highlighted: {
        background:
          theme.palette.navigation.navItem?.hoverBackground ?? '#404040',
      },
      label: {
        // XXX (@koroeskohr): I can't seem to achieve the desired font-weight from the designs
        fontWeight: 'bold',
        whiteSpace: 'nowrap',
        lineHeight: 'auto',
        flex: '3 1 auto',
        width: '110px',
        overflow: 'hidden',
        'text-overflow': 'ellipsis',
      },
      iconContainer: {
        boxSizing: 'border-box',
        height: '100%',
        width: iconContainerWidth,
        marginRight: -theme.spacing(2),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      searchRoot: {
        marginBottom: 12,
      },
      searchField: {
        color: '#b5b5b5',
        fontWeight: 'bold',
        fontSize: theme.typography.fontSize,
      },
      searchFieldHTMLInput: {
        padding: theme.spacing(2, 0, 2),
      },
      searchContainer: {
        width: drawerWidthOpen - iconContainerWidth,
      },
      secondaryAction: {
        width: theme.spacing(6),
        textAlign: 'center',
        marginRight: theme.spacing(1),
      },
      closedItemIcon: {
        width: '100%',
        justifyContent: 'center',
      },
      submenuArrow: {
        display: 'flex',
      },
      expandButton: {
        background: 'none',
        border: 'none',
        color: theme.palette.navigation.color,
        width: '100%',
        cursor: 'pointer',
        position: 'relative',
        height: 48,
      },
      arrows: {
        position: 'absolute',
        right: 10,
      },
      selected: {
        '&$root': {
          borderLeft: `solid ${selectedIndicatorWidth}px ${theme.palette.navigation.indicator}`,
          color: theme.palette.navigation.selectedColor,
        },
        '&$closed': {
          width: drawerWidthClosed,
        },
        '& $closedItemIcon': {
          paddingRight: selectedIndicatorWidth,
        },
        '& $iconContainer': {
          marginLeft: -selectedIndicatorWidth,
        },
      },
    };
  },
  { name: 'BackstageSidebarItem' },
);

/**
 * Evaluates the routes of the SubmenuItems & nested DropdownItems.
 * The reeveluation is only triggered, if the `locationPathname` changes, as `useElementFilter` uses memorization.
 *
 * @param submenu SidebarSubmenu component
 * @param location Location
 * @returns boolean
 */
const useLocationMatch = (
  submenu: React.ReactElement<SidebarSubmenuProps>,
  location: Location,
): boolean =>
  useElementFilter(
    submenu.props.children,
    elements => {
      let active = false;
      elements
        .getElements()
        .forEach(
          ({
            props: { to, dropdownItems },
          }: {
            props: Partial<SidebarSubmenuItemProps>;
          }) => {
            if (!active) {
              if (dropdownItems?.length) {
                dropdownItems.forEach(
                  ({ to: _to }) =>
                    (active =
                      active || isLocationMatch(location, resolvePath(_to))),
                );
                return;
              }
              if (to) {
                active = isLocationMatch(location, resolvePath(to));
              }
            }
          },
        );
      return active;
    },
    [location.pathname],
  );

type SidebarItemBaseProps = {
  icon: IconComponent;
  text?: string;
  hasNotifications?: boolean;
  disableHighlight?: boolean;
  className?: string;
};

type SidebarItemButtonProps = SidebarItemBaseProps & {
  onClick: (ev: React.MouseEvent) => void;
  children?: ReactNode;
};

type SidebarItemLinkProps = SidebarItemBaseProps & {
  to: string;
  onClick?: (ev: React.MouseEvent) => void;
} & NavLinkProps;

type SidebarItemWithSubmenuProps = SidebarItemBaseProps & {
  to?: string;
  onClick?: (ev: React.MouseEvent) => void;
  children: ReactNode;
};

/**
 * SidebarItem with 'to' property will be a clickable link.
 * SidebarItem with 'onClick' property and without 'to' property will be a clickable button.
 * SidebarItem which wraps a SidebarSubmenu will be a clickable button which opens a submenu.
 */
type SidebarItemProps =
  | SidebarItemLinkProps
  | SidebarItemButtonProps
  | SidebarItemWithSubmenuProps;

function isButtonItem(
  props: SidebarItemProps,
): props is SidebarItemButtonProps {
  return (props as SidebarItemLinkProps).to === undefined;
}

const sidebarSubmenuType = React.createElement(SidebarSubmenu).type;

// TODO(Rugvip): Remove this once NavLink is updated in react-router-dom.
//               This is needed because react-router doesn't handle the path comparison
//               properly yet, matching for example /foobar with /foo.
export const WorkaroundNavLink = React.forwardRef<
  HTMLAnchorElement,
  NavLinkProps
>(function WorkaroundNavLinkWithRef(
  {
    to,
    end,
    style,
    className,
    activeStyle,
    caseSensitive,
    activeClassName = 'active',
    'aria-current': ariaCurrentProp = 'page',
    ...rest
  },
  ref,
) {
  let { pathname: locationPathname } = useLocation();
  let { pathname: toPathname } = useResolvedPath(to);

  if (!caseSensitive) {
    locationPathname = locationPathname.toLocaleLowerCase('en-US');
    toPathname = toPathname.toLocaleLowerCase('en-US');
  }

  let isActive = locationPathname === toPathname;
  if (!isActive && !end) {
    // This is the behavior that is different from the original NavLink
    isActive = locationPathname.startsWith(`${toPathname}/`);
  }

  const ariaCurrent = isActive ? ariaCurrentProp : undefined;

  return (
    <Link
      {...rest}
      to={to}
      ref={ref}
      aria-current={ariaCurrent}
      style={{ ...style, ...(isActive ? activeStyle : undefined) }}
      className={classnames([
        className,
        isActive ? activeClassName : undefined,
      ])}
    />
  );
});

/**
 * Common component used by SidebarItem & SidebarItemWithSubmenu
 */
const SidebarItemBase = forwardRef<any, SidebarItemProps>((props, ref) => {
  const {
    icon: Icon,
    text,
    hasNotifications = false,
    disableHighlight = false,
    onClick,
    children,
    className,
    ...navLinkProps
  } = props;
  const classes = useStyles();
  // XXX (@koroeskohr): unsure this is optimal. But I just really didn't want to have the item component
  // depend on the current location, and at least have it being optionally forced to selected.
  // Still waiting on a Q answered to fine tune the implementation
  const { isOpen } = useContext(SidebarContext);

  const itemIcon = (
    <Badge
      color="secondary"
      variant="dot"
      overlap="circular"
      invisible={!hasNotifications}
      className={classnames({ [classes.closedItemIcon]: !isOpen })}
    >
      <Icon fontSize="small" />
    </Badge>
  );

  const openContent = (
    <>
      <div data-testid="login-button" className={classes.iconContainer}>
        {itemIcon}
      </div>
      {text && (
        <Typography variant="subtitle2" className={classes.label}>
          {text}
        </Typography>
      )}
      <div className={classes.secondaryAction}>{children}</div>
    </>
  );

  const content = isOpen ? openContent : itemIcon;

  const childProps = {
    onClick,
    className: classnames(
      className,
      classes.root,
      isOpen ? classes.open : classes.closed,
      isButtonItem(props) && classes.buttonItem,
      { [classes.highlightable]: !disableHighlight },
    ),
  };

  if (isButtonItem(props)) {
    return (
      <button aria-label={text} {...childProps} ref={ref}>
        {content}
      </button>
    );
  }

  return (
    <WorkaroundNavLink
      {...childProps}
      activeClassName={classes.selected}
      to={props.to ? props.to : ''}
      ref={ref}
      aria-label={text ? text : props.to}
      {...navLinkProps}
    >
      {content}
    </WorkaroundNavLink>
  );
});

const SidebarItemWithSubmenu = ({
  children,
  ...props
}: SidebarItemBaseProps & {
  children: React.ReactElement<SidebarSubmenuProps>;
}) => {
  const classes = useStyles();
  const [isHoveredOn, setIsHoveredOn] = useState(false);
  const [isClickedOn, setIsClickedOn] = useState(false);
  const location = useLocation();
  const isActive = useLocationMatch(children, location);
  const isSmallScreen = useMediaQuery<BackstageTheme>((theme: BackstageTheme) =>
    theme.breakpoints.down('sm'),
  );

  const isSidebarActive = isHoveredOn || isClickedOn;

  const handleMouseEnter = () => {
    setIsHoveredOn(true);
  };
  const handleMouseLeave = () => {
    setIsHoveredOn(false);
  };

  const arrowIcon = () => {
    if (isSmallScreen) {
      return isSidebarActive ? (
        <ArrowDropUp fontSize="small" className={classes.submenuArrow} />
      ) : (
        <ArrowDropDown fontSize="small" className={classes.submenuArrow} />
      );
    }
    return (
      !isSidebarActive && (
        <ArrowRightIcon fontSize="small" className={classes.submenuArrow} />
      )
    );
  };

  return (
    <SidebarItemWithSubmenuContext.Provider
      value={{
        isHoveredOn,
        setIsHoveredOn,
        isClickedOn,
        setIsClickedOn,
      }}
    >
      <ClickAwayListener onClickAway={() => setIsClickedOn(false)}>
        <div
          data-testid="item-with-submenu"
          onMouseLeave={handleMouseLeave}
          onTouchStart={isHoveredOn ? handleMouseLeave : handleMouseEnter}
          onMouseEnter={handleMouseEnter}
          className={classnames(isSidebarActive && classes.highlighted)}
        >
          <SidebarItemBase
            onClick={() => setIsClickedOn(!isClickedOn)}
            className={isActive ? classes.selected : ''}
            {...props}
          >
            {arrowIcon()}
          </SidebarItemBase>
          {isSidebarActive && children}
        </div>
      </ClickAwayListener>
    </SidebarItemWithSubmenuContext.Provider>
  );
};

/**
 * Creates a `SidebarItem`
 *
 * If children contain a `SidebarSubmenu` component the `SidebarItem` will have a expandable submenu
 */
export const SidebarItem = (props: any) => {
  // Filter children for SidebarSubmenu components
  const [submenu] = useElementFilter(props.children, elements =>
    // Directly comparing child.type with SidebarSubmenu will not work with in
    // combination with react-hot-loader
    //
    // https://github.com/gaearon/react-hot-loader/issues/304#issuecomment-456569720
    elements.getElements().filter(child => child.type === sidebarSubmenuType),
  );

  return (
    <SidebarItemWithSubmenu {...props}>
      {submenu as React.ReactElement<SidebarSubmenuProps>}
    </SidebarItemWithSubmenu>
  );
};
