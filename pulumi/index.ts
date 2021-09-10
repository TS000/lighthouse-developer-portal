import * as k8s from "@pulumi/kubernetes";
import * as kx from "@pulumi/kubernetesx";
import  * as pulumi from "@pulumi/pulumi";
import * as random from "@pulumi/random";

const config = new pulumi.Config();
const isMinikube = config.require("isMinikube");

// Instantiate a Kubernetes Provider and specify the render directory.
const provider = new k8s.Provider("render-yaml", {
    renderYamlToDirectory: "rendered",
});

// Create a Kubernetes PersistentVolumeClaim.
const pvc = new kx.PersistentVolumeClaim("data", {
    spec: {
        accessModes: [ "ReadWriteOnce" ],
        resources: { requests: { storage: "1Gi" } },
    }
}, { provider });

// Create a Kubernetes ConfigMap.
const cm = new kx.ConfigMap("cm", {
    data: { "config": "very important data" },
}, { provider });

// Create a Kubernetes Secret.
const secret = new kx.Secret("secret", {
    stringData: {
        "password": new random.RandomPassword("pw", {
            length: 12}).result,
    }
}, { provider });

// Define a Pod.
const pb = new kx.PodBuilder({
    containers: [{
        env: {
            CONFIG: cm.asEnvValue("config"),
            PASSWORD: secret.asEnvValue("password"),
        },
        image: "backstage-frontend:latest",
        ports: {http: 3000},
        volumeMounts: [ pvc.mount("/data") ],
    }]
});

// nginx container, replicated 1 time.
const credSecrets: any = process.env.regcred;
const appName = "frontend";
const appLabels = { app: appName };
const nginx = new kx.Deployment(appName, {
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
}, { provider });

// Allocate an IP to the nginx Deployment.
const frontend = new kx.Service(appName, {
    metadata: { name: "frontend-svc", labels: nginx.spec.template.metadata.labels },
    spec: {
        type: isMinikube === "true" ? "ClusterIP" : "LoadBalancer",
        ports: [{ port: 3000, targetPort: 3000, protocol: "TCP" }],
        selector: appLabels,
    },
}, { provider });

// When "done", this will print the public IP.
export let frontendIp: pulumi.Output<string>;
if (isMinikube === "true") {
    frontendIp = frontend.spec.clusterIP;
} else {
    frontendIp = frontend.status.loadBalancer.ingress[0].ip;
}