# Ignore Backend Code Coverage for CI


|                |     |                |         |
| -------------- | --- | -------------- | ------- |
| Decision Made: | yes | Decision Date: | 09/2021 |
**Revisit criteria:** 


Decision Made:	Yes	    Decision Date:	9/2021
Revisit Decision:	No
Revisit Criteria: None

Decision Makers: @keyluck, @rianfowler

## tl;dr

Ignore the `backend` package when testing for code coverage on PR's to the `main` branch because the result is always 0% coverage.

## History

One of the required status checks our CI performs is testing code coverage of all our packages/plugins. A GitHub Action checks if a package or plugin's code coverage is above or below a certain threshold. If it is below the threshold, then the GitHub Action fails and branch protection prevents the Pull Request from being merged to the `main` branch. 

When running unit tests with the `--coverage` flag, the `backend` package coverage summary always reports 0% coverage. Currently, the `backend` package has one unit test, and will accurately report if the test passed or not, but will not detect any code coverage. 


## Pros

Ignoring the code coverage reporting for the `backend` will:
- allow us to continue to enforce code coverage for all other plugins and packages 
- prevent blocking all Pull Requests from being merged to the `main` branch due to failed status checks

## Cons

Ignoring the code coverage reporting for the `backend` will:
- prevent us from knowing the true code coverage of the backend if we add unit-tests or plugins to the backend

## Decision

Since we do not plan to add plugins to the `backend` package, we have decided to ignore the code coverage report generated for the backend when running unit tests. This will allow us to continue working and merging Pull Requests to the `main` branch while still using branch protection that enforces code coverage for all other plugins and packages. 
