# [RFC] Docker Image Scanning

## Summary

lighthouse-embark is a public repo. All deployments are available as public packages. We need to ensure that secrets and private environment variables do not get injected into the docker image. We should be able to fail a build/push script that hardcodes secrets into the image definition. We don't want to commit secrets to GitHub packages.

## Background

Each lighthouse-embark deployment is available publicly for anyone to access. This means that if a secret were hardcoded within a docker image, everyone could now see it.

Vulnerability scanning for Docker local images allows developers and development teams to review the security state of the container images and take actions to fix issues identified during the scan, resulting in more secure deployments. Docker Scan runs on the Snyk engine, providing users with visibility into the security posture of their local Dockerfiles and local images.

## Goal

Scan each build/push for vulnerabilities to prevent a deployment from releasing private information to GitHub Packages.

## Findings

### Docker Scan

By default, docker allows an image to be scanned ten times within a month before it requires a free account with [Snyk](https://snyk.io/).

> Docker and Snyk have partnered together to bring security natively into the development workflow by providing a simple and streamlined approach for developers to build and deploy secure containers.

An image can be scanned using Docker Hub or by using `docker scan <image_name>` within the CLI.

Some important tags can be included to limit issues:

- [Excluding the base image](https://docs.docker.com/engine/scan/#excluding-the-base-image). `--exclude-base`
- [View the JSON output](https://docs.docker.com/engine/scan/#excluding-the-base-image). `--json`

The scan checks for known vulnerabilities in public GitHub repos, npm packages and Docker images. So it does not scan for leaked credentials/secrets.

### Credential / Secret scanning

[git-secrets](https://github.com/awslabs/git-secrets) is an open source repo that is designed to prevent passwords and other sensitive information from being committed to a repo.

It scans commits, commit messages, and --no-ff merges to prevent adding secrets into your git repositories. If a commit, commit message, or any commit in a --no-ff merge history matches one of your configured prohibited regular expression patterns, then the commit is rejected.

## Recommendation

### Vulnerability Scanning

I tried building a fresh frontend image using `docker build -t backstage-frontend -f Dockerfile.dockerbuild .` and then scanning it by using `docker scan backstage-frontend`

I think using `docker scan` for our CI/CD pipelines would be an excellent fit for our security needs. The only issue is that we'll need to create a Snyk account for lighthouse-embark to scan Docker images more than ten times a month.

Another thing I found is that scanning the backstage-frontend image returned a large number of issues related to the base image (NGINX). Excluding the base, the image limited the number of issues to just 7, which I think is excellent, and a lot easier to work with.

I wasn't able to find a convenient GH Action that can fail a pipeline for specified criteria. So we might have to build a script that can analyze the JSON output of the docker scan. Otherwise, we could follow [this guide](https://circleci.com/blog/adding-application-and-image-scanning-to-your-cicd-pipeline/) on how to use Snyk to scan our docker image within CI/CD. I don't think it would be too hard to adapt it to use GitHub Actions.

As stated above, Docker Scan / Snyk only checks for KNOWN vulnerabilities reported from other packages. It does not scan for leaked credentials/secrets.

### Git-Secrets

I think that using [git-secrets](https://github.com/awslabs/git-secrets) within a pre-commit hook would be the best route to prevent secrets from being committed to the lighthouse-embark repo. It's pretty easy to hard-code a secret when building a feature or debugging an issue and forget to remove it.

## References

[Scan Images](https://docs.docker.com/develop/scan-images/)

[Vulnerability Scanning](https://docs.docker.com/engine/scan/)

[Snyk](https://snyk.io/)

[Snyk CI/CD Scanning](https://circleci.com/blog/adding-application-and-image-scanning-to-your-cicd-pipeline/)

[git-secrets](https://github.com/awslabs/git-secrets)
