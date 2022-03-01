import {
  PluginEndpointDiscovery,
  TokenManager,
} from '@backstage/backend-common';
import {
  Entity,
  stringifyEntityRef,
  UserEntity,
} from '@backstage/catalog-model';
import { IndexableDocument, DocumentCollator } from '@backstage/search-common';
import { Config } from '@backstage/config';
import {
  CatalogApi,
  CatalogClient,
  CatalogEntitiesRequest,
} from '@backstage/catalog-client';
import { catalogEntityReadPermission } from '@backstage/plugin-catalog-common';
import YAML from 'yaml';

interface CatalogEntityDocument extends IndexableDocument {
  componentType: string;
  namespace: string;
  kind: string;
  lifecycle: string;
  owner: string;
  definition: string;
}

export class DefaultAPICollator implements DocumentCollator {
  protected discovery: PluginEndpointDiscovery;
  protected locationTemplate: string;
  protected filter?: CatalogEntitiesRequest['filter'];
  protected readonly catalogClient: CatalogApi;
  public readonly type: string = 'api-catalog';
  public readonly visibilityPermission = catalogEntityReadPermission;
  protected tokenManager: TokenManager;

  static fromConfig(
    _config: Config,
    options: {
      discovery: PluginEndpointDiscovery;
      tokenManager: TokenManager;
      filter?: CatalogEntitiesRequest['filter'];
    },
  ) {
    return new DefaultAPICollator({
      ...options,
    });
  }

  constructor(options: {
    discovery: PluginEndpointDiscovery;
    tokenManager: TokenManager;
    locationTemplate?: string;
    filter?: CatalogEntitiesRequest['filter'];
    catalogClient?: CatalogApi;
  }) {
    const { discovery, locationTemplate, filter, catalogClient, tokenManager } =
      options;

    this.discovery = discovery;
    this.locationTemplate =
      locationTemplate || '/catalog/:namespace/:kind/:name';
    this.filter = filter;
    this.catalogClient =
      catalogClient || new CatalogClient({ discoveryApi: discovery });
    this.tokenManager = tokenManager;
  }

  protected applyArgsToFormat(
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

  async execute() {
    const { token } = await this.tokenManager.getToken();
    const response = await this.catalogClient.getEntities(
      {
        filter: this.filter,
      },
      { token },
    );

    // Filter by responses that contain a definition
    const responseWithDefinition = response.items.filter(
      entity => entity.spec?.definition,
    );

    return responseWithDefinition.map(
      (entity: Entity): CatalogEntityDocument => {
        return {
          title: entity.metadata.title ?? entity.metadata.name,
          location: this.applyArgsToFormat(this.locationTemplate, {
            namespace: entity.metadata.namespace || 'default',
            kind: entity.kind,
            name: entity.metadata.name,
          }),
          text: this.getDocumentText(entity),
          componentType: entity.spec?.type?.toString() || 'other',
          namespace: entity.metadata.namespace || 'default',
          kind: entity.kind,
          lifecycle: (entity.spec?.lifecycle as string) || '',
          owner: (entity.spec?.owner as string) || '',
          authorization: {
            resourceRef: stringifyEntityRef(entity),
          },
          definition: JSON.stringify(
            YAML.parse((entity.spec?.definition as string) || ''),
          ),
        };
      },
    );
  }
}
