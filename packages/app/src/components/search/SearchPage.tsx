import React from 'react';
import { makeStyles, Theme, Grid, List, Paper } from '@material-ui/core';
import ExtensionIcon from '@material-ui/icons/Extension';
import { CatalogResultListItem } from '../resultListItems/CatalogResultListItem'
import { DocsResultListItem } from '../resultListItems/DocsResultListItem'


import {
  SearchBar,
  SearchFilter,
  SearchResult,
  SearchType,
  DefaultResultListItem,
} from '@backstage/plugin-search';
import {
  CatalogIcon,
  Content,
  DocsIcon,
  Header,
  Page,
} from '@backstage/core-components';

const useStyles = makeStyles((theme: Theme) => ({
  bar: {
    padding: theme.spacing(1, 0),
  },
  filters: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  filter: {
    '& + &': {
      marginTop: theme.spacing(2.5),
    },
  },
}));

const SearchPage = () => {
  const classes = useStyles();

  return (
    <Page themeId="home">
      <Header title="Search" />
      <Content>
        <Grid container direction="row">
          <Grid item xs={12}>
            <Paper className={classes.bar}>
              <SearchBar debounceTime={300} />
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <SearchType.Accordion
              name="Result Type"
              defaultValue="software-catalog"
              types={[
                {
                  value: 'software-catalog',
                  name: 'Software Catalog',
                  icon: <CatalogIcon />,
                },
                {
                  value: 'techdocs',
                  name: 'Documentation',
                  icon: <DocsIcon />,
                },
                {
                  value: 'api-catalog',
                  name: 'API Catalog',
                  icon: <ExtensionIcon />,
                },
              ]}
            />
            <Paper className={classes.filters}>
              <SearchFilter.Select
                className={classes.filter}
                label="Kind"
                name="kind"
                values={[
                  'Component',
                  'API',
                  'Group',
                  'User',
                  'System',
                  'Domain',
                ]}
              />
              <SearchFilter.Checkbox
                className={classes.filter}
                label="Lifecycle"
                name="lifecycle"
                values={['experimental', 'production']}
              />
            </Paper>
          </Grid>
          <Grid item xs={9}>
            <SearchResult>
              {({ results }) => (
                <List>
                  {results.map(({ type, document }) => {
                    // Limit results to 2 lines of text, maximum
                    if (document.text && document.text.length > 300) {
                      document.text = `${document.text.slice(0, 300)}...`;
                    }

                    switch (type) {
                      case 'software-catalog':
                        return (
                          <CatalogResultListItem
                            key={document.location}
                            result={document}
                            type="Catalog entitty"
                          />
                        );
                      case 'api-catalog':
                        return (
                          <CatalogResultListItem
                            key={document.location}
                            result={document}
                            type="API spec"
                          />
                        );
                      case 'techdocs':
                        return (
                          <DocsResultListItem
                            key={document.location}
                            result={document}
                          />
                        );
                      default:
                        return (
                          <DefaultResultListItem
                            key={document.location}
                            result={document}
                          />
                        );
                    }
                  })}
                </List>
              )}
            </SearchResult>
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};

export const searchPage = <SearchPage />;
