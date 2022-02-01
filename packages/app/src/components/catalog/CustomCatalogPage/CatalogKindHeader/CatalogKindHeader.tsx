import React, { useEffect, useState } from 'react';
import {
  capitalize,
  createStyles,
  InputBase,
  makeStyles,
  MenuItem,
  Select,
  Theme,
} from '@material-ui/core';
import {
  EntityKindFilter,
  useEntityKinds,
  useEntityListProvider,
} from '@backstage/plugin-catalog-react';
import { parseParams } from '../../../../utils';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      ...theme.typography.h4,
    },
  }),
);

type CatalogKindHeaderProps = {
  initialFilter?: string;
};

export const CatalogKindHeader = ({
  initialFilter = 'component',
}: CatalogKindHeaderProps) => {
  const classes = useStyles();
  const { kinds: allKinds = [] } = useEntityKinds();
  const { updateFilters, queryParameters } = useEntityListProvider();
  const [initialized, setInitialized] = useState<boolean>(false);

  const [selectedKind, setSelectedKind] = useState(
    (
      (parseParams(location.search)['filters[kind]'] ||
        [queryParameters.kind].flat()[0]) ??
      initialFilter
    ).toLocaleLowerCase('en-US'),
  );

  useEffect(() => {
    updateFilters({
      kind: selectedKind ? new EntityKindFilter(selectedKind) : undefined,
    });
  }, [selectedKind, updateFilters]);

  // Updates the selectedKind when the queryParameter changes
  useEffect(() => {
    // Keep initial selectedKind if this was the first render
    if (!initialized && selectedKind) {
      setInitialized(true);

      // Otherwise update the selectedKind if queryParameters have changed
    } else if (
      initialized &&
      queryParameters.kind &&
      queryParameters.kind !== selectedKind
    ) {
      setSelectedKind(queryParameters.kind);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParameters.kind]);

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
  return (
    <Select
      input={<InputBase value={selectedKind} />}
      value={selectedKind}
      onChange={e => setSelectedKind(e.target.value as string)}
      classes={classes}
    >
      {Object.keys(options).map(kind => (
        <MenuItem value={kind} key={kind}>
          {`${options[kind]}s`}
        </MenuItem>
      ))}
    </Select>
  );
};
