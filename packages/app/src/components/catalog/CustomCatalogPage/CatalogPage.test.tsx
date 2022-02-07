import React from 'react';
import { renderInTestApp } from '@backstage/test-utils';
import { useOutlet } from 'react-router';
import { CatalogPage } from './CatalogPage';

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useOutlet: jest.fn().mockReturnValue('Route Children'),
}));

jest.mock('./CustomCatalogPage', () => ({
  CustomCatalogPage: jest.fn().mockReturnValue('CustomCatalogPage'),
}));

describe('CatalogPage', () => {
  it('renders provided router element', async () => {
    const { getByText } = await renderInTestApp(<CatalogPage />);

    expect(getByText('Route Children')).toBeInTheDocument();
  });

  it('renders CustomCatalogPage home when no router children are provided', async () => {
    (useOutlet as jest.Mock).mockReturnValueOnce(null);
    const { getByText } = await renderInTestApp(<CatalogPage />);

    expect(getByText('CustomCatalogPage')).toBeInTheDocument();
  });
});