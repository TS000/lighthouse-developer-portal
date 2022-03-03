import { createApiRef, DiscoveryApi } from '@backstage/core-plugin-api';

export interface API {
    name: string;
    description?: string;
    owner?: string;
    health?: string;
};

export interface APIVersion {
    majorVersion: string;
    status: string;
    internalOnly: string;
    updatedAt?: string;
    activity?: string;
};

export interface DocServerApi {
    getApis: () => Promise<API[]>;
    getApiVersions: (apiName: string) => Promise<APIVersion[]>;
};

export const docServerApiRef = createApiRef<DocServerApi>({
  id: 'plugin.docserver-api.service',
});

export class DocServerApiClient implements DocServerApi {
  discoveryApi: DiscoveryApi;
  contextRoot = '/docserver';

  constructor({ discoveryApi }: { discoveryApi: DiscoveryApi }) {
    this.discoveryApi = discoveryApi;
  }

  private async fetch<T = any>(path: string, init?: RequestInit): Promise<T> {
    const proxyUri = `${await this.discoveryApi.getBaseUrl('proxy')}`;
    const resp = await fetch(`${proxyUri}${this.contextRoot}${path}`, init);
    if (!resp.ok) throw new Error(resp.statusText);
    const data = await resp.json();
    return data;
  }

  async getApis(): Promise<any> {
    const path = '/apis/';
    return await this.fetch<API[]>(path);
  }

  async getApiVersions(apiName: string): Promise<any> {
    const path = `/apis/${apiName}/versions`;
    return await this.fetch<APIVersion[]>(path);
  }
};
