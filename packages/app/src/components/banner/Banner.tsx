import React from 'react';
import { DismissableBanner } from '@backstage/core-components';

export const Banner = () => (
  <DismissableBanner
    variant="info"
    id="beta_dismissable"
    message="The Lighthouse developer portal is currently in beta development and not in production."
    fixed
  />
);
