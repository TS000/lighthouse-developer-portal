# Deployment (WIP)

## Deployment components overview 

### lighthouse-embark and lighthosue-embark-deployment

```plantuml
package "lighthouse-embark actions" {
  component rel as "release"
}

cloud GitHub {
  component edep as "Deployments"
}

database "GitHub Container Registry" {
  component fe as "Frontend Image"
  component be as "Backend Image"
}

[rel] --> fe: pushes
[rel] --> be: pushes

package "lighthouse-embark-deployment actions" {
  component fdep as "FE deployment"
  component bdep as "BE deployment"
}

database "lighthouse-embark-deployment repo" {
  component fev as "Frontend Values"
  component bev as "Backend Values"
}

[fdep] --> fev: pushes
[bdep] --> bev: pushes
[rel] --> [edep]: creates
[edep] --> [fdep]: triggers
[edep] --> [bdep]: triggers


```

### Argo deployment

```plantuml
left to right direction

database "GitHub Container Registry" {
  component fe as "Frontend Image"
  component be as "Backend Image"
}

database "lighthouse-embark-deployment repo" {
  component fev as "Frontend Values"
  component bev as "Backend Values"
}


package "Delivery infrastructure" {
  component argo as "Argo"
  component dep as "Kubernetes"
}

[argo] --> fe: reads
[argo] --> be: reads
[argo] --> dep: triggers
[dep] --> [fev]: reads
[dep] --> [bev]: reads
```

### GitHub Deployments detail

```plantuml
left to right direction
cloud GitHub {
  folder dev as "Dev Deployment Values" {
    component dfe as "Frontend image tag"
    component dbe as "Backend image tag"  
  }
  folder qa as "QA Deployment Values" {
    component qfe as "Frontend image tag"
    component qbe as "Backend image tag"  
  }
  folder prod as "Prod Deployment Values" {
    component pfe as "Frontend image tag"
    component pbe as "Backend image tag"  
  }
}

```
*GitHub deployments contain the values needed for each environment specific deployment*

## Deployment process overview
```plantuml
participant "Trigger"
box "lighthouse-backstage"
participant "Create release action" as builder
queue "GitHub" as platform
database "GCR" as storage
end box
box "lighthouse-backstage-deployment"
participant "Deployment action" as depaction
database "Deployment repo" as drepo
end box
box VA Network
participant "ArgoCD" as deployer
participant "EKS" as runner
end box
Trigger -> builder: trigger release
note right
Dev or cron job
end note
group Embark deployment
builder->storage: release Docker images
builder->platform: create deployment
platform->depaction: trigger deploy webhook
depaction-> drepo: commit new deployment
depaction->o platform: create deploy success status
end
group ArgoCD sync
loop ArgoCD sync
    deployer->drepo: get latest deployment
    drepo->deployer: return deployment
end
deployer->runner: run helm chart
else change detected
runner->storage : GET new Docker images
storage->runner : return new Docker images
end
```
- There are two automated processes for deployment:
    - The **Embark deployment** handles the creation and tagging of docker images, the creation of GitHub deployments, and the management of deployment definitions. These processes **push** changes.
    - The **Argo sync** handles the synchronization of deployment definitions between the deployment repo and Kubernetes. These processes **pull** when changes are detected.

### Embark deployment detail
- The deployment repo contains a **values file** for each environment e.g. /dev.yaml.
- The goal of this process is to update the **values file** for the **target environment** with the correct **application version**.
    - ArgoCD (not diagrammed) is configured to use a specific **values file** for each environment
    - The **values file** contains the dynamic elements of the deployment definition such as the **application version**.
- The Docker image has a **version tag** that  Kubernetes uses to select the correct Docker image. This **version tag** is defined in the `templates/deployment.yaml` as `spec.template.spec.containers.image`

```plantuml
(values.yaml) as (val)
(templates/Deployment.yaml) as (template)
(Helm)
(Deployment.yaml) as (output)
val -> Helm
template -> Helm
Helm -> output
output -> (ArgoCD)
```

#### Embark deployment automation

