import {
  PluginEndpointDiscovery,
  TokenManager,
} from '@backstage/backend-common';
import {
  Entity,
  stringifyEntityRef,
  UserEntity,
} from '@backstage/catalog-model';
import { DocumentCollatorFactory } from '@backstage/plugin-search-common';
import { Config } from '@backstage/config';
import {
  CatalogApi,
  CatalogClient,
  GetEntitiesRequest,
} from '@backstage/catalog-client';
import { CatalogEntityDocument } from '@backstage/plugin-catalog-common';
import { catalogEntityReadPermission } from '@backstage/plugin-catalog-common/alpha';
import { Permission } from '@backstage/plugin-permission-common'
import { Readable } from 'stream';

interface CatalogApiEntityDocument extends CatalogEntityDocument {
  definition?: string;
}

/** @public */
export type DefaultCatalogCollatorFactoryOptions = {
  discovery: PluginEndpointDiscovery;
  tokenManager: TokenManager;
  locationTemplate?: string;
  filter?: GetEntitiesRequest['filter'];
  batchSize?: number;
  catalogClient?: CatalogApi;
};

/** @public */
export class DefaultAPICollatorFactory implements DocumentCollatorFactory {
  public readonly type: string = 'api-catalog';
  public readonly visibilityPermission: Permission = catalogEntityReadPermission;

  private locationTemplate: string;
  private filter?: GetEntitiesRequest['filter'];
  private batchSize: number;
  private readonly catalogClient: CatalogApi;
  private tokenManager: TokenManager;

  static fromConfig(
    _config: Config,
    options: DefaultCatalogCollatorFactoryOptions,
  ) {
    return new DefaultAPICollatorFactory(options);
  }

  private constructor(options: DefaultCatalogCollatorFactoryOptions) {
    const {
      batchSize,
      discovery,
      locationTemplate,
      filter,
      catalogClient,
      tokenManager,
    } = options;

    this.locationTemplate =
      locationTemplate || '/catalog/:namespace/:kind/:name';
    this.filter = filter;
    this.batchSize = batchSize || 500;
    this.catalogClient =
      catalogClient || new CatalogClient({ discoveryApi: discovery });
    this.tokenManager = tokenManager;
  }

  async getCollator(): Promise<Readable> {
    return Readable.from(this.execute());
  }

  private applyArgsToFormat(
    format: string,
    args: Record<string, string>,
  ): string {
    let formatted = format;
    for (const [key, value] of Object.entries(args)) {
      formatted = formatted.replace(`:${key}`, value);
    }
    return formatted.toLowerCase();
  }

  private isUserEntity(entity: Entity): entity is UserEntity {
    return entity.kind.toLocaleUpperCase('en-US') === 'USER';
  }

  private getDocumentText(entity: Entity): string {
    let documentText = entity.metadata.description || '';
    if (this.isUserEntity(entity)) {
      if (entity.spec?.profile?.displayName && documentText) {
        // combine displayName and description
        const displayName = entity.spec?.profile?.displayName;
        documentText = displayName.concat(' : ', documentText);
      } else {
        documentText = entity.spec?.profile?.displayName || documentText;
      }
    }
    return documentText;
  }

  private async *execute(): AsyncGenerator<CatalogApiEntityDocument> {
    const { token } = await this.tokenManager.getToken();
    let entitiesRetrieved = 0;
    let moreEntitiesToGet = true;

    // Offset/limit pagination is used on the Catalog Client in order to
    // limit (and allow some control over) memory used by the search backend
    // at index-time.
    while (moreEntitiesToGet) {
      const entities = (
        await this.catalogClient.getEntities(
          {
            filter: this.filter,
            limit: this.batchSize,
            offset: entitiesRetrieved,
          },
          { token },
        )
      ).items;

      // Control looping through entity batches.
      moreEntitiesToGet = entities.length === this.batchSize;
      entitiesRetrieved += entities.length;

      // Filter by responses that contain a definition
      const entityWithDefinition = entities.filter(
        entity => entity.spec?.definition,
      );

      for (const entity of entityWithDefinition) {
        yield {
          title: entity.metadata.title ?? entity.metadata.name,
          location: this.applyArgsToFormat(this.locationTemplate, {
            namespace: entity.metadata.namespace || 'default',
            kind: entity.kind,
            name: entity.metadata.name,
          }),
          text: this.getDocumentText(entity),
          componentType: entity.spec?.type?.toString() || 'other',
          type: entity.spec?.type?.toString() || 'other',
          namespace: entity.metadata.namespace || 'default',
          kind: entity.kind,
          lifecycle: (entity.spec?.lifecycle as string) || '',
          owner: (entity.spec?.owner as string) || '',
          authorization: {
            resourceRef: stringifyEntityRef(entity),
          },
          definition: JSON.stringify(entity.spec?.definition),
        };
      }
    }
  }
}
