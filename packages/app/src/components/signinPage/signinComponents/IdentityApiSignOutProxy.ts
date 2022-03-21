import {
    BackstageUserIdentity,
    IdentityApi,
    ProfileInfo,
  } from '@backstage/core-plugin-api';

  // Similar to the AppIdentityApi we provide backwards compatibility for a limited time
  type CompatibilityIdentityApi = IdentityApi & {
    getUserId?(): string;
    getIdToken?(): Promise<string | undefined>;
    getProfile?(): ProfileInfo;
  };

  export class IdentityApiSignOutProxy implements IdentityApi {
    private constructor(
      private readonly config: {
        identityApi: CompatibilityIdentityApi;
        signOut: IdentityApi['signOut'];
      },
    ) {}

    static from(config: {
      identityApi: CompatibilityIdentityApi;
      signOut: IdentityApi['signOut'];
    }): IdentityApi {
      return new IdentityApiSignOutProxy(config);
    }

    getUserId(): string {
      if (!this.config.identityApi.getUserId) {
        throw new Error(`SignOutProxy IdentityApi.getUserId is not implemented`);
      }
      return this.config.identityApi.getUserId();
    }

    getIdToken(): Promise<string | undefined> {
      if (!this.config.identityApi.getIdToken) {
        throw new Error(`SignOutProxy IdentityApi.getIdToken is not implemented`);
      }
      return this.config.identityApi.getIdToken();
    }

    getProfile(): ProfileInfo {
      if (!this.config.identityApi.getProfile) {
        throw new Error(`SignOutProxy IdentityApi.getProfile is not implemented`);
      }
      return this.config.identityApi.getProfile();
    }

    getProfileInfo(): Promise<ProfileInfo> {
      return this.config.identityApi.getProfileInfo();
    }

    getBackstageIdentity(): Promise<BackstageUserIdentity> {
      return this.config.identityApi.getBackstageIdentity();
    }

    getCredentials(): Promise<{ token?: string | undefined }> {
      return this.config.identityApi.getCredentials();
    }

    signOut(): Promise<void> {
      return this.config.signOut();
    }
  }