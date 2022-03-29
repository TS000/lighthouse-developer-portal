import { createApiRef, DiscoveryApi } from '@backstage/core-plugin-api';
import pluginConfig from './pluginConfig.json';

export interface API {
    name: string;
    description?: string;
    owner?: string;
    health?: string;
};

export interface APIGatewayConfig {
  exposedRoute: string | null;
  removePath: string | null;
  routeId: string | null;
  serviceId: string | null;
}

export interface APIVersion {
    activity?: string;
    gatewayConfig: APIGatewayConfig;
    internalOnly: string;
    majorVersion: string;
    oasUrl: string;
    securityType: string;
    status: string;
    updatedAt?: string;
};

export interface OAS {
  iteration: string;
  status: string;
  updatedAt?: string;
};

export interface OAS {
  iteration: string;
  status: string;
  updatedAt?: string;
};

export interface DocServerApi {
    getApis: () => Promise<API[]>;
    getApiVersions: (apiName: string, envContext?: string) => Promise<APIVersion[]>;
    getOASIterations: (apiName: string, apiVersion: string, envContext?: string) => Promise<OAS[]>;
};

export const docServerApiRef = createApiRef<DocServerApi>({
  id: 'plugin.docserver-api.service',
}); 

export class DocServerApiClient implements DocServerApi {
  discoveryApi: DiscoveryApi;

  constructor({ discoveryApi }: { discoveryApi: DiscoveryApi }) {
    this.discoveryApi = discoveryApi;
  }

  private async fetch<T = any>(fullPath: string, init?: RequestInit): Promise<T> {
    const resp = await fetch(fullPath, init);
    if (!resp.ok) throw new Error(resp.statusText);
    const data = await resp.json();
    return data;
  }

  private async resolveFullPath(subpath: string, envContext?: string): Promise<string> {
    // Add proxy, environment, & docserver aspects to full path
    const proxyUri = `${await this.discoveryApi.getBaseUrl('proxy')}`;
    const env = (envContext) ? envContext : pluginConfig.defaultEnv;
    return `${proxyUri}/${env}${pluginConfig.docserverPath}${subpath}`;
  }

  async getApis(): Promise<any> {
    const fullPath = await this.resolveFullPath('/apis/');
    return await this.fetch<API[]>(fullPath);
  }

  async getApiVersions(apiName: string, envContext?: string): Promise<any> {
    const fullPath = await this.resolveFullPath(`/apis/${apiName}/versions`, envContext);
    return await this.fetch<APIVersion[]>(fullPath);
  }

  async getOASIterations(apiName: string, apiVersion: string, envContext?: string): Promise<any> {
    const fullPath = await this.resolveFullPath(`/apis/${apiName}/versions/${apiVersion}/oas`, envContext);
    return await this.fetch<OAS[]>(fullPath);
  }
};
