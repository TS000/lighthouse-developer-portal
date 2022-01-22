# Embark Deployment Architecture

## Local Deployment
Local Deployment using Codespaces from the [Embark Deployment Repository](https://github.com/department-of-veterans-affairs/embark-deployment)
```plantuml
package "Local Computer" {
        component LC as "VS Code remote"
    }


cloud "Microsoft Azure" {
    package Codespaces {
        package "Minikube Devcontainer" {
            package "Local Cluster" {
                component [IGW] as "Istio Gateway"
                package "BE Pod" {
                    component BEC as "BE Container"
                    component BESC as "Istio-proxy"
                    BEC -d- BESC
                }
                package "FE Pod" {
                    component FEC as "FE Container"
                    component FESC as "Istio-proxy"
                    FEC -d- FESC
                }
                package "Postgres Pod" {
                    component PGEC as "Postgres Container"
                    component PGESC as "Istio-proxy"
                    PGEC -d- PGESC
                }
                IGW -r-> BESC
                IGW -r-> FESC
                IGW -r-> PGESC
            }  
        }
    } 
}

[LC] -d-> Codespaces
```
A local computer can connect remotely to a Codespace instance hosted on Microsoft Azure using VS Code using [Embark Deployment Repository](https://github.com/department-of-veterans-affairs/embark-deployment). The Codespace instance creates and runs a devcontainer. The devcontainer is configured to use Minikube to create a local cluster and installs Istio service mesh for this cluster. The Local Deployment was setup to emulate the nonprod deployment using the DI that was provided for us by the DI team.

## Nonprod Deployment
```plantuml

rectangle "TIC" {
    cloud "DSVA AWS" {

        package EKS {

            package "Nonprod Cluster"{
                component IGW as "Istio Gateway"

                package "BE Pod" {
                    component BEC as "BE Container"
                    component BESC as "Istio-proxy"
                    component Logger as "Logger"
                    BEC -d- BESC
                    Logger -d- BESC
                }
                package "FE Pod" {
                    component FEC as "FE Container"
                    component FESC as "Istio-proxy"
                    FEC -d- FESC
                }
                package "Postgres Pod" {
                    component PGEC as "Postgres Container"
                    component PGESC as "Istio-proxy"
                    PGEC -d- PGESC
                }
                IGW -r-> BESC
                IGW -r-> FESC
                IGW -r-> PGESC
                }
        } 
    }
}

```
The Embark Deployment consists of 3 Pods: Backend, Frontend, and Postgres. Each of the pods contains an Istio-Proxy sidecar as part of the Service Mesh. The sidecars act as a proxy to mediate inbound and outbound traffic to each of the pods. The Frontend pod also contains a Nginx Container that serves static files adapted from this [example](https://github.com/backstage/backstage/tree/master/contrib/docker/frontend-with-nginx) from the [Backstage Documentation](https://backstage.io/docs/deployment/docker). The Postgres Pod contains a Postgres container and mostly acts as a dependency for the Backend container(i.e. the Backend container will fail on start up if it cannot make a successful connection to a database). Finally, the Backend Pod is composed of 2 containers: a Backend container running the Embark application, and a BusyBox container that acts as a logger.