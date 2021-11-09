# Overview

The Backstage Software Catalog is a centralized system that keeps track of ownership and metadata for all the software in your ecosystem (services, websites, libraries, data pipelines, etc). The catalog is built around the concept of metadata YAML files stored together with the code, which are then harvested and visualized in Backstage.

More Information about Backstage's [Software Catalog](https://backstage.io/docs/features/software-catalog/software-catalog-overview)


# Adding a Catalog Entity
Backstage identifies catalog entities by scanning every repository in an organization and looking for a `catalog-info.yaml` file in the root of the repository. The `catalog-info.yaml` file is a Catalog Entity Descriptor file is not only used to identify which repositories contain Catalog Entities, but it is also used to provide helpful information for other Backstage users who may wish to use your application.
## Creating an Entity Descriptor File
In the root directory of your application, create a `catalog-info.yaml` file:

```
# Example catalog-info.yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: lighthouse-backstage
  description: An example of a Backstage application.
  annotations:
    backstage.io/techdocs-ref: url:https://github.com/department-of-veterans-affairs/lighthouse-backstage
    github.com/project-slug: department-of-veterans-affairs/lighthouse-backstage
spec:
  type: website
  owner: 
  lifecycle: experimental
```

## Navigate to Catalog on Developer Portal
TODO: Instructions on how to access developer portal

<img src="https://raw.githubusercontent.com/department-of-veterans-affairs/lighthouse-backstage/main/docs/images/catalog_view.png" alt="Catalog View" style="height: 75%; width: 75%" />

## Search Catalog
Search the Catalog to verify your application has been added to the Catalog.

<img src="https://raw.githubusercontent.com/department-of-veterans-affairs/lighthouse-backstage/main/docs/images/catalog_filtered_view.png" alt="Catalog Filtered View" style="height: 75%; width: 75%" />

## View Catalog Entity
Once you find the new entry to the Catalog, you can select it to view more detailed information about the application.

<img src="https://raw.githubusercontent.com/department-of-veterans-affairs/lighthouse-backstage/main/docs/images/catalog_entity.png" alt="Catalog Entity" style="height: 75%; width: 75%" /> 


## Additional Configuration Information
Visit Backstage's [documentation](https://backstage.io/docs/features/software-catalog/descriptor-format) for more information about how to format catalog entity descriptor files.