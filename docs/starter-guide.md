# Overview

The Lighthouse developer portal is an implementation of [Backstage](https://backstage.io/). Adding entities to Lighthouse catalog allows you to manage and maintain all the software your team owns and make it discoverable to other VA teams. The Lighthouse catalog works by storing metadata YAML files with the code and visualizing them in the Lighthouse developer portal. 

Learn more about the [software catalog](https://backstage.io/docs/features/software-catalog/software-catalog-overview) in the Backstage documentation or add to the catalogue. LINK TO PAGE HERE. 

INSERT TABLE OF CONTENTS--MODIFY THIS
- [Techdocs Overview](#techdocs-overview)
- [Techdocs Github Action](#techdocs-github-action)
- [Techdocs GHA Overview](#techdocs-gha-overview)
- [Techdocs GHA Prerequisites](#techdocs-gha-prerequisites)
- [Techdocs GHA Usage](#techdocs-gha-usage)
- [Example Workflow](#example-workflow)

# Adding a catalog entity
In the Lighthouse developer portal, you can add entity files LINK, repositories LINK, and TechDocs LINK manually on the Add to catalogue page. LINK TO PAGE HERE. To do this, you'll need to create a catalog entity descriptor file LINK or add an existing one LINK. 

The portal identifies catalog entities by scanning every repository in an organization and looking for a `catalog-info.yaml` file in the root of the repository. The `catalog-info.yaml` file is a catalog entity descriptor file that identifies which repositories contain catalog entities and provides helpful information for others who may wish to use your application. 

## Creating a catalog entity descriptor file

In the root directory of your application, create a `catalog-info.yaml` file. 

- Learn about the [format for catalogue entity descriptor files](https://backstage.io/docs/features/software-catalog/descriptor-format)
- Reference [examples of catalog entity descriptor files](https://github.com/backstage/backstage/tree/master/packages/catalog-model/examples)  

## Adding the catalog entity description file

To add an entity, you'll need to link to the code source. You can link to an existing file, repository, or TechDoc. The Add to catalog wizard will confirm if the entity was added correctly or if there was an error. 

It may take up to 10 minutes for a newly registered catalog to appear in search. You can verify the entity was added by searching the catalog. LINK TO CATALOG 

From here, you can: 
- Add an entity to the catalog LINK TO PORTAL PAGE
- Learn about adding TechDocs LINK TO PAGE IN DOC
- Search the Lighthouse catalog LINK TO PAGE or [learn how to search the catalog](https://backstage.io/docs/features/software-catalog/software-catalog-overview#finding-software-in-the-catalog) 

# Adding TechDocs
The TechDocs solution transforms documentation from markdown files in your repository into a bundle of static files (HTML, CSS, JSON, etc.) that can be rendered inside the Lighthouse developer portal. 

Publish your team's TechDocs by referencing a [Techdocs action](https://github.com/department-of-veterans-affairs/lighthouse-github-actions#lighthouse-github-actions) in your workflow. This action works by creating a [Kubernetes job](https://github.com/department-of-veterans-affairs/lighthouse-github-actions/blob/main/example-techdocs-job.yaml) that will first pull a git repository, then run the 'techdocs-cli' to generate and publish your TechDocs to the Lighthouse S3 bucket. You can add the action to an existing CI/CD workflow or add it as a standalone workflow triggered only when the `docs` directory is updated.

Add your TechDocs from the Add to catalogue page LINK in the portal or learn more about the [Backstage TechDocs solution](https://backstage.io/docs/features/techdocs/techdocs-overview). 

- [Lighthouse TechDocs action] LINK TO DOC
- [Techdocs GHA Prerequisites](#techdocs-gha-prerequisites) LINMK TO DOC
- [Techdocs GHA Usage](#techdocs-gha-usage) LINK TO USAGE
- [Example Workflow](#example-workflow) LINK TO DOC

# Lifecycle of an entity

The main extension points where developers can customize the catalog are:

- _Entity providers_, that feed initial raw entity data into the catalog.
- _Policies_, that establish baseline rules about the shape of entities.
- _Processors_, that validate, analyze, and mutate the raw entity data into its final form.

The high level processes involved are:

- _Ingestion_, where entity providers fetch raw entity data from external sources and seed it into the database.
- _Processing_, where the policies and processors continually treat the ingested data and may emit both other raw entities (that are also subject to processing), errors, relations to tother entities, etc.
- _Stitching_, where all of the data emitted by various processors are assembled together into the final output entity.

Learn more about the [lifecycle of an entity](https://backstage.io/docs/features/software-catalog/life-of-an-entity) in the Backstage docs.