```plantuml
participant "Trigger"
box "lighthouse-backstage"
participant "Create release action" as builder
queue "GitHub" as platform
database "GCR" as storage
end box
box "lighthouse-backstage-deployment"
participant "Deployment action" as depaction
database "Deployment repo" as drepo
end box
Trigger -> builder: trigger release
note right
Developer or cron job
end note
group Embark deployment
builder->storage: release Docker images
else Frontend image change
group Frontend deployment
builder->platform: POST create frontend deployment
note right: dev environment
platform->depaction: POST deploy webhook
depaction-> drepo: commit app version update
depaction->o platform: create deploy success
end
else Backend image change
group Backend deployment
builder->platform: POST create backend deployment
note right: dev environment
platform->depaction: POST deploy webhook
depaction-> drepo: commit app version update
depaction->o platform: POST create deploy success
end
end
```


- _release docker images_:
    - The **Create release action** adds a **version tag** to Docker images using package.json version it was built from.
- _create environment deployment_:
    - The **Create release action** creates a **[deployment](https://docs.github.com/en/rest/guides/delivering-deployments)** in GitHub for the **target environment** and the version in the **version tag**
- _deploy webhook_:
    -  GitHub POSTs to a **deploy webhook** which triggers the **Deployment action**
    - The webhook contains the  **target environment** and **version tag**
- _commit app version update_:
    - The **Deployment action** uses the **target environment** to determine which **values file** to update
    - The **Deployment action** commits an update to the **values file** with the **version tag**
- _create deploy success_:
    - The **Deployment action** creates a deployment success status
## Deployment to dev environment
```plantuml
actor Developer as dev
box "lighthouse-backstage"
participant "Create release action" as builder
queue "GitHub" as platform
database "GCR" as storage
end box
box "lighthouse-backstage-deployment"
participant "Deployment action" as depaction
database "Deployment repo" as drepo
end box
box VA Network
participant "ArgoCD" as deployer
participant "EKS" as runner
end box
dev -> builder: Merge PR into main
group Embark deployment
builder-> drepo: Create dev deployment
end
builder -> dev: Notify
group ArgoCD sync
runner->storage : Sync docker image
storage->runner : Deploy to staging
end
```
*See overview and detail in previous sections for more info*

- The developer goes through the PR process.
    - The CI performs automated validations on the feature branch.
    - A peer reviews and approves the change.
- The developer merges the feature branch.
    - The CI performs automated validations on the _latest commit_ of the main branch.
        - This is done synchronously to avoid race conditions.
- The **Create release action** add a **version tag** to the image using the git commit SHA.
- The **Create release action** creates a deployment using that **version tag** and dev as the **target environment**
- **ArcoCD** syncs the update and the new version is deployed to dev.


## Deployment to staging and production

```plantuml
actor Developer as dev
box "lighthouse-backstage"
participant "Create release action" as builder
queue "GitHub" as platform
database "GCR" as storage
end box
box "lighthouse-backstage-deployment"
participant "Deployment action" as depaction
database "Deployment repo" as drepo
end box
box VA Network
participant "ArgoCD" as deployer
participant "EKS" as runner
end box
builder -> builder: Create Changeset PR
group Embark deployment
builder-> drepo: Create staging deployment
end
builder -> dev: Notify
group ArgoCD sync
runner->storage : Sync docker image
storage->runner : Deploy to staging
end
dev -> builder: Merge release PR
builder-> platform : Publish release notes
group Embark deployment
builder-> drepo: Create production deployment
end
group ArgoCD sync
runner->storage : Sync docker image
storage->runner : Deploy to production
end
```
*See overview and detail in previous sections for more info*

- The **Create release action** is started with a cron job
- The Changeset bot is run and a new release branch and PR are created
- The application version is incremented in `package.json`
- The **Embark deployment** process is triggered.
    - The Docker images are released with the branch commit SHA as the **version tag**
    - This image is deployed to staging.
- The developer merges the release PR
- The **Create release action** creates the release notes.
- The **Embark deployment** process is triggered.
    - The Docker images that were deployed to staging are tagged with the new application version as the **version tag**.
    - **Important**: _The image on production must match the image that was deployed and verified on staging_.
    - This image is deployed to production.

