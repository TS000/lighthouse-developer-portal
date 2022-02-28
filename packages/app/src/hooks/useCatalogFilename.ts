import { useApi, configApiRef } from '@backstage/core-plugin-api';
import type { Config } from '@backstage/config';

const getCatalogFilename = (config: Config) => {
    return (
        config.getOptionalString('catalog.import.entityFilename') ??
        'catalog-info.yaml'
      );
}

export function useCatalogFilename(): string {
  const config = useApi(configApiRef);

  return getCatalogFilename(config);
}