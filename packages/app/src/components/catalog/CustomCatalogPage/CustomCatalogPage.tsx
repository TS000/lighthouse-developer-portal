import {
  Content,
  ContentHeader,
  CreateButton,
  PageWithHeader,
  SupportButton,
  TableColumn,
  TableProps,
} from '@backstage/core-components';
import { useRouteRef } from '@backstage/core-plugin-api';
import { scaffolderPlugin } from '@backstage/plugin-scaffolder';
import {
  CatalogTable,
  CatalogTableRow as EntityRow,
  FilteredEntityLayout,
  EntityListContainer,
  FilterContainer,
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
import React, { useState } from 'react';
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
  const registerComponentLink = useRouteRef(
    scaffolderPlugin.externalRoutes.registerComponent,
  );
  const [ kind, setKind ] = useState<string>('APIs');
  const [ isLoading, setIsLoading ] = useState<boolean>(true);
  const updateHeaderTitle = (newKind: string) => {
    setKind(newKind);
  }
  const checkIfLoading = (loading: boolean) => (setIsLoading(loading))
  const headerProps = {
    updateKindHeader: updateHeaderTitle,
    isLoading: checkIfLoading
  };

  return (
    <PageWithHeader title="Software Catalog" themeId="home">
      <EntityListProvider>
        <Content>
          <ContentHeader titleComponent={<CatalogKindHeader {...headerProps}/>} />

          <ContentHeader
            title={isLoading ? '' :`Browse the collection of ${kind}`}
            description={isLoading ? '' : `Description of ${kind} goes here`}
          >
            <CreateButton
              title="Add to catalog"
              to={registerComponentLink && registerComponentLink()}
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
