# Automated Backstage Update

[Backstage Update Workflow file](https://github.com/department-of-veterans-affairs/lighthouse-developer-portal/blob/main/.github/workflows/backstage-update.yml)

# Update Backstage Workflow Jobs

## check-for-existing-update

Description: Before upgrade process begins, this job checks if there is currently an open pull request to update backstage.

```
Steps:
  - Checkout
    - Uses: [actions/checkout@v2](https://github.com/actions/checkout)
    - Checkout github repository so workflow can access it
  - Check for existing auto-update PR
    - Uses command line to make cURL request to GitHub API for all open pull requests using the "auto-update-backstage" branch
    - Stores url to open pull request as output
```

## link-pr

Description: If there is an open pull request to update backstage, this job will output a link to the open pull request.

```
Steps:
  - Failed to Update Backstage
    - Uses: [actions/github-script@v3](https://github.com/actions/github-script)
    - Outputs the open pull request url retrieved from GitHub API request
```

## update-backstage

Description: If there is no open pull request to update backstage, this job will create a branch, perform the upgrade process, and create a pull request with the new changes.

```
Steps:
  - Checkout
    - Uses: [actions/checkout@v2](https://github.com/actions/checkout)
    - Checkout github repository so workflow can access it
  - Install Dependencies
    - Uses yarn install to install dependencies for backstage upgrade process
  - Update Backstage
    - Runs npm script "backstage-update" which runs "yarn backstage-cli versions:bump 2>&1 | tee backstage-update-log.txt"
  - Compare Create App versions
    - Uses command line to get current version of "@backstage/create-app" from package.json and most recent version from NPM registry
  - Format PR body
    - Uses command line to format a summary of the update log to the pull request body
  - Set output variables
    - Sets variables for PR title and current date
  - Create Pull Request
    - Uses: [peter-evans/create-pull-request@v3](https://github.com/peter-evans/create-pull-request)
    - Creates pull request containing the changes from running "backstage-update"
    - Pull request body also contains a summary of the update log, outputs from the error log, current and most recent versions of "@backstage/create-app" and a link to the create-app changelog
  - Check outputs
    - Logs the number and url of the newly generated Pull Request
```
