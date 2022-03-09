/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  EntityName,
  RELATION_OWNED_BY,
  Entity,
  LocationSpec,
} from '@backstage/catalog-model';
import { HeaderLabel } from '@backstage/core-components';
import { Header } from '../core';
import { useRouteRef } from '@backstage/core-plugin-api';
import {
  EntityRefLink,
  EntityRefLinks,
  getEntityRelations,
} from '@backstage/plugin-catalog-react';
import { techdocsPlugin } from '@backstage/plugin-techdocs';
import CodeIcon from '@material-ui/icons/Code';
import React from 'react';

export type TechDocsMetadata = {
  site_name: string;
  site_description: string;
};

export type TechDocsEntityMetadata = Entity & {
  locationMetadata?: LocationSpec;
};

export type TechDocsPageHeaderProps = {
  entityRef: EntityName;
  entityMetadata?: TechDocsEntityMetadata;
  techDocsMetadata?: TechDocsMetadata;
};

export const TechDocsPageHeader = ({
  entityRef,
  entityMetadata,
  techDocsMetadata,
}: TechDocsPageHeaderProps) => {
  const { name } = entityRef;

  const { site_name: siteName, site_description: siteDescription } =
    techDocsMetadata || {};

  const { locationMetadata, spec } = entityMetadata || {};
  const lifecycle = spec?.lifecycle;

  const ownedByRelations = entityMetadata
    ? getEntityRelations(entityMetadata, RELATION_OWNED_BY)
    : [];

  const docsRootLink = useRouteRef(techdocsPlugin.routes.root)();

  const labels = (
    <>
      <HeaderLabel
        label="Component"
        value={
          <EntityRefLink
            color="inherit"
            entityRef={entityRef}
            defaultKind="Component"
          />
        }
      />
      {ownedByRelations.length > 0 && (
        <HeaderLabel
          label="Owner"
          value={
            <EntityRefLinks
              color="inherit"
              entityRefs={ownedByRelations}
              defaultKind="group"
            />
          }
        />
      )}
      {lifecycle ? <HeaderLabel label="Lifecycle" value={lifecycle} /> : null}
      {locationMetadata &&
      locationMetadata.type !== 'dir' &&
      locationMetadata.type !== 'file' ? (
        <HeaderLabel
          label=""
          value={
            <a
              href={locationMetadata.target}
              target="_blank"
              rel="noopener noreferrer"
            >
              <CodeIcon style={{ marginTop: '-25px', fill: '#fff' }} />
            </a>
          }
        />
      ) : null}
    </>
  );

  return (
    <Header
      title={siteName ? siteName : '.'}
      pageTitleOverride={siteName || name}
      subtitle={
        siteDescription && siteDescription !== 'None' ? siteDescription : ''
      }
      type="Docs"
      typeLink={docsRootLink}
    >
      {labels}
    </Header>
  );
};
