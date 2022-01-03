# [RFC] Configure Timeouts

**Summary**:

Part of the [12 Factor App](https://cloudposse.com/12-factor-app/) requires that _backing services_ use configurable timeouts on connections and responses from backends.

## Background

[Backstage](https://backstage.io/) does not currently allow configuring timeouts from the `app-config.yml` file. Each request either has a hardcoded timeout, or uses no timeout at all.

## Goal

To use environment variables to configure timeouts on backend requests.

## Findings

Backstage does not support configuring request timeouts using the `app-config.yml`. Most timeouts are either not set, or hardcoded values.

Backstage uses a class called [CatalogClient](https://github.com/backstage/backstage/blob/master/packages/catalog-client/src/CatalogClient.ts#L48) that is in charge of making requests related to the catalog. The `CatalogClient` accepts two parameters, a `DiscoveryApi` and a `FetchApi`.

Embark initializes `CatalogClient` within the [scaffolder](https://github.com/department-of-veterans-affairs/lighthouse-backstage/blob/configure-timeouts/packages/backend/src/plugins/scaffolder.ts#L18) on the backend. Currently, it only passes a parameter for the `DiscoveryApi` and so the `FetchApi` is defaulted to use [cross-fetch](https://www.npmjs.com/package/cross-fetch).

## Recommendations

I believe that we could create our own timeout by importing `cross-fetch`, wrapping it in a `fetchWithTimeout` function, and passing that to `CatalogClient`. I found an example on StackOverflow, [here](https://stackoverflow.com/questions/46946380/fetch-api-request-timeout). The solution could look like something below.

```js
import fetch from 'cross-fetch';

export default function (url, options, timeout = 10000) {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error('timeout')), timeout);
    }),
  ]);
}
```

## References

- [12 Factor App](https://cloudposse.com/12-factor-app/)
- [Backstage](https://backstage.io/)
- [CatalogClient](https://github.com/backstage/backstage/blob/master/packages/catalog-client/src/CatalogClient.ts#L48)
- [scaffolder](https://github.com/department-of-veterans-affairs/lighthouse-backstage/blob/configure-timeouts/packages/backend/src/plugins/scaffolder.ts#L18)
- [cross-fetch](https://www.npmjs.com/package/cross-fetch)
- [StackOverflow](https://stackoverflow.com/questions/46946380/fetch-api-request-timeout)
