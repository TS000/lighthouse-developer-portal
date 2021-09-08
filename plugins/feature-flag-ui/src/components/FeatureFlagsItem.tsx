import React from 'react';
import {
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
  Tooltip,
} from '@material-ui/core';
import { FeatureFlag } from '@backstage/core-plugin-api';

type Props = {
  flag: FeatureFlag;
  enabled: boolean;
  toggleHandler: Function;
};

export const FlagItem = ({ flag, enabled, toggleHandler }: Props) => (
  <ListItem divider button onClick={() => toggleHandler(flag.name)}>
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
