
import { SignInPageProps } from '@backstage/core-plugin-api';
import { SignInProviderConfig } from '@backstage/core-components';
import React from 'react';
import { HeroSignInPage } from './heroComponent/heroSignInPage';

export type IdentityProviders = ('guest' | 'custom' | SignInProviderConfig)[];

export type HeroSignInPageProps = SignInPageProps & {
  providers: IdentityProviders;
  title?: string;
  align?: 'center' | 'left';
};

export type Props = HeroSignInPageProps;

export function CustomSignInPage(props: Props) {

  return <HeroSignInPage {...props} />;
}