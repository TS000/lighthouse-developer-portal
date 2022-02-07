import {
  Content,
  ContentHeader,
  CreateButton,
  PageWithHeader,
  SupportButton,
  TableColumn,
  TableProps,
} from '@backstage/core-components';
import { configApiRef, useApi, useRouteRef } from '@backstage/core-plugin-api';
import {
  catalogPlugin,
  CatalogTable,
  CatalogTableRow as EntityRow, 
  FilteredEntityLayout,
  EntityListContainer,
  FilterContainer
} from '@backstage/plugin-catalog';
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
import { CatalogKindHeader } from './CatalogKindHeader';

/**
 * CustomCatalogPageProps
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
    const createComponentLink = useRouteRef(
      catalogPlugin.externalRoutes.createComponent,
    );
  return (
    <PageWithHeader title={`${orgName} Catalog`} themeId="home">
    <EntityListProvider>
      <Content>
        <ContentHeader titleComponent={<CatalogKindHeader />}>
          <CreateButton
            title="Create Component"
            to={createComponentLink && createComponentLink()}
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
