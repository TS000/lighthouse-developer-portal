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

## Techdocs

- Intro  
[Techdocs](https://backstage.io/docs/features/techdocs/techdocs-overview) is how documentation is created in backstage. It uses yaml files to generate easy to use html pages.


- Teams
  The Embark team has decided it's best for each team to maintain their own documentation. Below are examples of a github action and a kubernetes configuration file that can be used and or modified based on each teams needs.

  [publish-and-build-documentation.yaml](https://github.com/department-of-veterans-affairs/embark-deployment/blob/main/.github/workflows/build-and-publish-documentation.yaml)

  ```
  name: Build and publish backstage documentation

  on:
    push:
      branches:
      - main
    workflow_dispatch:

  jobs:
    build-and-publish:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v2
        - name: Set K8s context
          uses: azure/k8s-set-context@v1
          with:
            method: kubeconfig
            kubeconfig: ${{ secrets.KUBE_CONFIG }}
        - name: Set namespace
          run: kubectl config set-context --current --namespace=lighthouse-bandicoot-dev
        - name: Build and publish - embark
          run: kubectl apply -f techdocs/embark-techdocs.yaml
        - name: Build and publish - embark-deployment
          run: kubectl apply -f techdocs/embark-deployment-techdocs.yaml
  ```
  In this example the github action is using kubectl to run the kubernetes [embark-deployment-techdocs.yaml](https://github.com/department-of-veterans-affairs/embark-deployment/blob/main/techdocs/embark-techdocs.yaml) configuration file.

  Each user will need to update the args section in the kubernetes file to reflect their own repo information:

  ```
  args:
      - "--repo=https://github.com/department-of-veterans-affairs/lighthouse-embark"
      - "--branch=main"
      - "--depth=1"
      - "--one-time"
  ```

- Private/Internal repos

  If using a private or internal repo, the user will need to add a `imagePullSecrets` property as shown below:

  [embark-deployment-techdocs.yaml](https://github.com/department-of-veterans-affairs/embark-deployment/blob/main/techdocs/embark-deployment-techdocs.yaml#L62)

  ```
  imagePullSecrets:
  - name: dockerconfigjson-ghcr
  ```

- --entity value

  After generating a TechDocs site using techdocs-cli generate, use the publish command to upload the static generated files on a cloud storage (AWS/GCS) bucket or (Azure) container which your Backstage app can read from.

  The value for --entity must be the Backstage entity which the generated TechDocs site belongs to. You can find the values in your Entity's catalog-info.yaml file. If namespace is missing in the catalog-info.yaml, use default. The directory structure used in the storage bucket is namespace/kind/name/<files>.

  Note that the values are case-sensitive. An example for --entity is default/Component/<entityName>.

  [check here](https://backstage.io/docs/features/techdocs/cli#publish-generated-techdocs-sites) for more information