import React, {ReactElement, useContext} from 'react';
import { 
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Select, 
} from '@material-ui/core';
import { BackstageTheme } from '@backstage/theme';
import pluginConfig from '../../pluginConfig.json';
import EnvironmentContext from '../../EnvironmentContext';

const useStyles = makeStyles<BackstageTheme>(
    theme => ({
      envDropDown: {
        margin: 0,
        width: 160
      }
    }),
    { name: 'BackstageContentHeader' }
  );

export const EnvironmentSelectComponent = (): ReactElement => {
  const classes = useStyles();
  const { envContext, setEnvContext } = useContext(EnvironmentContext);
  const dropDown = pluginConfig.envDropDown;

  const handleEnvChange = (event: any) => {
    setEnvContext(event.target.value as string);
  };

  return (
    <FormControl fullWidth variant="outlined" margin="dense" className={classes.envDropDown}>
      <InputLabel id="env-select-label">{dropDown.label}</InputLabel>
      <Select
        labelId="env-select-label"
        id="env-select"
        value={envContext}
        label={dropDown.label}
        onChange={handleEnvChange}
        >
        {dropDown.options.map(option => (
            <MenuItem value={option.value} key={option.value}>
            {`${option.label}`}
            </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};