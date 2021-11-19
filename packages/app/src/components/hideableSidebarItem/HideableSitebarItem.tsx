import React, { useContext, FC } from 'react'
import { SidebarItem } from '@backstage/core-components';
import { FlagContext } from '@internal/plugin-feature-flags';

type SideBarType = {
    flagName: string;
    to: string;
    text: string;
    icon: any;
}
export const HideableSidebarItem: FC<SideBarType> = ({ flagName, to, text, icon }): any => {
    const { flagState } = useContext(FlagContext);
    return !!flagState[flagName] && <SidebarItem icon={icon} to={to} text={text} />
}