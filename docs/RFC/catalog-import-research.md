# [RFC] Catalog Import Research

**Summary**:

Users can add GitHub and GitHub Enterprise repositories to the backstage catalog. We need to also check if it's possible to add repositories from other sources like GitLab.

## Background

The GitHub integration supports loading catalog entities from github.com or GitHub Enterprise. Entities can be added to [static catalog configuration](https://backstage.io/docs/features/software-catalog/configuration), registered with the [catalog-import](https://github.com/backstage/backstage/tree/master/plugins/catalog-import) plugin, or [discovered](https://backstage.io/docs/integrations/github/discovery) from a GitHub organization. Users and Groups can also be [loaded from an organization](https://backstage.io/docs/integrations/github/org).

## Goal

Our goal is to allow multiple repository hosting services, like GitHub/GitLab, to import repositories using the catalog-plugin.

## Information

### Integrations

Backstage supports integrations from multiple repository hosting websites. GitHub is supported by default. Integrations are required in order to understand how to retrieve a given URL.

Adding an [integration](https://backstage.io/docs/integrations/) can be done by editing the `app-config.yml` file manually, or adding via the backstage API.

For Example if we had this location within our `app-config.yml` file:

```yml
catalog:
  locations:
    - type: url
      target: https://github.com/backstage/backstage/blob/master/packages/catalog-model/examples/artist-lookup-component.yaml
```

We would also need to list GitHub under integrations.

```yml
integrations:
  github:
    - host: github.com
      token: ${GITHUB_TOKEN}
```

Example adding a [GitLab integration](https://backstage.io/docs/integrations/gitlab/locations):

```yml
integrations:
  gitlab:
    - host: gitlab.com
      token: ${GITLAB_TOKEN}
```

Each integration has options configurations.

- host - The host fo the instance, e.g. github.com
- token (optional) - An authentication token as expected by the host. IF this is no supplied, anonymous access will be used
- apiBaseUrl (optional) - The URL fo the GitHub/GitLab API. For self-hosted installations, it is commonly at `https://<host>/api/`. For gitlab.com, this configuration is not needed as it can be inferred.
- baseUrl (optional) - The base URL for this provider, e.g. `https://gitlab.com`. If this is not provided, it is assumed to be `https://<host>`

> Note: You need to supply either apiBaseUrl or rawBaseUrl or both (except for public GitHub, for which we can infer them). The apiBaseUrl will always be preferred over the other if a token is given, otherwise rawBaseUrl will be preferred.

## Catalog-Plugin

[catalog-plugin](https://github.com/backstage/backstage/tree/master/plugins/catalog-import)

The Catalog Import Plugin provides a wizard to onboard projects with existing catalog-info.yaml files. It also assists by creating pull requests in repositories where no catalog-info.yaml exists.

The plugin can import any `catalog-info.yml` file that is listed within one of our integrations.

> GitHub Only: The plugin can also search for all `catalog-info.yml` files along with analyse, generate a Component Entity, and create pull requests.

## Recommendation

It seems like the best idea would be to add GitHub Enterprise and GitLab to the integrations section of `app-config.yml`. Then, we could provide a way for users to request additional integrations.

Otherwise it doesn't look like we will need to make any updates to the catalog-plugin, or to even create our own. The only reason I could think to add our own is if we want special behavior. Other things like titles, descriptions, and other wording can be changed manually.

## Questions

Q: Do we need to make a catalog import plugin to support multiple instances of GitHub?
A: No, a [catalog-import](https://github.com/backstage/backstage/tree/master/plugins/catalog-import) plugin is already included within backstage.

This plugin provides a wizard to onboard projects with existing `catalog-info.yml` files, or creates a pull request with an example `catalog-info.yml` if none are found.

Integrations from other repositories can be included within the `app-config.yml` config.

Q: How might we support importing catalog entries that aren't in GitHub?
A: Other repository hosting services can be added by adding them to integrations within `app-config.yml`.

For example to add support for GitLab we would add:

```yml
integrations:
  gitlab:
    - host: gitlab.com
      token: ${GITLAB_TOKEN}
```

Q: How does it determine what credentials to use?
A: Credentials are based off of the configuration set in `app-config.yml` or added using the `catalog-import` plugin.

A `token` can be applied for authentication. Anonymous access will be used if none is applied.

Q: Do we need to modify the starter kit UI?
A: I don't believe so.

Per, [Backstage Integrations](https://backstage.io/docs/integrations/)

> Integrations are configured at the root level of app-config.yaml since integrations are used by many Backstage core features and other plugins.
> Each key under integrations is a separate configuration for a single external provider. Providers each have different configuration; here's an example of configuration to use both GitHub and Bitbucket:

```yml
integrations:
  github:
    - host: github.com
      token: ${GITHUB_TOKEN}
  bitbucket:
    - host: bitbucket.org
      username: ${BITBUCKET_USERNAME}
      appPassword: ${BITBUCKET_APP_PASSWORD}
```

Q: Would we have naming conflicts?
A: Yes, but only for specific situations.

Per the Backstage [catalog configuration](https://backstage.io/docs/features/software-catalog/configuration):

> When multiple catalog-info.yaml files with the same metadata.name property are discovered, one will be processed and all others will be skipped. This action is logged for further investigation.
