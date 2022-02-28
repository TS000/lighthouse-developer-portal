import React from 'react';
import { useOutlet } from 'react-router';
import { CustomImportPage } from './CustomImportPage';

/**
 * The whole catalog import page.
 *
 * @public
 */
export const ImportPage = () => {
  const outlet = useOutlet();

  return outlet || <CustomImportPage />;
};