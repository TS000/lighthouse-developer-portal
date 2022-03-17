# Catalog Entry Best Practices

This is a `best practices` guide to setting up catalog entries for the Lighthouse developer portal. It covers the most frequently-used or suggested setup for the catalog `yaml` file. For more in-depth coverage, you can review [Backstage YAML file format](https://backstage.io/docs/features/software-catalog/descriptor-format) documentation.

Usually named `catalog-info.yaml`, the `yaml` file used for catalog configurations can have any name.

The following is an example of a descriptor file for an entity with the Kind of Component:

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: artist-web
  description: The place to be, for great artists
  labels:
    example.com/custom: custom_label_value
  annotations:
    example.com/service-discovery: artistweb
    circleci.com/project-slug: github/example-org/artist-website
  tags:
    - java
  links:
    - url: https://admin.example-org.com
      title: Admin Dashboard
      icon: dashboard
spec:
  type: website
  lifecycle: production
  owner: artist-relations-team
  system: public-websites
```

The root fields `apiVersion`, `kind`, `metadata`, and `spec` are part of the **envelope**, defining the overall structure of all kinds of entities. Some metadata fields like `name`, `labels`, and `annotations` are of particular significance and have reserved purposes and distinct shapes.

## kind [required]

The high-level entity type.

Also known as _System Models_, additional information can be found in [Backstage documentation](https://backstage.io/docs/features/software-catalog/system-model). Software within the catalog can fit into three common kinds of entities:

- _Component_ - Individual pieces of software
- _API_ - Boundaries between different components
- _Resource_ - Physical or virtual infrastructure needed to operate a component

In ecosystems that are very complex and include many components, APIs, and resources in the catalog, there are two additional kinds that can help make sense of relationships between entitites:

- _System_ - Collection of entities that cooperate to perform some function
- _Domain_ - Relates entities and systems to part of the business

## apiVersion [required]

The version of specification format for that particular entity that the specification is made against. The tuple of `apiVersion` and `kind` should be enough for a parser to know how to interpret the contents of the rest of the data.

Early catalog versions will be using alpha/beta versions, e.g., `backstage.io/v1alpha1`, to signal that the format may still change. When Backstage core is promoted to 1.0, catalog versions will use `backstage.io/v1` and up.

## metadata [required]

A structure containing metadata about the entity: these aren't directly part of the entity specification itself.

### name [required]

The name of the entity. The name is also used to identify a given entity when other items in the catalog have relationships references to it. Names must be unique per `kind` within a given namespace (if specified) at any point in time. The uniqueness constraint is case-sensitive.

Names have two requirements:

- Strings of length at least 1, and at most 63
- Must consist of sequences of `[a-z0-9A-Z]` possibly separated by one of `[-_.]`

### namespace [optional]

Namespaces are optional but highly recommended, especially if you will be generating TechDocs. The namespace field must match the team-name field passed to the techdocs-webhook GitHub action.

See [Backstage documentation](https://backstage.io/docs/features/software-catalog/descriptor-format#namespace-optional) for more information.

### title [optional]

A `title` can also be used to represent the entity when available. The title can be helpful when the `name` is cumbersome or perceived as overly technical. There are no requirements on this field, but it should be short and simple.

### description [optional]

A human-readable description of the entity. It should be brief and informative.

### labels [optional]

Labels are optional key/value pairs attached to the entity, and their use is identical to [Kubernetes object labels](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/).

Their primary purpose is for references to other entities, and for information that is in one way or another classifying the current entity. They are often used as values in queries or filters.

Values are strings that follow the same restrictions as `name`.

### annotations [optional]

An object with arbitrary non-identifying metadata attached to the entity, identical in use to [Kubernetes object annotations](https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations/). Their purpose is mainly, but not limited to, referencing external systems.

You can also review [Backstage's list of well-known annotations](https://backstage.io/docs/features/software-catalog/well-known-annotations).

It's possible to add a Datadog Graph and/or Dashboard to entities by following the guide at the end of [this document](#datadog). This plugin will only apply to specific kinds. Component, API, System, and Domain.

### tags [optional]

A list of single-valued strings, for example, to classify catalog entities in various ways. This is different from the labels in metadata, as labels are key-value pairs.

### links [optional]

A list of external hyperlinks related to the entity. Links can provide additional reference information to external content and resources.

Fields of a link are:

- **url**: [required] - A `url` in a standard `uri` format. (https://example.com)
- **title**: [optional] - A user friendly display name for the link
- **icon**: [optional] - A key representing a visual icon to be displayed in the UI

> Note: The icon field value is meant to be a semantic key that will map to a specific icon in material-ui icons. The default icon, also used for fallback if a mapping cannot be resolved, is the `language` icon.

## spec [varies]

Data that describes the entity. The structure of spec is dependent on the `apiVersion` and `kind` combination. Some might not have a spec at all.

# spec Fields for Different Kinds

The following information covers the fields specific to particular kinds of entity, focusing on the most common `kind` options: `component`, `template`, `API`, and `location`. Fields for additional `kind` options can be found in [Backstage documentation](https://backstage.io/docs/features/software-catalog/descriptor-format).

## relations [all]

The `relations` root field is a read-only list of references between the current entity and other entities. More information can be found in [Backstage documentation](https://backstage.io/docs/features/software-catalog/well-known-relations).

The fields of a relation are:

- **target**: A [compound reference] to the other end of the relation
- **type**: The type of relation FROM a source entity TO the target entity

## status [all]

The `status` root object is a read-only set of statuses about the current state of health of the entity, described in [Backstage's well-known statuses](https://backstage.io/docs/features/software-catalog/well-known-statuses) documentation.

The only defined field is the `items` array. Each item describes some aspect of the entity's state, as seen from the point of view of some specific system. The current primary use case for this field is for the ingestion processes for the catalog itself to convey information about errors and warnings back to the user.

```json
{
  // ...
  "status": {
    "items": [
      {
        "type": "backstage.io/catalog-processing",
        "level": "error",
        "message": "NotFoundError: File not found",
        "error": {
          "name": "NotFoundError",
          "message": "File not found",
          "stack": "..."
        }
      }
    ]
  },
  "spec": {
    // ...
  }
}
```

The fields of a status item are:

- **type** - The type of status as a unique key per source; each type may appear more than once in the array
- **level** - The level/severity of the status item: 'info', 'warning', or 'error'
- **message** - A brief message describing the status intended for human consumption
- **error** - An optional serialized error object related to the status

## Kind: Component

A Component describes a software component. It is typically intimately linked to the source code that constitutes the component and should be what a developer may regard a "unit of software," usually with a distinct deployable or linkable artifact.

This section covers the `required` fields for Components. Additional fields can be found in [Backstage documentation](https://backstage.io/docs/features/software-catalog/descriptor-format#kind-component).

### spec.type [required]

The software catalog accepts any value, but developers should be intentional about values used for this field, as the Lighthouse developer portal will read this field and behave differently depending on its value.

The current set of well-known and standard values for this field is:

- **service** - A backend service, typically exposing an API
- **website** - A website
- **library** - A software library, such as an npm module or a java library

If you have a unique type that you would like to be displayed in the Lighthouse software catalog in a particular way, please submit feedback as an issue in GitHub or use the feedback form within the Lighthouse developer portal.

### spec.lifecycle [required]

The lifecycle state of the component.

The current set of well-known and common values for this field is:

- **experimental** - An experiment or early, non-production component, signaling that users may not prefer to consume it over other more established components or that there are low or no reliability guarantees
- **production** - An established, owned, maintained component
- **deprecated** - A component that is at the end of its lifecycle and may disappear at a later point in time

### spec.owner [required]

An [entity reference](https://backstage.io/docs/features/software-catalog/references#string-references) to the owner of the component, i.e. a singular entity (commonly a team) that bears ultimate responsibility for the component and has the authority and capability to develop and maintain it.

## Kind: Template

A complete list of `kind: Template` specific fields can be found in [Backstage documentation](https://backstage.io/docs/features/software-catalog/descriptor-format#kind-template).

### spec.type [required]

The type of component created by the template. See `spec.type` above. The available options are `website`, `service` and `library`.

### spec.parameters [required]

These are template variables that can be modified in the frontend as a sequence. It can either be one Step if you want one extensive list of different fields in the frontend, or it can be broken up into multiple extra steps, rendered as additional steps in the scaffolder plugin frontend.

You can learn more about writing templates in [Backstage documentation](https://backstage.io/docs/features/software-templates/writing-templates).

## Kind: API

A complete list of `kind: API` specific fields can be found in [Backstage documentation](https://backstage.io/docs/features/software-catalog/descriptor-format#kind-api).

### spec.type [required]

The type of the API definition as a string. The software catalog accepts any kind of value, but the Lighthouse developer portal understands the following set of well-known and common values for this field:

- **openapi** - An API definition in YAML or JSON format based on the [OpenAPI](https://swagger.io/specification/) v2 or v3 spec.
- **asyncapi** - An API definition based on the [AsyncAPI](https://www.asyncapi.com/docs/specifications/v2.2.0) spec.
- **graphql** - An API definition based on [GraphQL schemas](https://spec.graphql.org/) for consuming GraphQL based APIs.
- **grpc** An API definition based on [Protocol Bufferes](https://developers.google.com/protocol-buffers) to use with [gRPC](https://grpc.io/).

Again, if you have a unique type not covered by this list, please submit feedback.

### spec.lifecycle [required]

The lifecycle state of the API. It can be `experimental`, `production`, or `deprecated. See the lifecycle definition within `kind: Component` for further information.

### spec.owner [required]

An [entity reference](https://backstage.io/docs/features/software-catalog/references#string-references) to the owner of the component, e.g. artist-relations-team. This field is required.

### spec.definition [required]

The definition of the API, based on the format defined by `spec.type`.

## Kind: Location

A location is a marker that references other places to look for catalog data.

Locations can also be defined within the `app-config` file.

Example:

```yaml
apiVersion: backstage.io/v1alpha1
kind: Location
metadata:
  name: org-data
spec:
  type: url
  targets:
    - http://github.com/myorg/myproject/org-data-dump/catalog-info-staff.yaml
    - http://github.com/myorg/myproject/org-data-dump/catalog-info-consultants.yaml
```

### spec.type [optional]

The single location type, that's common to the targets specified in the spec. If it is left out, it is inherited from the location type that originally read the entity data.

### spec.target [optional]

A single target as a string. Can be either an absolute path/URL (depending on the type), or a relative path such as `./details/catalog-info.yaml` which is resolved relative to the location of this Location entity itself.

### spec.targets [optional]

A list of targets as strings. They can all be either absolute paths/URLs (depending on the type), or relative paths such as `./details/catalog-info.yaml` which are resolved relative to the location of this Location entity itself.

# Plugins
## Datadog

This plugin allows catalog entities to include a datadog dashboard, and/or graph within the entity view.

First, specify the datadog domain. This can be done by adding a new annotation to the `catalog-info.yaml` file. By default the datadog domain is set to `datadoghq.eu`.

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: example-component
  description: 'The coolest example that also has a datadog dashboard'
  annotations:
    datadoghq.com/site: datadoghq.com
```

### Dashboard

A complete datadog dashboard can be included within a catalog entity view. This will show up as a tab that can be clicked similar to "overview" and "docs". In order to include a dashboard you must get the dashboard share URL.

Steps to get the dashboard URL and add it to the `catalog-info.yaml` file.

- Login to your Datadog account.
- Navigate to the desired dashboard and click into it.
- Click the `settings` cog on the screen's upper right-hand side.
- Copy the URL from the sharing section.
- Add the URL to the `datadoghq.com/dashboard-url` annotation within the `catalog-info.yaml` file.

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: example-component
  description: 'The coolest example that also has a datadog dashboard'
  annotations:
    datadoghq.com/site: datadoghq.com
    datadoghq.com/dashboard-url: << DASHBOARD_URL >>
```

### Graph

A single graph from a dashboard can be included within the catalog entity overview page. The graph will be shown next to the general info card where the list of links is usually listed.

Steps to get the graph token and add it to the `catalog-info.yaml` file.

- Login to your Datadog account.
- Navigate to the dashboard that contains the graph and click into it.
- Click on the pencil icon shown in the upper-right section of the graph, it should open up a modal.
- Locate the `Share` tab and click it.
- Choose an option for `time frame`, `graph size`, and`include the legend`. (Note: Graph sizes won't be applied unless a `graph-size` annotation is added, otherwise the default is medium.)
- Click `Generate Embed Code`, and copy the listed token.
- Add the token to the `datadoghq.com/graph-token` annotation within the `catalog-info.yaml` file.

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: example-component
  description: 'The coolest example that also has a datadog dashboard'
  annotations:
    datadoghq.com/site: datadoghq.com
    datadoghq.com/graph-token: << GRAPH_TOKEN >>
    # Add if you want a graph size other than medium. Excepted options: "small", "medium", "large", and "x-large"
    datadoghq.com/graph-size: medium
```
