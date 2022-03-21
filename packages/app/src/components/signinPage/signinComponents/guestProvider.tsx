import React from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { GridItem } from './styles';
import { ProviderComponent, ProviderLoader, SignInProvider } from './types';
import { GuestUserIdentity } from './GuestUserIdentity';
import { InfoCard } from '@backstage/core-components';

const Component: ProviderComponent = ({ onSignInSuccess }) => (
  <GridItem>
    <InfoCard
      title="Guest"
      variant="fullHeight"
      actions={
        <Button
          color="primary"
          variant="outlined"
          onClick={() => onSignInSuccess(new GuestUserIdentity())}
        >
          Enter
        </Button>
      }
    >
      <Typography variant="body1">
        Enter as a Guest User.
        <br />
        You will not have a verified identity,
        <br />
        meaning some features might be unavailable.
      </Typography>
    </InfoCard>
  </GridItem>
);

const loader: ProviderLoader = async () => {
  return new GuestUserIdentity();
};

export const guestProvider: SignInProvider = { Component, loader };