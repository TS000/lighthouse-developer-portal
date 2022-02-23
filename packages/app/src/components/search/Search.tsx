import React, { useState } from 'react';
import { makeStyles, Theme, Paper, Button } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { configApiRef, useApi } from '@backstage/core-plugin-api';

import { SearchModal } from './SearchModal';

const useStyles = makeStyles((theme: Theme) => ({
  bar: {
    padding: theme.spacing(1, 0),
  },
  button: {
    width: '100%',
    justifyContent: 'start',
    textTransform: 'inherit',
  },
}));

export const Search = () => {
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  const configApi = useApi(configApiRef);

  const placeholder = `Search in ${
    configApi.getOptionalString('app.title') || 'Backstage'
  }`;

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <SearchModal open={isOpen} toggleModal={toggleModal} />
      <Paper className={classes.bar}>
        <Button
          className={classes.button}
          startIcon={<SearchIcon />}
          onClick={() => {
            setIsOpen(true);
          }}
        >
          {placeholder}
        </Button>
      </Paper>
    </>
  );
};
