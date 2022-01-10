import { RELATION_OWNED_BY, RELATION_PART_OF } from '@backstage/catalog-model';
import {
  favoriteEntityIcon,
  favoriteEntityTooltip,
  formatEntityRefTitle,
  getEntityMetadataEditUrl,
  getEntityMetadataViewUrl,
  getEntityRelations,
  useEntityListProvider,
  useStarredEntities,
} from '@backstage/plugin-catalog-react';
import Edit from '@material-ui/icons/Edit';
import OpenInNew from '@material-ui/icons/OpenInNew';
import { capitalize } from 'lodash';
import React, { useMemo } from 'react';
import * as columnFactories from './columns';
import { EntityRow } from './types';
import {
  CodeSnippet,
  Table,
  TableColumn,
  TableProps,
  WarningPanel,
} from '@backstage/core-components';

type CatalogTableProps = {
  columns?: TableColumn<EntityRow>[];
  actions?: TableProps<EntityRow>['actions'];
};

export const CatalogTable = ({ columns, actions }: CatalogTableProps) => {
  const { isStarredEntity, toggleStarredEntity } = useStarredEntities();
  const { loading, error, entities, filters } = useEntityListProvider();

  const defaultColumns: TableColumn<EntityRow>[] = useMemo(
    () => [
      columnFactories.createNameColumn({ defaultKind: filters.kind?.value }),
      columnFactories.createSystemColumn(),
      columnFactories.createOwnerColumn(),
      columnFactories.createSpecTypeColumn(),
      columnFactories.createSpecLifecycleColumn(),
      columnFactories.createMetadataDescriptionColumn(),
      columnFactories.createTagsColumn(),
    ],
    [filters.kind?.value],
  );

  const showTypeColumn = filters.type === undefined;
  // TODO(timbonicus): remove the title from the CatalogTable once using EntitySearchBar
  const titlePreamble = capitalize(filters.user?.value ?? 'all');

  if (error) {
    return (
      <div>
        <WarningPanel
          severity="error"
          title="Could not fetch catalog entities."
        >
          <CodeSnippet language="text" text={error.toString()} />
        </WarningPanel>
      </div>
    );
  }

  const defaultActions: TableProps<EntityRow>['actions'] = [
    ({ entity }) => {
      const url = getEntityMetadataViewUrl(entity);
      return {
        icon: () => <OpenInNew aria-label="View" fontSize="small" />,
        tooltip: 'View',
        disabled: !url,
        onClick: () => {
          if (!url) return;
          window.open(url, '_blank');
        },
      };
    },
    ({ entity }) => {
      const url = getEntityMetadataEditUrl(entity);
      return {
        icon: () => <Edit aria-label="Edit" fontSize="small" />,
        tooltip: 'Edit',
        disabled: !url,
        onClick: () => {
          if (!url) return;
          window.open(url, '_blank');
        },
      };
    },
    ({ entity }) => {
      const isStarred = isStarredEntity(entity);
      return {
        cellStyle: { paddingLeft: '1em' },
        icon: () => favoriteEntityIcon(isStarred),
        tooltip: favoriteEntityTooltip(isStarred),
        onClick: () => toggleStarredEntity(entity),
      };
    },
  ];

  const rows = entities.map(entity => {
    const partOfSystemRelations = getEntityRelations(entity, RELATION_PART_OF, {
      kind: 'system',
    });
    const ownedByRelations = getEntityRelations(entity, RELATION_OWNED_BY);

    return {
      entity,
      resolved: {
        name: formatEntityRefTitle(entity, {
          defaultKind: 'Component',
        }),
        ownedByRelationsTitle: ownedByRelations
          .map(r => formatEntityRefTitle(r, { defaultKind: 'group' }))
          .join(', '),
        ownedByRelations,
        partOfSystemRelationTitle: partOfSystemRelations
          .map(r =>
            formatEntityRefTitle(r, {
              defaultKind: 'system',
            }),
          )
          .join(', '),
        partOfSystemRelations,
      },
    };
  });

  const typeColumn = (columns || defaultColumns).find(c => c.title === 'Type');
  if (typeColumn) {
    typeColumn.hidden = !showTypeColumn;
  }
  const showPagination = rows.length > 20;

  return (
    <Table<EntityRow>
      isLoading={loading}
      columns={columns || defaultColumns}
      options={{
        paging: showPagination,
        pageSize: 20,
        actionsColumnIndex: -1,
        loadingType: 'linear',
        showEmptyDataSourceMessage: !loading,
        padding: 'dense',
        pageSizeOptions: [20, 50, 100],
      }}
      title={`${titlePreamble} (${entities.length})`}
      data={rows}
      actions={actions || defaultActions}
    />
  );
};

CatalogTable.columns = columnFactories;