import {
  Content,
  ContentHeader,
  CreateButton,
  PageWithHeader,
  SupportButton,
  TableColumn,
  TableProps,
} from '@backstage/core-components';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import {
  EntityLifecyclePicker,
  EntityListProvider,
  EntityOwnerPicker,
  EntityTagPicker,
  EntityTypePicker,
  UserListFilterKind,
  UserListPicker,
} from '@backstage/plugin-catalog-react';
import React from 'react';
import { CatalogTable } from './CatalogTable';
import { EntityRow } from './CatalogTable/types';
import {
  FilteredEntityLayout,
  EntityListContainer,
  FilterContainer,
} from './FilteredEntityLayout';
import { CatalogKindHeader } from './CatalogKindHeader';

/**
 * DefaultCatalogPageProps
 * @public
 */
export type CustomCatalogPageProps = {
  initiallySelectedFilter?: UserListFilterKind;
  columns?: TableColumn<EntityRow>[];
  actions?: TableProps<EntityRow>['actions'];
};

export const CustomCatalogPage = ({
  columns,
  actions,
  initiallySelectedFilter = 'owned',
}: CustomCatalogPageProps) => {
  const orgName =
    useApi(configApiRef).getOptionalString('organization.name') ?? 'Backstage';

  return (
    <PageWithHeader title={`${orgName} Catalog`} themeId="home">
      <EntityListProvider>
        <Content>
          <ContentHeader titleComponent={<CatalogKindHeader />}>
            <CreateButton
              title="Create Component"
              to='/create'
            />
            <SupportButton>All your software catalog entities</SupportButton>
          </ContentHeader>
          <FilteredEntityLayout>
            <FilterContainer>
              <EntityTypePicker />
              <UserListPicker initialFilter={initiallySelectedFilter} />
              <EntityOwnerPicker />
              <EntityLifecyclePicker />
              <EntityTagPicker />
            </FilterContainer>
            <EntityListContainer>
              <CatalogTable columns={columns} actions={actions} />
            </EntityListContainer>
          </FilteredEntityLayout>
        </Content>
      </EntityListProvider>
    </PageWithHeader>
  );
};