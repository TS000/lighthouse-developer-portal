import {
    IdentityApi,
    ProfileInfo,
    BackstageUserIdentity,
  } from '@backstage/core-plugin-api';

  export class GuestUserIdentity implements IdentityApi {
    getUserId(): string {
      return 'guest';
    }

    async getIdToken(): Promise<string | undefined> {
      return undefined;
    }

    getProfile(): ProfileInfo {
      return {
        email: 'guest@example.com',
        displayName: 'Guest',
      };
    }

    async getProfileInfo(): Promise<ProfileInfo> {
      return {
        email: 'guest@example.com',
        displayName: 'Guest',
      };
    }

    async getBackstageIdentity(): Promise<BackstageUserIdentity> {
      const userEntityRef = `user:default/guest`;
      return {
        type: 'user',
        userEntityRef,
        ownershipEntityRefs: [userEntityRef],
      };
    }

    async getCredentials(): Promise<{ token?: string | undefined }> {
      return {};
    }

    async signOut(): Promise<void> {}
  }