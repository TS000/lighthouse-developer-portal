# [RFC] Cache Store Investigation

**Summary**:

Backstage plugins are configured so they can utilize a cache store to improve performance and reliability.

## Background

[Backstage](https://backstage.io/docs/overview/architecture-overview#cache) allows configuring the use of a cache from the `app-config.yml` file. For local development the `app-config.yaml` can use an in `memory` option for the cache store but it is recommended to switch to cache store, like Memcached, for production environments.
## Goal

Investigate the use of a cache store for deployments that replaces the local in memory cache configuration.

## Findings

The `backend` implementation of the cache store starts by allowing each plugin to instantiate a `cacheManager` object using the `app-config` in the [`makeCreateEnv` function](https://github.com/backstage/backstage/blob/master/packages/backend/src/index.ts#L73). The `CacheManager` provides each plugin with its own [PluginCacheManager](https://github.com/backstage/backstage/blob/master/packages/backend-common/src/cache/types.ts#L57) which allows each plugin to use their own isolated data stores. A [CacheClient interface](https://github.com/backstage/backstage/blob/master/packages/backend-common/src/cache/CacheClient.ts#L44) is also provided with `get`, `set`, and `delete` functions for the cache.

Even though all the plugins contain a `cacheManager` it appears only a couple plugins have cache implementations: the [GitLab Discovery Processor](https://github.com/backstage/backstage/blob/master/plugins/catalog-backend/src/ingestion/processors/GitLabDiscoveryProcessor.ts#L45) and the [Techdocs-backend](https://github.com/backstage/backstage/blob/master/plugins/techdocs-backend/src/cache/TechDocsCache.ts#L23). We don't use the `GitLab Discovery Processor` but I was able to cache Techdocs using a Memcached deployment to verify the configurations necessary to leverage a cache store.

First I updated the `app-config.production.yaml` to include a cache-store and built the new image to retrieve a commit sha for the deployment. I updated the Helm charts to include a new subchart called `memcached` located in the `helm/lighthouse-developer-portal/charts` directory. This subchart contains a deployment with a single container using the `bitnami/memcached` image as well as a corresponding service to manage traffic to the `memcached` pod. The memcached pod is backed by its own PVC `sandbox-memcached-efs-claim` for handling persistence. I deployed the application to the `lighthouse-bandicoot-sandbox` environment on the `nonprod` cluster for testing. I observed the following:

- All pods in the deployment with all containers ready and `running` status:
```
NAME                                           READY   STATUS    RESTARTS   AGE
pod/lighthouse-dev-portal-sandbox-backend-68fd45fb89-svkk7    2/2     Running   2          41s
pod/lighthouse-dev-portal-sandbox-frontend-7d7895b8f4-6mqvr   2/2     Running   0          41s
pod/sandbox-memcached-7fbb698654-sv8hj         2/2     Running   0          41s
pod/sandbox-postgres-766dfd978b-7p8dw          2/2     Running   0          41s
```
- When selecting a new Techdocs link, Memcached container is able to store to the cache:
```
$ kubectl logs pod/sandbox-memcached-7fbb698654-sv8hj
...
...
...
authenticated() in cmd 0x01 is true
<24 SET techdocs:techdocs:/ZB/TsMpmJOfuxu78H+/Sw== Value len is 1497
```
- When returning to the same link, Memcached container is able to retrieve from the cache:
```
$ kubectl logs pod/sandbox-memcached-7fbb698654-sv8hj
...
...
...
authenticated() in cmd 0x00 is true
<24 GET techdocs:techdocs:/ZB/TsMpmJOfuxu78H+/Sw==
> FOUND KEY techdocs:techdocs:/ZB/TsMpmJOfuxu78H+/Sw==
```

## Recommendations
Update the `app-config.production.yaml`, Helm charts and CI/CD workflow to include the Memcached deployment.

## References

- [Bitnami Memcached Docker Image](https://github.com/bitnami/bitnami-docker-memcached)
- [Backstage](https://backstage.io/)
- [CacheManager](https://github.com/backstage/backstage/blob/master/packages/backend-common/src/cache/CacheManager.ts)
- [CacheClient](https://github.com/backstage/backstage/blob/master/packages/backend-common/src/cache/CacheClient.ts)
- [TechDocsCache](https://github.com/backstage/backstage/blob/master/plugins/techdocs-backend/src/cache/TechDocsCache.ts)
