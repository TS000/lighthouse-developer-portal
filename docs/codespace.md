# Codespace Configuration

## Background

The default image Codespace uses, [mcr.microsoft.com/vscode/devcontainers/universal:1-linux](https://github.com/microsoft/vscode-dev-containers/blob/main/containers/codespaces-linux/.devcontainer/base.Dockerfile), is ~10gb uncompressed. This makes rebuilding the devcontainer while in Codespaces take a long time. A majority of this wait time is unnecessary because we are waiting for files and directories to be rebuilt for tools we don't use.


## Creating a Custom Image

 To reduce our rebuilding wait times, I created a [smaller image](https://github.com/department-of-veterans-affairs/lighthouse-backstage/pkgs/container/lighthouse-backstage%2Fdevcontainer), around ~2gb. 

The new devcontainer image is uploaded to ghcr.io. To be able to access GitHub Packages uploaded to ghcr.io, we need to have some kind of authorization. For Codespaces this is done by creating secrets with a specific naming convention. Once Codespaces has the secrets, you will have [authorization to access a private registry](https://docs.github.com/en/codespaces/codespaces-reference/allowing-your-codespace-to-access-a-private-image-registry#about-private-image-registries-and-codespaces) when pulling Docker images for your Codespace's devcontainer. 

Codespaces looks for any secrets with the following naming convention:
```
<*>_CONTAINER_REGISTRY_SERVER
<*>_CONTAINER_REGISTRY_USER
<*>_CONTAINER_REGISTRY_PASSWORD
```

You can generate a personal access token with the `read:packages` permission to create these secrets for Codespaces:

```
DEV_CONTAINER_REGISTRY_SERVER = ghcr.io
DEV_CONTAINER_REGISTRY_USER = <username>
DEV_CONTAINER_REGISTRY_PASSWORD = <PAT>
```

## Modifying the Image

If we need to make changes in the future, we can modify the `base.Dockerfile` located in `.devcontainer`. It is better to do this process locally rather than from inside a Codespace because you will not be able to cache some or all layers, making the rebuilding process take a much longer time than necessary.

# Rebuilding process

- Navigate to .devcontainer locally
```
$ cd /path/to/workspace/.devcontainer
```

- Make some changes to `base.Dockerfile` to install some new tools 


- Rebuild the image
```
$ docker build -f base.Dockerfile . -t ghcr.io/department-of-veterans-affairs/lighthouse-backstage/devcontainer:latest
```
- [Log into container registry using PAT](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry#authenticating-to-the-container-registry)
```
$ echo CR_PAT=<YOUR_TOKEN>
$ echo $CR_PAT | docker login ghcr.io -u <USERNAME> --password-stdin
> Login Succeeded
```
- Push the image
```
$ docker push ghcr.io/department-of-veterans-affairs/lighthouse-backstage/devcontainer:latest
```
