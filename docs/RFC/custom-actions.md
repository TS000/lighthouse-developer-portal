# [RFC] Custom Github Actions

**Summary**:

We want to implement custom Github Actions to retain both the simplicity, readability and maintainability of published Github Actions and the ability to create tailored workflows that fit our specific operational needs.

## Background

Github Actions are workflows that allow us to automate complex tasks. Some steps are handled by actions published to the Github Actions Marketplace but other steps require a tailored solution often involving many steps that using scripts. These tailored solutions can quickly become unwieldy and difficult to understand. Moreover, some of these steps are tightly coupled which obfuscates the process of maintaining, modifying, or extending these workflows.

We want to add a layer of abstraction by encapsulating these steps into a single custom Github Action. Using custom Github actions we intend to transform these complex, and often tightly coupled, multi-step solutions into reusable atomic actions with simple interfaces.

## Goal

Create custom Github Actions with simple interfaces that we can use in our workflows.

## [Creating Custom Actions](https://docs.github.com/en/actions/creating-actions/about-custom-actions)

- To identify an action Github looks for an action `manifest` which is simply a file called `action.yml` or `action.yaml`
- There are three [types of github actions](https://docs.github.com/en/actions/creating-actions/about-custom-actions#types-of-actions):
  - Docker container
  - JavaScript
  - Composite Actions

### [Docker Container Actions](https://docs.github.com/en/actions/creating-actions/creating-a-docker-container-action)

- OS: Linux
- Packages the Github action into a docker container to create a more reliable unit of code
- Specify aspects of the environment for the action(e.g. version of OS, dependencies, tools, etc.)
- Additional overhead for retrieving/building the container causing the action to be slower

### [JavaScript Actions](https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action)

- OS: Linux, macOS, Windows
- Runs directly on a runner machine
- Can separate the action code from the environment used to run the code
- Executes faster than Docker container action
- Should be written in pure JavaScript and not rely on other binaries

### [Composite Actions](https://docs.github.com/en/actions/creating-actions/creating-a-composite-action)

- OS: Linux, macOS, Windows
- Allows you to bundle multiple workflow steps into a single action
- You can refer to this action using a single step from a workflow to run the bundle of commands

## Implementation

I created an example of a `composite` action using this repository. This method uses the path to `.github/actions/<custom_action_name>` to find the custom action's manifest file.

> Note: There is another method of locating actions by creating a separate repository with tags to reference. I created a repository `lighthouse-developer-portal-actions` but it is currently set to `internal` by default and an organization owner/admin needs to change it to `public` for us to use it.

- Inside the `.github` directory is an `actions` directory

```
.
└── .github/
    ├── pull_request_template.md
    ├── workflows/
    └── actions/
        └── logger/
            └── action.yml

```

- Inside the `actions` directory is a `logger` directory containing a single `action.yml` file

  - The `logger` directory refers to the name of the action
  - The `action.yml` is an action manifest file
  - The path to the `action.yml` will be used later to find the action manifest when a workflow tries to invoke it

- Contents of the manifest:

```
# action.yml
name: 'Logger'
description: 'Logs things'
inputs:
  string-to-log:
    description: 'string to log'
    required: true
    default: 'Enter a phrase to log'

# outputs can also be defined here but this action doesn't have any

runs:
  using: "composite"
  steps:
    - uses: actions/checkout@v2
    - uses: actions/github-script@v3
      with:
        script: console.log("${{ inputs.string-to-log }}")
```

- Using the action in a workflow
<pre>

# .github/workflows/example_custom_action.yml

name: Example custom action

on:
push:
branches: [custom-actions]
pull_request:
branches: [main]
workflow_dispatch:

jobs:
example-custom-action:
runs-on: ubuntu-latest
continue-on-error: true
steps: - uses: actions/checkout@v2 # Using path to same repo works
 <b>- uses: ./.github/actions/logger
with:
string-to-log: 'This should log in the console'</b>

</pre>

- Result from [workflow run](https://github.com/department-of-veterans-affairs/lighthouse-developer-portal/runs/3883781943?check_suite_focus=true):

```
Run actions/github-script@v3
  with:
    script: console.log("This should log in the console")
    github-token: ***
    debug: false
    user-agent: actions/github-script
    result-encoding: json
This should log in the console
```

## Recommendation

I think that we should first audit our existing workflows to determine which workflows, or parts of workflows, we intend to keep. Of these workflows we can then identify steps or groups of steps where we can potentionally implement a custom action. Then we can further consolidate the group of potential custom actions by identifying redundancies. Once we have a refined list of custom actions we can create each action and implement it by replace the corresponding steps in our workflows with our custom actions.
