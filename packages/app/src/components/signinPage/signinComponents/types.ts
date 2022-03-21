import { ComponentType } from 'react';
import {
  SignInPageProps,
  ApiHolder,
  ApiRef,
  ProfileInfoApi,
  BackstageIdentityApi,
  SessionApi,
  IdentityApi,
} from '@backstage/core-plugin-api';

export type SignInProviderConfig = {
  id: string;
  title: string;
  message: string;
  apiRef: ApiRef<ProfileInfoApi & BackstageIdentityApi & SessionApi>;
};

export type IdentityProviders = ('guest' | 'custom' | SignInProviderConfig)[];

export type ProviderComponent = ComponentType<
  SignInPageProps & { config: SignInProviderConfig }
>;

export type ProviderLoader = (
  apis: ApiHolder,
  apiRef: ApiRef<ProfileInfoApi & BackstageIdentityApi & SessionApi>,
) => Promise<IdentityApi | undefined>;

export type SignInProvider = {
  Component: ProviderComponent;
  loader: ProviderLoader;
};