import {
    IdentityApi,
    ProfileInfo,
    BackstageUserIdentity,
  } from '@backstage/core-plugin-api';

  function parseJwtPayload(token: string) {
    const [_header, payload, _signature] = token.split('.');
    return JSON.parse(atob(payload));
  }

  type LegacySignInResult = {
    userId: string;
    profile: ProfileInfo;
    getIdToken?: () => Promise<string>;
    signOut?: () => Promise<void>;
  };

  /** @internal */
  export class LegacyUserIdentity implements IdentityApi {
    private constructor(private readonly result: LegacySignInResult) {}

    getUserId(): string {
      return this.result.userId;
    }

    static fromResult(result: LegacySignInResult): LegacyUserIdentity {
      return new LegacyUserIdentity(result);
    }

    async getIdToken(): Promise<string | undefined> {
      return this.result.getIdToken?.();
    }

    getProfile(): ProfileInfo {
      return this.result.profile;
    }

    async getProfileInfo(): Promise<ProfileInfo> {
      return this.result.profile;
    }

    async getBackstageIdentity(): Promise<BackstageUserIdentity> {
      const token = await this.getIdToken();

      if (!token) {
        const userEntityRef = `user:default/${this.getUserId()}`;
        return {
          type: 'user',
          userEntityRef,
          ownershipEntityRefs: [userEntityRef],
        };
      }

      const { sub, ent } = parseJwtPayload(token);
      return {
        type: 'user',
        userEntityRef: sub,
        ownershipEntityRefs: ent ?? [],
      };
    }

    async getCredentials(): Promise<{ token?: string | undefined }> {
      const token = await this.result.getIdToken?.();
      return { token };
    }

    async signOut(): Promise<void> {
      return this.result.signOut?.();
    }
  }