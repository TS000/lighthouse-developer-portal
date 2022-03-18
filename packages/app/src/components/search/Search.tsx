import React, { useState } from 'react';
import { makeStyles, Theme, Paper, Button } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { configApiRef, useApi } from '@backstage/core-plugin-api';

import { SearchModal } from './SearchModal';

const useStyles = makeStyles((theme: Theme) => ({
  searchBar: {
    display: 'flex',
    maxWidth: '60vw',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[1],
    padding: '8px 0',
    borderRadius: '50px',
    margin: 'auto',
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
      <Paper className={classes.searchBar}>
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
