#!/bin/bash

# Notes for Minikube
#
# This rebuilds the frontend image so minikube/k8s can access the image; must be ran from root
# eval $(minikube docker-env) && docker build -t backstage-frontend -f Dockerfile.dockerbuild .
#
# If K8s is giving you errors with loading an image but can see it in your Docker registry,
# you can check if minikube's Docker registry contains the image by running:
# eval $(minikube docker-env) && docker images

# Notes for Pulumi
# If you get "service not found" error, you can fix it by running(from ./pulumi):
# pulumi destroy -s frontend -y && ./start.sh


user=$(whoami)
if [ "$user" = "vscode" ]
then
minikube=$(docker container ls -f NAME=minikube)
    if [[ "$minikube" == *"minikube"* ]]
    then
    echo "Minikube already running skipping minikube start..."
    else 
    minikube start
    fi
registry=$(eval $(minikube docker-env) && docker images)
    if [[ "$registry" == *"frontend"* ]]
    then
    echo "Found frontend image in minikube's Docker registry..."
    else
    echo "Minikube can't access your frontend image, rebuilding now..."
    cd .. && eval $(minikube docker-env) && docker build -t backstage-frontend -f Dockerfile.dockerbuild . && cd ./pulumi
    fi
pulumi up -s frontend --yes && kubectl apply -f "rendered/1-manifest" && kubectl port-forward svc/frontend-svc 3000:3000
fi