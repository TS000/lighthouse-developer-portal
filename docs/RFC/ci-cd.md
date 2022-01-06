# [RFC] Modifications to existing CI/CD process

**Summary**:

We are currently in the process of building our CI/CD pipeline. We know we need to make modifications to our existing CI/CD process to incorporate changesets for releases and also to use the Lightkeeper CLI for creating Kubernetes clusters.

## Background

The process of integrating and delivering new changes for an application from source code to a production environment requires a multi-staged process to build, test, and deploy each new release. Automating the process of building, testing, and deploying an application is known as a Continuous Integration/Continuous Delivery, or CI/CD, pipeline. Utilizing a CI/CD pipeline is the preferred method for delivering new releases because it accelerates the process while reducing errors and allows the use a variety of tests and tools to generate feedback for the software development lifecycle. There is not a single way to structure a CI/CD Pipeline, but the intent is to use a multistaged process that creates a feedback loop to drive the development cycle forward.

## Goal

Our goal is to build an optimized CI/CD pipeline that produces fast, accurate, reliable, and comprehensive feedback to expedite our development cycle. We plan to achieve this goal by implementing automation tools and workflows that are triggered by merges pushed to the "main" branch of our Lighthouse Embark repository.

> Note: Is this an accurate description of our goals relating to creating a CI/CD pipeline? Are there other goals I should include?

## Sequence Diagram of CI/CD Pipeline (WIP)

This is a rough sequence diagram of the CI/CD pipeline to illustrate the role of each stage and how it can provide feedback to the developer in the event of an error at some stage in the process.

```plantuml
actor Developer as dev
participant "GitHub Repository" as source
participant "Initial Test and Build" as ci
database "GitHub Packages" as registry
participant "Integration Testing" as int_test
participant "Nonprod Environment" as nonprod

dev->source: Merge changes to "main" branch
source->ci: Merge triggers CI workflow
ci->ci: Setup for CI process\nGet dependencies from cache
alt Dependency Cache Miss
    ci->ci: Install dependencies
end
ci->ci: Get packages from cache
alt Package Cache Miss
    ci->ci: Rebuild packages
end
ci->ci:Run unit tests\nCheck test coverage\nBrowser Tests
alt Unit Tests Failed
    ci->dev: Feedback: Unit tests failed
end
alt Test Coverage Below Threshold
    ci->dev: Feedback: Insufficient test coverage
end
alt Browser Tests Failed
    ci->dev: Feedback: Browser tests failed
end
ci->ci: Determine new tag/version number
ci->ci: Build images
alt Build Failed
    ci->dev: Feedback: Image failed to build
end
ci->registry: Update Container Registry w/\nAssigned tag/version number
alt Update Container Registry Failed
    ci->dev: Feedback: Unable to upload image to container registry
end
ci->source: Creates Release
source->int_test: "Release Created" Webhook triggers GitHub Action for integration tests
int_test->int_test: AWS Integration Tests\nS3 & PostgreSQL
alt AWS Integration Tests Failed
    int_test->dev: Feedback: AWS Integration tests failed
end

int_test->int_test: Create K8s Assets For Nonprod\n Cluster With Lightkeeper
alt Lightkeeper error
    int_test->dev: Feedback: Lightkeeper failed to build assets
end
int_test->int_test: K8s Integration Tests
alt K8s integration tests failed
    int_test->dev: Feedback: K8s nonprod cluster failed integration tests
end
int_test->nonprod: Deploy Nonprod Cluster to Nonprod Env
alt Failed to deploy to nonprod env
    nonprod->dev: Feedback: Failed to deploy to nonprod env
end
dev->nonprod: Smoke Test Nonprod Deployment
alt Smoke Test Failed
    nonprod->dev: Feedback: Some kind of critical error
end
nonprod->nonprod: Other Tests to Determine Stability?
nonprod->dev: Determination: Draft release is stable
dev->source: Publish release
source->registry: Release is published to GitHub Packages
```

> Note: Still a work in progress and needs more steps or more stages to reflect multiple deployment environments

### Source Code

Merging to the "main" branch initiates the CI/CD Pipeline so those changes can be deployed to the production environment. The "Release" Github action will automatically generate changesets and create a new release. We can extend this workflow to include different types of releases like prereleases and to store images for the frontend and backend containers.

### Build Stage

This stage is responsible for building the images for our application and storing these images in a container registry. It is important that we build only once during the CI/CD process to reduce time/resources because the build process is lengthy. Once an image is built, subsequent steps of the CI/CD process that require an image can utilize the already built artifact instead of spending time/resources on rebuilding the image.

### Testing Stage

This stage is responsible for running a variety of automated tests and checks to catch potential errors early and provide feedback to the developer.

### Deployment Stage

This stage is responsible for deploying our application as a Kubernetes cluster to a cloud server. We plan to use Lightkeeper CLI to generate the assets for our Kubernetes cluster. Right now the Lightkeeper CLI requires a login to use that must be done manually through the browser.
