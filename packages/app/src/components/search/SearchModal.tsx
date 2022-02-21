import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  List,
  Paper,
  useTheme,
} from '@material-ui/core';
import LaunchIcon from '@material-ui/icons/Launch';
import { makeStyles } from '@material-ui/core/styles';
import {
  SearchBar,
  SearchResult,
  useSearch,
  DefaultResultListItem,
  SearchResultPager,
  searchPlugin,
} from '@backstage/plugin-search';
import { IndexableDocument } from '@backstage/search-common';
import { useRouteRef } from '@backstage/core-plugin-api';
import { Link, useContent } from '@backstage/core-components';
import { CatalogResultListItem } from '@backstage/plugin-catalog';
import { DocsResultListItem } from '@backstage/plugin-techdocs';

export interface SearchModalProps {
  open?: boolean;
  toggleModal: () => void;
}

const useStyles = makeStyles(theme => ({
  container: {
    borderRadius: 30,
    display: 'flex',
    height: '2.4em',
  },
  input: {
    flex: 1,
  },
  // Reduces default height of the modal, keeping a gap of 128px between the top and bottom of the page.
  paperFullWidth: { height: 'calc(100% - 128px)' },
  dialogActionsContainer: { padding: theme.spacing(1, 3) },
  viewResultsLink: { verticalAlign: '0.5em' },
}));

export const Modal = ({ open = true, toggleModal }: SearchModalProps) => {
  const getSearchLink = useRouteRef(searchPlugin.routes.root);
  const classes = useStyles();

  const { term } = useSearch();
  const { focusContent } = useContent();
  const { transitions } = useTheme();

  const handleResultClick = () => {
    toggleModal();
    setTimeout(focusContent, transitions.duration.leavingScreen);
  };

  const handleKeyPress = () => {
    handleResultClick();
  };

  const getResultType = (type: string, document: IndexableDocument) => {
    switch (type) {
      case 'software-catalog':
        return (
          <CatalogResultListItem key={document.location} result={document} />
        );
      case 'techdocs':
        return <DocsResultListItem key={document.location} result={document} />;
      default:
        return (
          <DefaultResultListItem key={document.location} result={document} />
        );
    }
  };

  return (
    <Dialog
      classes={{
        paperFullWidth: classes.paperFullWidth,
      }}
      onClose={toggleModal}
      aria-labelledby="search-modal-title"
      open={open}
      fullWidth
      maxWidth="lg"
    >
      <DialogTitle>
        <Paper className={classes.container}>
          <SearchBar debounceTime={300} className={classes.input} />
        </Paper>
      </DialogTitle>
      <DialogContent>
        <Grid
          container
          direction="row-reverse"
          justifyContent="flex-start"
          alignItems="center"
        >
          <Grid item>
            <Link
              onClick={() => {
                toggleModal();
                setTimeout(focusContent, transitions.duration.leavingScreen);
              }}
              to={`${getSearchLink()}?query=${term}`}
            >
              <span className={classes.viewResultsLink}>View Full Results</span>
              <LaunchIcon color="primary" />
            </Link>
          </Grid>
        </Grid>
        <Divider />
        <SearchResult>
          {({ results }) => (
            <List>
              {results.map(({ type, document }) => (
                <div
                  role="button"
                  tabIndex={0}
                  key={`${document.location}-btn`}
                  onClick={handleResultClick}
                  onKeyPress={handleKeyPress}
                >
                  {getResultType(type, document)}
                </div>
              ))}
            </List>
          )}
        </SearchResult>
      </DialogContent>
      <DialogActions className={classes.dialogActionsContainer}>
        <Grid container direction="row">
          <Grid item xs={12}>
            <SearchResultPager />
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  );
};

export const SearchModal = ({ open = true, toggleModal }: SearchModalProps) => {
  return <Modal open={open} toggleModal={toggleModal} />;
};
