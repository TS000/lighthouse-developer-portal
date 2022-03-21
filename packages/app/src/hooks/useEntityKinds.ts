import useAsync from 'react-use/lib/useAsync';
import { useApi } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';

// Retrieve a list of unique entity kinds present in the catalog
export function useEntityKinds() {
  const catalogApi = useApi(catalogApiRef);

  const {
    error,
    loading,
    value: kinds,
  } = useAsync(async () => {
    const entities = await catalogApi
      .getEntities({ fields: ['kind'] })
      .then(response => response.items);

    return [...new Set(entities.map(e => e.kind))].sort();
  });
  return { error, loading, kinds };
}
