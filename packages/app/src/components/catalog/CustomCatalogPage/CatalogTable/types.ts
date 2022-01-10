import { Entity, EntityName } from '@backstage/catalog-model';

export type EntityRow = {
  entity: Entity;
  resolved: {
    name: string;
    partOfSystemRelationTitle?: string;
    partOfSystemRelations: EntityName[];
    ownedByRelationsTitle?: string;
    ownedByRelations: EntityName[];
  };
};