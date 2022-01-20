# Overview

Embark is an implementation of [Backstage](https://backstage.io/).

The Embark Software Catalog is a centralized system that keeps track of ownership and metadata for all the software in your ecosystem (services, websites, libraries, data pipelines, etc). The catalog is built around the concept of metadata YAML files stored together with the code, which are then harvested and visualized in Embark.

More Information about Embark's [Software Catalog](https://backstage.io/docs/features/software-catalog/software-catalog-overview)

# Adding a Catalog Entity

Embark identifies catalog entities by scanning every repository in an organization and looking for a `catalog-info.yaml` file in the root of the repository. The `catalog-info.yaml` file is a Catalog Entity Descriptor file is not only used to identify which repositories contain Catalog Entities, but it is also used to provide helpful information for other Embark users who may wish to use your application.

## Creating an Entity Descriptor File

In the root directory of your application, create a `catalog-info.yaml` file:

```yaml
# Example catalog-info.yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: frontend
  namespace: embark
  description: The frontend application for Embark
  tags:
    - javascript
    - typescript
    - react
  links:
    - url: https://github.com/department-of-veterans-affairs/lighthouse-embark/issues
      title: Issues
      icon: alert
    - url: https://department-of-veterans-affairs.github.io/lighthouse-embark/
      title: Docs
      icon: help
  annotations:
    backstage.io/techdocs-ref: url:https://github.com/department-of-veterans-affairs/lighthouse-embark
    github.com/project-slug: department-of-veterans-affairs/lighthouse-embark
spec:
  type: website
  owner: lighthouse-bandicoot
  lifecycle: experimental
  system: embark
```

## Navigate to Catalog on Developer Portal

TODO: Instructions on how to access developer portal
![Catalog View](https://raw.githubusercontent.com/department-of-veterans-affairs/lighthouse-embark/main/docs/images/catalog_view.png)

## Search Catalog

Search the Catalog to verify your application has been added to the Catalog.
![Catalog Filtered View](https://raw.githubusercontent.com/department-of-veterans-affairs/lighthouse-embark/main/docs/images/catalog_filtered_view.png)

## View Catalog Entity

Once you find the new entry to the Catalog, you can select it to view more detailed information about the application.
![Catalog Entity](https://raw.githubusercontent.com/department-of-veterans-affairs/lighthouse-embark/main/docs/images/catalog_entity.png)

## Additional Configuration Information

Visit Backstage's [documentation](https://backstage.io/docs/features/software-catalog/descriptor-format) for more information about how to format catalog entity descriptor files.
