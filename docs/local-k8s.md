# Deploying Backstage to local Kubernetes Cluster

## Using minikube and Kubernetes

**Prerequisites**

- [Install Minikube](https://minikube.sigs.k8s.io/docs/start/)
- Install Docker Desktop: [Mac](https://docs.docker.com/docker-for-mac/install/), [Windows](https://docs.docker.com/docker-for-windows/install/)
- [Install Kubectl](https://kubernetes.io/docs/tasks/tools/)

## Configure app-config.yaml for postgres service
```
    connection:
      host: ${POSTGRES_SERVICE_HOST}
      port: ${POSTGRES_SERVICE_PORT}
      user: ${POSTGRES_USER}
      password: ${POSTGRES_PASSWORD}
```

## Create images for minikube
> Note: if you already have images in a container registery it is much quicker to use those directly, but if you're making changes locally you'll need to rebuild the images with your new changes and pass those to minikube.

### Modify .dockerignore
- Change .dockerignore to only include these lines:
```
node_modules
packages/*/node_modules
```

### Build image for backend container
```
yarn build && yarn build-image 
```

### Build image for frontend container
```
docker build . -f Dockerfile.dockerbuild --tag frontend
```

## Start up minikube
> Note: Need to have Docker running for minikube to be able to use docker driver
```
minikube start --driver=docker
```

## Load Images for minikube
> Note: Only need to do this if you are rebuilding images locally

- Check the image name or image ID you want to load to minikube with: 
```
docker images
```
- Load the images with:
```
minikube image load <IMAGE_NAME or IMAGE_ID>
```
- Optional: you can verify minikube has access to the local image by checking its docker-env by opening a new terminal and running the commands below. If you don't see the image in the list, then you'll need to load it again or wait for it to finish loading.
```
eval $(minikube docker-env) && docker images
```
- When you're done, be sure to close this terminal or keep track of which terminal this is so you don't accidentally run commands using the docker daemon inside of the VM minikube uses.

## View K8s Dashboard
- Open a new terminal and run: 
```
minikube dashboard
```

## Configure Kubernetes Secrets
- First you must encode the token value with base64: 
```
echo -n "token_string_here" | base64
```
- Copy the encoded value and edit `/k8s/backstage-secrets.yaml` to include the encoded token value:
```
  GITHUB_TOKEN: <BASE64_ENCODED_GITHUB_TOKEN>
```


## Create Kubernetes Deployments/Services
- To create your Kubernetes deployments and services run:
```
kubectl apply -f k8s
```
- Now you can check your deployments, pods, and services using the minikube dashboard.

## Expose and View the Application with minikube tunnel
- Open a new terminal and start minikube tunnel
```
$ minikube tunnel
```
- In a separate terminal, check the service's external ip
```
$ kubectl get svc
NAME         TYPE           CLUSTER-IP       EXTERNAL-IP   PORT(S)                         AGE
backstage-svc   LoadBalancer   10.96.231.234    127.0.0.1     3000:30197/TCP,7000:30343/TCP   3s
postgres     ClusterIP      10.108.231.136   <none>        5432/TCP                        2m6s
```
- View the application running at http://127.0.0.1:3000

**Caveats**
This deployment creates 2 pods: one pod has a single container for the postgres db, and the second pod has 2 containers: one container for the frontend and another container for the backend. Right now with this configuration, `backstage-svc` is created as a LoadBalancer service so it is designated its own IP address that can be exposed with `minikube tunnel`. Running the command `minikube tunnel` creates a network route from the host to the service CIDR of the cluster using the cluster's IP address as a gateway. This exposes the external IP directly to any process running on the host operating system. 

## Running Pulumi to Deploy FE to Kubernetes


### Through Codespaces
1. Switch `.devcontainer` with `.pulumidevcontainer`
    - Run `yarn swap-codespaces` from the root directory to swap devcontainers
    - If a `.pulumidevcontainer` is present, this script will rename `.devcontainer` to `.devcontainer_main` and rename `.pulumidevcontainer` to `.devcontainer`
    - If there is no `.pulumidevcontainer`, then the script will rename `.devcontainer` to `.pulumidevcontainer` and rename `.devcontainer_main` to `.devcontainer`
    - Note: Changing the configuration of the Codespaces container will require the Codespaces container to be rebuilt. **Rebuilding your container will delete any current changes you've made to the container**
2. Rebuild the Codespaces container
    - Use the Command Palette or the Codespaces extension to rebuild the container with the new `.devcontainer`
3. Start Up Pulumi
    - Run `yarn pulumi` from the root directory to use the Pulumi start up script
    - This script will check if minikube is running, check if a frontend image is created and create a frontend image if it doesn't exist. Finally, the script will run the pulumi start up commands to generate & apply k8s manifest files and then forward ports with `kubectl` 
    - After the script finishes, you should be able to see the FE running at localhost:3000
    - Note: this will require creating a Pulumi account 