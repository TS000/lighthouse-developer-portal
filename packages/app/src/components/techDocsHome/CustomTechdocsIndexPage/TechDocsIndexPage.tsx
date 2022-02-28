import React from 'react';
import { useOutlet } from 'react-router';
import { TechDocsHome } from '../CustomTechDocsHome';

export const TechDocsIndexPage = () => {
  const outlet = useOutlet();

  return outlet || <TechDocsHome />;
};