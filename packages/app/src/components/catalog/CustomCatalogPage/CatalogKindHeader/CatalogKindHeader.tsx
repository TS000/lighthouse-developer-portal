import React, { useEffect, useState } from 'react';
import {
  capitalize,
  makeStyles,
  Theme,
  Tabs,
  Tab
} from '@material-ui/core';
import {
  EntityKindFilter,
  useEntityList,
} from '@backstage/plugin-catalog-react';
import { useEntityKinds } from '../../../../hooks';
import { Progress } from '@backstage/core-components';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    "&:hover": {
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary
    }
  },
  indicator: {
    backgroundColor: theme.palette.primary.main,
    height: theme.spacing(0.3)
  },
}));

const useTabsStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3, 3),
    ...theme.typography.caption,
    textTransform: "uppercase",
    fontWeight: "bold",
    color: theme.palette.text.secondary,
    "&:hover": {
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.primary
    },
  },
  selected: {
    fontWeight: "bold",
    color: theme.palette.text.primary
  },
}));

type CatalogKindHeaderProps = {
  initialFilter?: string;
  updateKindHeader: Function;
  isLoading: Function;
};

export const CatalogKindHeader = ({
  initialFilter = 'api',
  updateKindHeader,
  isLoading
}: CatalogKindHeaderProps) => {
  const classes = useStyles();
  const tabStyles = useTabsStyles();
  const { kinds: allKinds = [], loading } = useEntityKinds();
  const { updateFilters, queryParameters } = useEntityList();
  const [selectedKind, setSelectedKind] = useState(
    ([queryParameters.kind].flat()[0] ?? initialFilter).toLocaleLowerCase(
      'en-US',
    ),
  );
  const handleChange = (_: any, newValue: any) => {
    setSelectedKind(newValue);
  };

  useEffect(() => {
    updateFilters({
      kind: selectedKind ? new EntityKindFilter(selectedKind) : undefined,
    });
    let _kind = selectedKind.toUpperCase();;
    if (_kind !== 'API') {
      _kind = _kind.charAt(0) + _kind.slice(1).toLowerCase();
    }
    updateKindHeader(`${_kind}s`);
  }, [selectedKind, updateFilters, updateKindHeader, isLoading]);

  useEffect(() => {
    isLoading(loading);
  }, [isLoading, loading]);

  // Before allKinds is loaded, or when a kind is entered manually in the URL, selectedKind may not
  // be present in allKinds. It should still be shown in the dropdown, but may not have the nice
  // enforced casing from the catalog-backend. This makes a key/value record for the Select options,
  // including selectedKind if it's unknown - but allows the selectedKind to get clobbered by the
  // more proper catalog kind if it exists.
  const options = [capitalize(selectedKind)]
    .concat(allKinds)
    .sort()
    .reduce((acc, kind) => {
      acc[kind.toLocaleLowerCase('en-US')] = kind;
      return acc;
    }, {} as Record<string, string>);

  delete options.location;

  if (loading) {
    return <Progress />
  }

  return (
    <Tabs
    value={selectedKind}
    onChange={handleChange}
    aria-label="catalog-kinds"
    classes={classes}
    >
      {Object.keys(options).map(kind => (
        <Tab label={`${options[kind]}s`} value={kind} key={kind} classes={tabStyles} />
      ))}
    </Tabs>
  );
};