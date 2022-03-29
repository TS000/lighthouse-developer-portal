# Overview

The Lighthouse developer portal is an implementation of [Backstage](https://backstage.io/). Adding entities to the Lighthouse catalog allows you to manage and maintain all the software your team owns and make it discoverable to other VA teams. The Lighthouse catalog works by storing metadata YAML files with the code and visualizing them in the Lighthouse developer portal.

Learn more about the [software catalog](https://backstage.io/docs/features/software-catalog/software-catalog-overview) in the Backstage documentation or <a href="/catalog-import.htm">add an entity to the Lighthouse catalog</a>. You can also learn more in these sections:

- [Adding a catalog entity](#adding-a-catalog-entity)
- [Creating a catalog entity descriptor file](#creating-a-catalog-entity-descriptor-file)
- [Adding an existing catalog entity descriptor file](#adding-an-existing-catalog-entity-descriptor-file)
- [Adding TechDocs](#adding-techdocs)

# Adding a catalog entity
In the Lighthouse developer portal, you can <a href="/catalog-import.htm">add entities manually</a>, including files, repositories, and [TechDocs](#adding-techdocs). To do this, you'll need to [create a catalog entity descriptor file](##creating-a-catalog-entity-descriptor-file) or [add an existing one](##add-an-existing-gatalog-entity-descriptor-file).

## Creating a catalog entity descriptor file

In the root directory of your application, create a `catalog-info.yaml` file.

- Learn about the [format for catalog entity descriptor files](https://backstage.io/docs/features/software-catalog/descriptor-format)
- Refer to [examples of catalog entity descriptor files](https://github.com/backstage/backstage/tree/master/packages/catalog-model/examples)

## Adding an existing catalog entity descriptor file

To add an entity, you'll need to link to the code source. You can link to an existing file, repository, or TechDoc. The <a href="/catalog-import.htm">catalog import wizard</a> will confirm if the entity was added correctly or if there was an error.

It may take up to 10 minutes for a newly registered entity to appear in a search of the catalog. You can verify the entity was added by <a href="/catalog?filters%5Bkind%5D=api&filters%5Buser%5D=all.htm">searching the catalog</a>.

From here, you can:
- <a href="/catalog-import.htm">Add an entity to the catalog</a>
- [Learn about adding TechDocs](#adding-techdocs)
- <a href="/catalog?filters%5Bkind%5D=api&filters%5Buser%5D=all.htm">Search the Lighthouse catalog</a> or [learn how to search the catalog](https://backstage.io/docs/features/software-catalog/software-catalog-overview#finding-software-in-the-catalog)
- Learn more about the [lifecycle of an entity](https://backstage.io/docs/features/software-catalog/life-of-an-entity)

# Adding TechDocs
The TechDocs solution transforms documentation in your repository from markdown files into a bundle of static files (HTML, CSS, JSON, etc.) that can be rendered inside the Lighthouse developer portal.

Publish your team's TechDocs by referencing a <a href="/docs/lighthouse-bandicoot/component/lighthouse-github-actions/#techdocs-action.htm">TechDocs action</a> in your workflow. This action works by creating a [Kubernetes job](https://github.com/department-of-veterans-affairs/lighthouse-github-actions/blob/main/example-techdocs-job.yaml) that will first pull a git repository, then run the 'techdocs-cli' to generate and publish your TechDocs to the Lighthouse S3 bucket. You can add the action to an existing CI/CD workflow or add it as a standalone workflow triggered only when the `docs` directory is updated.

- <a href="/docs/lighthouse-bandicoot/component/lighthouse-github-actions/#techdocs-prerequisites.htm">TechDocs prerequisites</a>
- <a href="/docs/lighthouse-bandicoot/component/lighthouse-github-actions/#usage.htm">TechDocs usage example</a>
- <a href="/docs/lighthouse-bandicoot/component/lighthouse-github-actions/#examples.htm">TechDocs example workflow</a>

- [Lighthouse TechDocs action] LINK TO DOC
- [Techdocs GHA Prerequisites](#techdocs-gha-prerequisites) LINMK TO DOC
- [Techdocs GHA Usage](#techdocs-gha-usage) LINK TO USAGE
- [Example Workflow](#example-workflow) LINK TO DOC

If you're ready, you can add your TechDocs from the <a href="/catalog-import.htm">catalog import wizard</a> in the portal or learn more about the [Backstage TechDocs solution](https://backstage.io/docs/features/techdocs/techdocs-overview).

# Plugins

## GraphiQL

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
