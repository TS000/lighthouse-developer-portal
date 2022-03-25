
import React from 'react';
import { act, fireEvent } from '@testing-library/react';
import { Entity } from '@backstage/catalog-model';
import {
  catalogApiRef,
  EntityKindFilter,
  MockEntityListContextProvider,
} from '@backstage/plugin-catalog-react';
import { ApiProvider } from '@backstage/core-app-api';
import { renderWithEffects, TestApiRegistry } from '@backstage/test-utils';
import { CatalogKindHeader } from './CatalogKindHeader';

const entities: Entity[] = [
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      name: 'component-1',
    },
  },
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      name: 'component-2',
    },
  },
  {
    apiVersion: '1',
    kind: 'Template',
    metadata: {
      name: 'template',
    },
  },
  {
    apiVersion: '1',
    kind: 'System',
    metadata: {
      name: 'system',
    },
  },
];

const apis = TestApiRegistry.from([
  catalogApiRef,
  {
    getEntities: jest.fn().mockResolvedValue({ items: entities }),
  },
]);

const mockProps = {
  updateKindHeader: Function,
  isLoading: Function
}
describe('<CatalogKindHeader />', () => {
  it('renders available kinds', async () => {
    const rendered = await renderWithEffects(
      <ApiProvider apis={apis}>
        <MockEntityListContextProvider>
          <CatalogKindHeader {...mockProps}/>
        </MockEntityListContextProvider>
      </ApiProvider>,
    );
    entities.map(entity => {
      expect(
        rendered.getByRole('tab', { name: `${entity.kind}s` }),
      ).toBeInTheDocument();
    });
  });

  it('renders unknown kinds provided in query parameters', async () => {
    const rendered = await renderWithEffects(
      <ApiProvider apis={apis}>
        <MockEntityListContextProvider
          value={{ queryParameters: { kind: 'frob' } }}
        >
          <CatalogKindHeader {...mockProps}/>
        </MockEntityListContextProvider>
      </ApiProvider>,
    );

    expect(rendered.getByText('Frobs')).toBeInTheDocument();
  });

  it('updates the kind filter', async () => {
    const updateFilters = jest.fn();
    const rendered = await renderWithEffects(
      <ApiProvider apis={apis}>
        <MockEntityListContextProvider value={{ updateFilters }}>
          <CatalogKindHeader {...mockProps}/>
        </MockEntityListContextProvider>
      </ApiProvider>,
    );


    const option = rendered.getByRole('tab', { name: 'Components' });
    act(() => {
        fireEvent.click(option);
    });

    expect(updateFilters).toHaveBeenCalledWith({
      kind: new EntityKindFilter('component'),
    });
  });
});