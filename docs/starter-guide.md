# Overview

The Lighthouse developer portal is an implementation of [Backstage](https://backstage.io/).

The Lighthouse developer portal Software Catalog is a centralized system that keeps track of ownership and metadata for all the software in your ecosystem (services, websites, libraries, data pipelines, etc). The catalog is built around the concept of metadata YAML files stored together with the code, which are then harvested and visualized in the Lighthouse developer portal.

More Information about the Lighthouse developer portal's [Software Catalog](https://backstage.io/docs/features/software-catalog/software-catalog-overview)

# Adding a Catalog Entity

The Lighthouse developer portal identifies catalog entities by scanning every repository in an organization and looking for a `catalog-info.yaml` file in the root of the repository. The `catalog-info.yaml` file is a Catalog Entity Descriptor file is not only used to identify which repositories contain Catalog Entities, but it is also used to provide helpful information for other the Lighthouse developer portal users who may wish to use your application.

Note: It will take up to 10 minutes for a newly registered catalog to appear in search.

## Creating an Entity Descriptor File

In the root directory of your application, create a `catalog-info.yaml` file:

```yaml
# Example catalog-info.yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: frontend
  namespace: lighthouse-bandicoot
  description: The frontend application for the Lighthouse developer portal
  tags:
    - javascript
    - typescript
    - react
  links:
    - url: https://github.com/department-of-veterans-affairs/lighthouse-developer-portal/issues
      title: Issues
      icon: alert
    - url: https://department-of-veterans-affairs.github.io/lighthouse-developer-portal/
      title: Docs
      icon: help
  annotations:
    backstage.io/techdocs-ref: url:https://github.com/department-of-veterans-affairs/lighthouse-developer-portal
    github.com/project-slug: department-of-veterans-affairs/lighthouse-developer-portal
spec:
  type: website
  owner: lighthouse-bandicoot
  lifecycle: experimental
  system: lighthouse-developer-portal
```

## Navigate to Catalog on Developer Portal

TODO: Instructions on how to access developer portal
![Catalog View](https://raw.githubusercontent.com/department-of-veterans-affairs/lighthouse-developer-portal/main/docs/images/catalog_view.png)

## Search Catalog

Search the Catalog to verify your application has been added to the Catalog.
![Catalog Filtered View](https://raw.githubusercontent.com/department-of-veterans-affairs/lighthouse-developer-portal/main/docs/images/catalog_filtered_view.png)

## View Catalog Entity

Once you find the new entry to the Catalog, you can select it to view more detailed information about the application.
![Catalog Entity](https://raw.githubusercontent.com/department-of-veterans-affairs/lighthouse-developer-portal/main/docs/images/catalog_entity.png)

## Additional Configuration Information

Visit Backstage's [documentation](https://backstage.io/docs/features/software-catalog/descriptor-format) for more information about how to format catalog entity descriptor files.

## Techdocs

- [Techdocs Overview](#techdocs-overview)
- [Techdocs Github Action](#techdocs-github-action)
- [Techdocs GHA Overview](#techdocs-gha-overview)
- [Techdocs GHA Prerequisites](#techdocs-gha-prerequisites)
- [Techdocs GHA Usage](#techdocs-gha-usage)
- [Example Workflow](#example-workflow)

## Techdocs Overview

[Techdocs](https://backstage.io/docs/features/techdocs/techdocs-overview) transforms documentation from markdown files in your repository into a bundle of static files(HTML, CSS, JSON, etc.) that can be rendered inside the Internal Developer Portal.

## Techdocs Github Action

The [Lighthouse Github Action](https://github.com/department-of-veterans-affairs/lighthouse-github-actions#techdocs-action) repository contains a Techdocs Action that can be referenced in your own workflows to create and publish your team's Techdocs. The Techdocs Action works by creating a Kubernetes Job that will pull a git repository then run the `techdocs-cli` to generate and publish your Techdocs to the Lighthouse S3 bucket.

You can add the action to an existing CI/CD workflow or add it as a standalone workflow triggered only when the `docs` directory is updated.

This action creates a [Kubernetes Job](https://github.com/department-of-veterans-affairs/lighthouse-github-actions/blob/main/example-techdocs-job.yaml) that will generate and publish your Techdocs for the Lighthouse Internal Developer Portal.

## Techdocs GHA Overview

The Kubernetes Job consists of two containers: a [git-sync](https://github.com/kubernetes/git-sync) container and a `Techdocs` [container](https://github.com/department-of-veterans-affairs/lighthouse-github-actions/pkgs/container/lighthouse-github-actions%2Ftechdocs). The `git-sync` container is an initContainer that pulls a git repository to a shared volume so the Techdocs container has a copy of the repository. The `Techdocs` container then uses the [Techdocs-cli](https://backstage.io/docs/features/techdocs/cli) to generate and publish your documentation to the Lighthouse S3 bucket.

## Techdocs GHA Prerequisites

The root directory of your repository contains:

- [x] a [`catalog-info.yaml`](https://github.com/department-of-veterans-affairs/lighthouse-developer-portal/blob/main/catalog-info.yaml) with a [backstage.io/techdocs-ref](https://backstage.io/docs/features/software-catalog/well-known-annotations#backstageiotechdocs-ref) annotation
- [x] a [`mkdocs.yaml`](https://github.com/department-of-veterans-affairs/lighthouse-developer-portal/blob/main/mkdocs.yml) configuration file
- [x] a [`docs`](https://github.com/department-of-veterans-affairs/lighthouse-developer-portal/tree/main/docs) directory where all your documentation lives

More info about [Entity Descriptor files](https://backstage.io/docs/features/software-catalog/descriptor-format#overall-shape-of-an-entity)

## Techdocs GHA Usage

```yaml
- name: Create Techdocs Job
  uses: department-of-veterans-affairs/lighthouse-github-actions/.github/actions/techdocs@main
  with:
    # Owner and repository where the documentation lives (e.g. department-of-veterans-affairs/lighthouse-developer-portal)
    # Default: ${{ github.repository }}
    repository: ''

    # Name of Entity descriptor file; used to create Entity path (i.e. namespace/kind/name)
    # Default: 'catalog-info.yaml'
    descriptor-file: ''

    # Namespace of the Catalog Entity in the Lighthouse Developer Portal
    # Default: 'default'
    # Note: This value should match the 'metadata.namespace' field in the Entity descriptor file.
    # The 'metadata.namespace' field is arbitrary and does not correspond to an actual Kubernetes namespace.
    # It is recommended to use your team name for the 'metadata.namespace' field to prevent collisions with
    # Catalog Entities from other teams.
    namespace: ''

    # Personal Access Token used for Techdocs Webhook
    # Scopes: Repo
    token: ''
```

## Example Workflow

```yaml
# Example workflow
name: Publish Documentation
on:
  push:
    branches: [main]
    paths: ['docs/*']
jobs:
  create-techdocs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Techdocs webhook
        uses: department-of-veterans-affairs/lighthouse-github-actions/.github/actions/techdocs-webhook@main
        with:
          repository: ${{ github.repository }}
          descriptor-file: 'catalog-info.yaml'
          namespace: 'lighthouse-bandicoot'
          token: ${{ secrets.PAT }}
```

## Lifecycle of an entity

Full docs can be found [here](https://backstage.io/docs/features/software-catalog/life-of-an-entity), the primary points will be covered bellow.

The main extension points where developers can customize the catalog are:

- _Entity providers_, that feed initial raw entity data into the catalog.
- _Policies_, that establish baseline rules about the shape of entities.
- _Processors_, that validate, analyze, and mutate the raw entity data into its final form.

The high level processes involved are:

- _Ingestion_, where entity providers fetch raw entity data from external sources and seed it into the database.
- _Processing_, where the policies and processors continually treat the ingested data and may emit both other raw entities (that are also subject to processing), errors, relations to tother entities, etc.
- _Stitching_, where all of the data emitted by various processors are assembled together into the final output entity.

## Plugins

### GraphiQL

[@backstage/plugin-graphiql](https://github.com/backstage/backstage/tree/master/plugins/graphiql)

The lighthouse-developer-portal includes a GraphiQL tool to browse GraphiQL endpoints. The purpose of the plugin is to provide a convenient way for developers to try out GraphQL queries in their own environment.

You'll need to supply GraphQL with endpoints through the GraphQLBrowse API. This is done by implementing the `graphQlBrowseApiRef` exported by the plugin. Here's an example of how you could expose two GraphQL endpoints in your App:

```js
// Within my-plugin/src/plugin.ts
import { graphQlBrowseApiRef, GraphQLEndpoints } from '@backstage/plugin-graphiql'

// use createApiFactory
export const graphiQlBrowseApiRefConfig = createApiFactory({
  api: graphQlBrowseApiRef,
  deps: { errorApi: errorApiRef, githubAuthApi: githubAuthApiRef },
  factory: ({ errorApi, githubAuthApi }) =>
  GraphQLEndpoints.from([
    // Use the .create function if all you need is a static URL and headers.
    GraphQLEndpoints.create({
      id: 'gitlab',
      title: 'GitLab',
      url: 'https://gitlab.com/api/graphql',
      // Optional extra headers
      headers: { Extra: 'Header' },
    }),
  ]),
});

// Add the API config to the list of APIs within createPlugin
export const examplePlugin = createPlugin({
  id: 'example-plugin',
  routes: {
    root: rootRouteRef,
  },
  apis: [graphiQlBrowseApiRefConfig],
});
```
