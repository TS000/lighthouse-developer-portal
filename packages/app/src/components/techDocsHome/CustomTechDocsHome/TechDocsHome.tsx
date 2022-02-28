import React from 'react';
import {
  Content,
  ContentHeader,
  SupportButton,
  TableColumn,
  TableProps,
} from '@backstage/core-components';
import {
  EntityListContainer,
  FilterContainer,
  FilteredEntityLayout,
} from '@backstage/plugin-catalog';
import {
  EntityListProvider,
  EntityOwnerPicker,
  EntityTagPicker,
  UserListFilterKind,
  UserListPicker,
} from '@backstage/plugin-catalog-react';
import { TechDocsPageWrapper } from '../TechDocsPageWrapper';
import { TechDocsPicker, DocsTableRow, EntityListDocsTable } from '@backstage/plugin-techdocs';

/**
 * Props for {@link DefaultTechDocsHome}
 *
 * @public
 */
export type DefaultTechDocsHomeProps = {
  initialFilter?: UserListFilterKind;
  columns?: TableColumn<DocsTableRow>[];
  actions?: TableProps<DocsTableRow>['actions'];
};

/**
 * Component which renders a default documentation landing page.
 *
 * @public
 */
export const TechDocsHome = (props: DefaultTechDocsHomeProps) => {
  const { initialFilter = 'all', columns, actions } = props;
  return (
    <TechDocsPageWrapper>
      <Content>
        <ContentHeader title="">
          <SupportButton>
            Discover documentation in your ecosystem.
          </SupportButton>
        </ContentHeader>
        <EntityListProvider>
          <FilteredEntityLayout>
            <FilterContainer>
              <TechDocsPicker />
              <UserListPicker initialFilter={initialFilter} />
              <EntityOwnerPicker />
              <EntityTagPicker />
            </FilterContainer>
            <EntityListContainer>
              <EntityListDocsTable actions={actions} columns={columns} />
            </EntityListContainer>
          </FilteredEntityLayout>
        </EntityListProvider>
      </Content>
    </TechDocsPageWrapper>
  );
};