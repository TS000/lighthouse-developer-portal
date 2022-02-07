
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

describe('<CatalogKindHeader />', () => {
  it('renders available kinds', async () => {
    const rendered = await renderWithEffects(
      <ApiProvider apis={apis}>
        <MockEntityListContextProvider>
          <CatalogKindHeader />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );

    const input = rendered.getByText('Components');
    act(() => {
        fireEvent.mouseDown(input);
    });
    entities.map(entity => {
      expect(
        rendered.getByRole('option', { name: `${entity.kind}s` }),
      ).toBeInTheDocument();
    });
  });

  it('renders unknown kinds provided in query parameters', async () => {
    const rendered = await renderWithEffects(
      <ApiProvider apis={apis}>
        <MockEntityListContextProvider
          value={{ queryParameters: { kind: 'frob' } }}
        >
          <CatalogKindHeader />
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
          <CatalogKindHeader />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );

    const input = rendered.getByText('Components');
    act(() => {
        fireEvent.mouseDown(input);
    });

    const option = rendered.getByRole('option', { name: 'Templates' });
    act(() => {
        fireEvent.click(option);
    });

    expect(updateFilters).toHaveBeenCalledWith({
      kind: new EntityKindFilter('template'),
    });
  });
});