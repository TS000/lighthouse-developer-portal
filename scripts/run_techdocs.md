# Script to delete build techdocs documentation on a schedule

This script will build documentation for sites in the backstage catalog on a recurring schedule.

The script has 3 main function:

- cloneRepo():  
    This function simply clones a specified repo
- buildDocs():  
    This function builds the documentation specified in the mkdocs.yml
- publishDocs():  
    This function used gh-pages to publish the documentation to the gh-pages branch of the specified repo

The script takes an array of repos and process each one asynchronously. Each repo get its own input and putput directory based on the repo name.

The script will run on a schedule that is configured by a cron job in the build-documentation.yml file.