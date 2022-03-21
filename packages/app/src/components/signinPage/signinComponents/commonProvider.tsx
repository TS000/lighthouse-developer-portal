import React from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import {
  ProviderComponent,
  ProviderLoader,
  SignInProvider,
  SignInProviderConfig,
} from './types';
import { useApi, errorApiRef } from '@backstage/core-plugin-api';
import { GridItem } from './styles';
import { ForwardedError } from '@backstage/errors';
import { UserIdentity } from './UserIdentity';
import { InfoCard } from '@backstage/core-components';

const Component: ProviderComponent = ({ config, onSignInSuccess }) => {
  const { apiRef, title, message } = config as SignInProviderConfig;
  const authApi = useApi(apiRef);
  const errorApi = useApi(errorApiRef);

  const handleLogin = async () => {
    try {
      const identityResponse = await authApi.getBackstageIdentity({
        instantPopup: true,
      });
      if (!identityResponse) {
        throw new Error(
          `The ${title} provider is not configured to support sign-in`,
        );
      }

      const profile = await authApi.getProfile();

      onSignInSuccess(
        UserIdentity.create({
          identity: identityResponse.identity,
          profile,
          authApi,
        }),
      );
    } catch (error) {
      errorApi.post(new ForwardedError('Login failed', error));
    }
  };

  return (
    <GridItem>
      <InfoCard
        variant="fullHeight"
        title={title}
        actions={
          <Button color="primary" variant="outlined" onClick={handleLogin}>
            Sign In
          </Button>
        }
      >
        <Typography variant="body1">{message}</Typography>
      </InfoCard>
    </GridItem>
  );
};

const loader: ProviderLoader = async (apis, apiRef) => {
  const authApi = apis.get(apiRef)!;

  const identityResponse = await authApi.getBackstageIdentity({
    optional: true,
  });

  if (!identityResponse) {
    return undefined;
  }

  const profile = await authApi.getProfile();

  return UserIdentity.create({
    identity: identityResponse.identity,
    profile,
    authApi,
  });
};

export const commonProvider: SignInProvider = { Component, loader };