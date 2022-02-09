import React from 'react';
import { DismissableBanner } from '@backstage/core-components';

export const Banner = () => (
  <DismissableBanner
    variant="info"
    id="beta_dismissable"
    message="The Lighthouse Embark application is currently in beta development and not in production."
    fixed
  />
);
