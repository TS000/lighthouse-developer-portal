# Techdocs setup

## Intro

Techdocs is how documentation is created in backstage. It uses yaml files to generate easy to use html pages.


## Teams

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

## Private/Internal repos

If using a private or internal repo, the user will need to add a `imagePullSecrets` property as shown below:

[embark-deployment-techdocs.yaml](https://github.com/department-of-veterans-affairs/embark-deployment/blob/main/techdocs/embark-deployment-techdocs.yaml#L62)

```
imagePullSecrets:
- name: dockerconfigjson-ghcr
```

## --entity value

After generating a TechDocs site using techdocs-cli generate, use the publish command to upload the static generated files on a cloud storage (AWS/GCS) bucket or (Azure) container which your Backstage app can read from.

The value for --entity must be the Backstage entity which the generated TechDocs site belongs to. You can find the values in your Entity's catalog-info.yaml file. If namespace is missing in the catalog-info.yaml, use default. The directory structure used in the storage bucket is namespace/kind/name/<files>.

Note that the values are case-sensitive. An example for --entity is default/Component/<entityName>.

[check here](https://backstage.io/docs/features/techdocs/cli#publish-generated-techdocs-sites) for more information