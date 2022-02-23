import { createApiRef } from '@backstage/core-plugin-api';
import { List } from '@material-ui/core';

export interface Api {
    name: string;
    // description: string;
    // owner: string;
    // health: string;
}

export interface DocServerApi {
    url: string;
    listApis: () => Promise<List<Api>>;
}

export const myAwesomeApiRef = createApiRef<DocServerApi>({
    id: 'plugin.docserver-api.service',
});

import { DiscoveryApi } from '@backstage/core-plugin-api';
// import {useAsync} from "react-use";

export class docServerApiClient implements DocServerApi {
    discoveryApi: DiscoveryApi;

    constructor({discoveryApi}: { discoveryApi: DiscoveryApi }) {
        this.discoveryApi = discoveryApi;
    }

    // const { value, loading, error } = useAsync(async (): Promise<API[]> => {
    // const backendUrl = config.getString('backend.baseUrl');
    // const proxyPath = '/api/proxy';
    // const basePath = `${backendUrl}${proxyPath}`;
    //
    // const response = await fetch(`${basePath}/docserver/apis/`);
    // const data = await response.json();
    // return data;
    // }, []);

    private async fetch<T = any>(input: string, init?: RequestInit): Promise<T> {
        // const backendUrl = config.getString('backend.baseUrl');
        const proxyPath = '/api/proxy';
        // const basePath = `${backendUrl}${proxyPath}`;
        const proxyUri = `${await this.discoveryApi.getBaseUrl('proxy')}/${proxyPath}`;
        const resp = await fetch(`${proxyUri}${input}`, init);
        // const response = await fetch(`${basePath}/docserver/apis/`);
        if (!resp.ok) throw new Error(resp);
        return await resp.json();
        // const data = await response.json();
        // return data;
    }

    async listApis(): Promise<List<Api>> {
        return await this.fetch<List<Api>>('/users');
    }
}
