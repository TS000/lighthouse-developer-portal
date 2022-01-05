# [RFC] Automation with Argo CD

## Summary
Argo CD is a declarative, GitOps tool for providing continuous delivery for Kubernetes. A Git repository acts as the source of truth for the desired state of an application. Argo CD actively monitors the Git repository for changes in the application state. If a change is detected, Argo CD will update the application that is running in the cluster.


## Background
Applications running on Kubernetes Clusters are defined by a set of resources. When updates occur for an application's resources, those resources must be updated in the cluster. Argo CD is a tool that can be used to automate the process of updating an application. 

Argo CD works by monitoring a Git repository that defines the state of an application. The Git repository does not contain the source code for the application but instead contains a set of `.yaml` files for all of the Kubernetes resources that will run on the Kubernetes cluster. Argo CD contains tools to continuously monitor a Git repositories and compare the application state described in the repository with the application state running in the cluster. When changes are made to the `.yaml` files in the Git repository, Argo CD detects the changes and updates the currently running application. 


## Goal
We want to configure a deployment repository to work with Argo CD to automate the deployment process.


## Findings

### Application Manifest
`Application` is a custom resource definition used by Argo CD. It is a Kubernetes resource object representing the deployed application instance in an environment. It is defined by two key pieces of information:

- `source` reference to the desired application state in Git

- `destination` reference to the target cluster and namespace

### Example Application Manifest
Example manifest with the minimal Application spec and an automated syncPolicy:
```
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: guestbook
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/argoproj/argocd-example-apps.git
    targetRevision: HEAD
    path: guestbook
  destination:
    server: https://kubernetes.default.svc
    namespace: guestbook
  syncPolicy:
    automated: {}
```

### Automated Sync Policy
Argo CD uses an application controller to continuously monitor the running application and compare the live state to the target state. The live state is the state of the application that is running in the Kubernetes cluster. The target state is the state of the application described in the Git Repository. When a difference is detected, the application controller will detect an `outOfSync` application state, and with an `automated sync policy` the application controller can take corrective action. It is also responsible for invoking any user defined hooks for lifecycle events( PreSync, Sync, and PostSync). 

Since the Application Controller monitors the current state from the cluster, and the target state from a Git Repository, the pipeline does not need direct access to the Argo CD API server to perform deployments. The pipeline only needs to make commits to a Git repository to update an application manifest file and Argo CD will automatically sync the live state to the target state.

- To configure automated sync run, specify an `automated` syncPolicy using an application manifest:
```
# application_set.yaml
spec:
  syncPolicy:
    automated: {}
```


### Tracking and Deployment Strategies
Argo CD provides different tracking strategies for Git: by branch name(or a symbolic reference), by tracking tags, or by commit pinning. 

Tracking by branch name is considered the least stable as any changes committed to the branch will redeploy the application. Tracking by tag is considered more stable than tracking by branch because this requires some manual judgment as to what constitutes a tag; the application is redeployed when the commit SHA associated with the tag is updated. Tracking by commit pinning is the most restrictive and typically used to control production environments.

## References

[Argo CD Operator Manual](https://argo-cd.readthedocs.io/en/stable/operator-manual/architecture/)

[Application CRD](https://github.com/argoproj/argo-cd/blob/master/manifests/crds/application-crd.yaml)

[Tracking and Deployment Strategies](https://argo-cd.readthedocs.io/en/stable/user-guide/tracking_strategies/#head-branch-tracking)