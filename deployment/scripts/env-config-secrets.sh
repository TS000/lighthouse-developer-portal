#!/bin/bash

# Creates yaml files for Embark deployment based on environment in an Overlay directory
# The 'overlay' directory composes resources using the 'base' directory with additional customization on top of them (i.e. configmaps, secrets, and patches)

set -e

export BASE_DIR="../overlays/${DEPLOY_ENV}"

case $DEPLOY_ENV in

dev | qa | sandbox ) # nonprod environment

# Creates overlay directory and subdirectory for the deployment environment
mkdir -p $BASE_DIR

# Used by Kustomize to define all of the resources that will be created for this deployment
cat <<EOF >${BASE_DIR}/kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
commonLabels:
  instance: ${DEPLOY_ENV}-embark

bases:
- ../../base

namePrefix: ${DEPLOY_ENV}-

resources:
- virtualservice.yaml

configMapGenerator:
- name: configmap
  literals:
  - APP_CONFIG_app_baseUrl=https://${DEPLOY_ENV}.devportal.name
  - APP_CONFIG_backend_baseUrl=https://${DEPLOY_ENV}.devportal.name
  - APP_CONFIG_backend_listen_port="7007"
  - APP_CONFIG_backend_cors_origin=https://${DEPLOY_ENV}.devportal.name
  - APP_CONFIG_auth_environment=${DEPLOY_ENV}

secretGenerator:
- name: gh-secrets
  literals:
  - GH_TOKEN=${GH_TOKEN}
  - GH_CLIENT_ID=${GH_CLIENT_ID}
  - GH_CLIENT_SECRET=${GH_CLIENT_SECRET}
- name: postgres-secrets
  literals: 
  - POSTGRES_USER=${POSTGRES_USER}
  - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
  - POSTGRES_DB=${POSTGRES_DB}

patchesStrategicMerge:
- backend_patch.yaml
- frontend_patch.yaml
EOF

# Creates Secret for Docker config json to pull image from GHCR
cat <<EOF >${BASE_DIR}/ghcr_secrets.yaml
apiVersion: v1
kind: Secret
type: kubernetes.io/dockerconfigjson
metadata:
  name: "dockerconfigjson-ghcr"
  labels:
    name: dockerconfig
data:
  .dockerconfigjson: ${DOCKERCONFIGJSON}
EOF

# Creates virtualService with environment specific changes
cat <<EOF >${BASE_DIR}/virtualservice.yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: embark-virtualservice
spec:
  hosts:
  - ${DEPLOY_ENV}.devportal.name
  gateways:
  - istio-system/${DEPLOY_ENV}-devportal-name-gateway
  http:
  - match:
    - uri:
        prefix: /api/
    route:
    - destination:
        host: "${DEPLOY_ENV}-backend-service"
        port: 
          number: 7007
  - match:
    route:
    - destination:
        host: "${DEPLOY_ENV}-frontend-service"
        port: 
          number: 8000
EOF

# Patches backend deployment with image tag and the command to run when the container starts 
cat <<EOF >${BASE_DIR}/backend_patch.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
spec:
  template:
    spec:
      containers:
      - name: backend 
        image: "ghcr.io/department-of-veterans-affairs/lighthouse-backstage/backend:${COMMIT_SHA}"
        args:
            - -c
            - >-
                node packages/backend --config app-config.yaml --config app-config.${DEPLOY_ENV}.yaml | sed -u -r "s/\x1B\[([0-9]{1,3}(;[0-9]{1,2})?)?[mGK]//g" >> /var/log/backend.log
EOF

# Patches frontend deployment with image tag 
cat <<EOF >${BASE_DIR}/frontend_patch.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
spec:
  template:
    spec:
      containers:
      - name: frontend 
        image: "ghcr.io/department-of-veterans-affairs/lighthouse-backstage/frontend:${COMMIT_SHA}"
EOF
;;
prod)
    # production environment
    echo 'prod env'
    echo 'Doing nothing...'
;;
*)
    # default
    echo 'Unknown environment...'
    echo 'Are environment variables set up correctly?'
    exit 1
;;
esac
