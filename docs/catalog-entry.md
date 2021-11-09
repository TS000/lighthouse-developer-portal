# Catalog Entry Best Practices

This is a `best-practices` guide to setting up catalog entries for lighthouse-backstage. It covers the most frequently used or suggested setup for the catalog `yaml` file. For more in-depth coverage, you can check the [Backstage YAML File Format](https://backstage.io/docs/features/software-catalog/descriptor-format) doc.

Usually named `catalog-info.yaml`, the `yaml` file used for catalog configurations can have any name.

The following is an example of a descriptor file for a Component entity:

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

Also known as _System Models_, additional information can be found on the Backstage docs [here.](https://backstage.io/docs/features/software-catalog/system-model) Software within the Backstage catalog can fit into three core entities.

- _Component_ - Individual pieces of software
- _API_ - Boundaries between different components
- _Resource_ - Physical or virtual infrastructure needed to operate a component

An extensive catalog of components, APIs, and resources can be hard to understand as a whole. There are additional categories that can help make sense of an ecosystem.

- _System_ - Collection of entities that cooperate to perform some function
- _Domain_ - Relates entities and systems to part of the business.

## apiVersion [required]

The version of specification format for that particular entity that the specification is made against. The tuple of `apiVersion` and `kind` should be enough for a parser to know how to interpret the contents of the rest of the data.

Early catalog versions will be using alpha/beta versions, e.g., `backstage.io/v1alpha1`, to signal that the format may still change. After that, we will be using `backstage.io/v1` and up.

## metadata [required]

A structure containing metadata about the entity: these aren't directly part of the entity specification itself.

### name [required]

The name of the entity. They are used to recognize the entity along with being used in components to reference the entity. Names must be unique per `kind` within a given namespace (if specified) at any point in time. The uniqueness constraint is case-sensitive.

Names have two requirements:

- Strings of length at least 1, and at most 63
- Must consist of sequences of `[a-z0-9A-Z]` possibly separated by one of `[-_.]`

Namespaces can also be used, see [here](https://backstage.io/docs/features/software-catalog/descriptor-format#namespace-optional)

### title [optional]

A `title` can also be used to represent the entity when available. The title can be helpful when the `name` is cumbersome or perceived as overly technical. There are no requirements on it, but please keep it short.

### description [optional]

A human-readable description of the entity. It should be kept short and informative.

### labels [optional]

Labels are optional key/value pairs attached to the entity, and their use is identical to [Kubernetes object labels](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/).

Their primary purpose is for references to other entities and for information that is in one way or another classifying for the current entity. They are often used as values in queries or filters.

Values are strings that follow the same restrictions as `name`.

### annotations [optional]

An object with arbitrary non-identifying metadata attached to the entity, identical in use to [Kubernetes object annotations](https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations/). Their purpose is mainly, but not limited to, to reference external systems.

You can also view this section of [well-known annotations](https://backstage.io/docs/features/software-catalog/well-known-annotations).

### tags [optional]

A list of single-valued strings, for example, to classify catalog entities in various ways. This is different from the labels in metadata, as labels are key-value pairs.

### links [optional]

A list of external hyperlinks related to the entity. Links can provide additional reference information to external content and resources.

Fields of a link are:

- **url**: [required] - A `url` in a standard `uri` format. (https://example.com)
- **title**: [optional] - A user friendly display name for the link
- **icon**: [optional] - A key representing a visual icon to be displayed in the UI.

> Note: The icon field value is meant to be a semantic key that will map to a specific icon that an icon library may provide (e.g., material-ui icons).

## spec [varies]

Data that describes the entity. The structure of spec is dependent on the `apiVersion` and `kind` combination. Some might not have a spec at all.

# Kinds

The following will talk about fields specific to a `kind`. There are usually `apiVersion` and `kind` requirements for each of these. This article will only cover the most common `kind` templates. That being `component`, `template`, and `API`. Additional `kind` options can be found [here](https://backstage.io/docs/features/software-catalog/descriptor-format).

## relations [all]

The `relations` root field is a read-only list of references between the current entity and other entities. More information can be found [here](https://backstage.io/docs/features/software-catalog/well-known-relations)

The fields of a relation are:

- **target**: A [compound reference] to the other end of the relation.
- **type**: The type of relation FROM a source entity TO the target entity.

## status [all]

The `status` root object is a read-only set of statuses about the current state of health of the entity, described in the [well-known statuses section](https://backstage.io/docs/features/software-catalog/well-known-statuses).

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

- **type** - The type of status as a unique key per source. Each type may appear more than once in the array.
- **level** - The level/severity of the status item: 'info', 'warning', or 'error'
- **message** - A brief message describing the status intended for human consumption.
- **error** - An optional serialized error object related to the status.

## Kind: Component

A Component describes a software component. It is typically intimately linked to the source code that constitutes the component and should be what a developer may regard a "unit of software," usually with a distinct deployable or linkable artifact.

This section covers the `required` fields. Additional fields can be found [here](https://backstage.io/docs/features/software-catalog/descriptor-format#kind-component).

### spec.type [required]

The software catalog accepts any value. Still, an organization should take great care to establish a proper taxonomy for these. Tools, including Backstage itself, may read this field and behave differently depending on its value.

The current set of well-known and standard values for this field is:

- **service** - A backend service, typically exposing an API
- **website** - A website.
- **library** - A software library, such as an npm module or a java library.

### spec.lifecycle [required]

The lifecycle state of the component.

The current set of well-known and common values for this field is:

- **experimental** - An experiment or early, non-production component, signaling that users may not prefer to consume it over other more established components or that there are low or no reliability guarantees.
- **production** - An established, owned, maintained component.
- **deprecated** - A component that is at the end of its lifecycle and may disappear at a later point in time.

### spec.owner [required]

An [entity reference](https://backstage.io/docs/features/software-catalog/references#string-references) to the owner of the component. In Backstage, a component owner is a singular entity (commonly a team) that bears ultimate responsibility for the component and has the authority and capability to develop and maintain it.

## Kind: Template

A complete list of `kind: Template` specific fields can be found [here](https://backstage.io/docs/features/software-catalog/descriptor-format#kind-template).

### spec.type [required]

The type of component created by the template. See `spec.type` above. The available options are `website`, `service` and `library`.

### spec.parameters [required]

These are template variables that can be modified in the frontend as a sequence. It can either be one Step if you want one extensive list of different fields in the frontend, or it can be broken up into multiple extra steps, rendered as additional steps in the scaffolder plugin frontend.

You can find more [here](https://backstage.io/docs/features/software-templates/writing-templates).

## Kind: API

A complete list of `kind: API` specific fields can be found [here](https://backstage.io/docs/features/software-catalog/descriptor-format#kind-api).

### spec.type [required]

The type of the API definition as a string. The software catalog accepts any kind of value, but an organization should take great care to establish a proper taxonomy for these.

The current set of well-known and common values for this field is:

- **openapi** - An API definition in YAML or JSON format based on the [OpenAPI](https://swagger.io/specification/) v2 or v3 spec.
- **asyncapi** - An API definition baesd on the [AsyncAPI](https://www.asyncapi.com/docs/specifications/v2.2.0) spec.
- **graphql** - An API definition based on [GraphQL schemas](https://spec.graphql.org/) for consuming GraphQL based APIs.
- **grpc** An API definition based on [Protocol Bufferes](https://developers.google.com/protocol-buffers) to use with [gRPC](https://grpc.io/).

### spec.lifecycle [required]

The lifecycle state of the API. It can be `experimental`, `production`, or `deprecated. See the lifecycle definition within `kind: Component` for further information.

### spec.owner [required]

An [entity reference](https://backstage.io/docs/features/software-catalog/references#string-references) to the owner of the component, e.g. artist-relations-team. This field is required.

### spec.definition [required]

The definition of the API, based on the format defined by `spec.type`.