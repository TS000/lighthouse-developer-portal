// Copyright 2016-2019, Pulumi Corporation.  All rights reserved.
import * as k8s from "@pulumi/kubernetes";
import * as pulumi from "@pulumi/pulumi";

// Minikube does not implement services of type `LoadBalancer`; require the user to specify if we're
// running on minikube, and if so, create only services of type ClusterIP.
const config = new pulumi.Config();
const isMinikube = config.require("isMinikube");

// nginx container, replicated 1 time.
const credSecrets: any = process.env.regcred;
const appName = "frontend";
const appLabels = { app: appName };
const nginx = new k8s.apps.v1.Deployment(appName, {
    metadata: {
        name: "frontend-deployment"
    },
    spec: {
        selector: { matchLabels: appLabels },
        replicas: 1,
        template: {
            metadata: { labels: appLabels },
            spec: { containers: [{ name: appName, image:  "backstage-frontend:latest", imagePullPolicy: "IfNotPresent"}] },
        },
    },
});

// Allocate an IP to the nginx Deployment.
const frontend = new k8s.core.v1.Service(appName, {
    metadata: { name: "frontend-svc", labels: nginx.spec.template.metadata.labels },
    spec: {
        type: isMinikube === "true" ? "ClusterIP" : "LoadBalancer",
        ports: [{ port: 3000, targetPort: 3000, protocol: "TCP" }],
        selector: appLabels,
    },
});

// When "done", this will print the public IP.
export let frontendIp: pulumi.Output<string>;
if (isMinikube === "true") {
    frontendIp = frontend.spec.clusterIP;
} else {
    frontendIp = frontend.status.loadBalancer.ingress[0].ip;
}

export { nginx as fe_deployment, frontend as fe_service };