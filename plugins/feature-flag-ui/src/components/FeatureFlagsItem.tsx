import React, { useContext } from 'react';
import {
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
  Tooltip,
} from '@material-ui/core';
import { FeatureFlag } from '@backstage/core-plugin-api';
import { FlagContext } from '.';
import { useFeatureFlags } from '..';

type Props = {
  flag: FeatureFlag;
  enabled: boolean;
  toggleHandler: Function;
};

export const FlagItem = ({ flag, enabled, toggleHandler }: Props) => { 
  const { currentFlags, toggleFlag } = useContext(FlagContext);
  const { isActive } = useFeatureFlags();

  const toggleHandlerAndContext = () => {
    toggleHandler(flag.name);
    if(currentFlags.includes(flag.name)) {
      toggleFlag(flag.name, isActive(flag.name))
    }
  }

  return (
    <ListItem divider button onClick={ toggleHandlerAndContext }>
      <ListItemIcon>
        <Tooltip placement="top" arrow title={enabled ? 'Disable' : 'Enable'}>
          <Switch color="primary" checked={enabled} name={flag.name} />
        </Tooltip>
      </ListItemIcon>
      <ListItemText
        primary={flag.name}
        secondary={`Registered in ${flag.pluginId}`}
      />
    </ListItem>
  );
}