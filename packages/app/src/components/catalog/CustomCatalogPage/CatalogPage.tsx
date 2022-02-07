import React from 'react';
import { useOutlet } from 'react-router';
import {
    CustomCatalogPage,
    CustomCatalogPageProps
} from './CustomCatalogPage';

export const CatalogPage = (props: CustomCatalogPageProps) => {
  const outlet = useOutlet();

  return outlet || <CustomCatalogPage {...props} />;
};