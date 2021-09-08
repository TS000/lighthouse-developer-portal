# Running Pulumi to Deploy FE to Kubernetes

## Through Codespaces
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