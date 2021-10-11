# Helm

## What does Helm do for us?
Helm is referred to as a "Kubernetes Package Manager", it is a command line tool that creates and installs Helm Charts. Helm Charts provide us with templated versions of the configuration files that describe our kubernetes deployment. In addition to templates, the Chart contains a set of files that define values that will be combined with the templates to generate our Kubernetes files. Using Helm will allow us to deploy to multiple environments without the need to maintain multiple sets of Kubernetes configuration files.

- [Helm Docs](https://helm.sh/docs/chart_template_guide/getting_started/)
## File structure of helm chart
```
.
└── mychart
    ├── Chart.yaml
    ├── values.yaml
    ├── charts/
    └── templates/
        ├── _helpers.tpl
        ├── deployment.yaml
        ├── service.yaml
        ├── ingress.yaml
        ├── configmap.yaml
        └── otherK8smanifestfiles.yaml
```

The `mychart/templates/` directory contains templated versions all the yaml files that will be used for our Kubernetes deployment as well as a `_helpers.tpl` file. Using the `helm install` CLI will use the templates inconjunction with the `Chart.yaml` and `values.yaml` to render the Kubernetes files for deployment.

### values.yaml file
This file contains the default values for a chart. These values may be overridden by users during helm install or helm upgrade.
### Chart.yaml
The Chart.yaml file contains a description of the chart. You can access it from within a template. The `charts/` directory may contain other charts called subcharts. 
### Subcharts
- [More information about subcharts](https://helm.sh/docs/chart_template_guide/subcharts_and_globals/)
```
- A subchart is considered "stand-alone", which means a subchart can never explicitly depend on its parent chart.
- For that reason, a subchart cannot access the values of its parent.
- A parent chart can override values for subcharts.
- Helm has a concept of global values that can be accessed by all charts.
```

### What is _helpers.tpl?
Files that being with `_` inside the `templates/` directory are not rendered to Kubernetes object definitions, but these files are available everywhere within other chart templates for use. This file is default location for `template partials`. 

- Create a partial template containing a block of labels
```
# templates/_helpers.tpl
{{- define "mychart.labels" }}
  labels:
    generator: helm
    date: {{ now | htmlDate }}
{{- end }}
```
- Adding the partial template to the template file
```
# templates/configmap.yaml
{{- define "mychart.labels" }}
  labels:
    generator: helm
    date: {{ now | htmlDate }}
{{- end }}
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
  {{- template "mychart.labels" }}
data:
  myvalue: "Hello World"
  {{- range $key, $val := .Values.favorite }}
  {{ $key }}: {{ $val | quote }}
  {{- end }}
```
- The rendered output:
```
# Source: templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: running-panda-configmap
  labels:
    generator: helm
    date: 2016-11-02
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "pizza"
```
## Using Secrets with Helm

### Passing secrets as command line arguments
Currently I am passing secrets as command line arguments when installing helm charts

**How this works:**
- First I assigned variable names as values for the following <code><b>key</b>: value</code> pairs in the `values.yaml` file:

<pre>
# values.yaml
secrets:
    <b>DOCKERCONFIGJSON</b>: ${DOCKERCONFIGJSON}
    <b>GITHUB_TOKEN</b>: ${GITHUB_TOKEN}
</pre>

- Then these keys are referenced in the `deployment.yaml`:
<pre>
---
kind: Secret
type: kubernetes.io/dockerconfigjson
apiVersion: v1
metadata:
  name: {{ include "lighthouse-backstage.fullname" . }}-dockerconfigjson-ghpkgs
  labels: {{- include "lighthouse-backstage.selectorLabels" . | nindent 8 }}
data:
  .dockerconfigjson: {{ .Values.<b>DOCKERCONFIGJSON</b> }}
---
apiVersion: v1
kind: Secret
metadata:
  name: {{ include "lighthouse-backstage.fullname" . }}-secrets
  labels: {{- include "lighthouse-backstage.selectorLabels" . | nindent 8 }}
type: Opaque
data:
GITHUB_TOKEN: {{ .Values.<b>GITHUB_TOKEN</b> }}
</pre>
> Note: [Kubernetes Secrets](https://kubernetes.io/docs/concepts/configuration/secret/) have different types. The first secret type is `kubernetes.io/dockerconfigjson` which is used for a docker config.json file represented as an encoded string. This is used to provide authentication credentials for accessing a container repository to be able to pull images. More information about creating and encoding the json string: https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/. The second secret is a base64 encoded personal access token used by [Backstage](https://backstage.io/docs/deployment/k8s#creating-the-backstage-instance). 

### Export local variables
Now that the environment variables are mapped to keys, and those keys are referenced in `templates/deployment.yaml`, we need to export the values for these variables
- Create a `.env` file containing your secrets
```
DOCKERCONFIGJSON=<base64 encoded json string>
GITHUB_TOKEN=<base64 encoded github_token>
```
- Export the contents of the file
```
set -o allexport; source .env; set +o allexport
```
- Set the variables when installing the helm chart
```
$ helm install backstage-dev helm/lighthouse-backstage/ --debug --values helm/lighthouse-backstage/values.yaml --namespace lighthouse-bandicoot-dev --set DOCKERCONFIGJSON=$DOCKERCONFIGJSON --set GITHUB_TOKEN=$GITHUB_TOKEN
```
- View deployment
```
$ helm list -n lighthouse-bandicoot-dev
NAME            NAMESPACE                       REVISION        UPDATED                                 STATUS          CHART                           APP VERSION
backstage-dev   lighthouse-bandicoot-dev        1               2021-10-07 07:37:22.4745171 -0700 PDT   deployed        lighthouse-backstage-0.1.0      1.16.0
```

### Other ways to use secrets with Helm 

- [helm-secrets plugin](https://github.com/jkroepke/helm-secrets)

This approach uses SOPS to encrypt a `secrets.yaml` file and seems to be one of the more popular options I found, it is listed on Helms website as well: https://helm.sh/docs/community/related/#helm-plugins

- [Hashicorp's Vault](https://learn.hashicorp.com/tutorials/vault/kubernetes-sidecar)

This is a more "heavy handed" solution. It uses it own set of helm charts to deploy a `vault` pod and a `vault-agent-injector` pod to store and inject secrets into our application pods.