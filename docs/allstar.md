# Allstar Configuration Files

Allstar is a GitHub App ran by OpenSSF that helps set and enforce security policies for GitHub Repositories. 

Our repository uses a [Repository Level Opt In Strategy](https://github.com/ossf/allstar/blob/main/quick-start.md#repository-level). This means our repository contains our own .allstar directory to manage our security policies instead of using an organizational level .allstar directory. Inside the .allstar directory are several configuration files that outline our security policies and what `Actions` to take in the event of a security violation.

# Actions
`log`: This is the default action, and actually takes place for all actions. All policy run results and details are logged. Logs are currently only visible to the app operator, plans to expose these are under discussion.
`issue`: This action creates a GitHub issue. Only one issue is created per policy, and the text describes the details of the policy violation. If the issue is already open, it is pinged with a comment every 24 hours (not currently user configurable). Once the violation is addressed, the issue will be automatically closed by Allstar within 5-10 minutes.
`fix`: This action is policy specific. The policy will make the changes to the GitHub settings to correct the policy violation. Not all policies will be able to support this (see below).

# Configuration Files in .allstar Directory

## allstar.yaml
### Purpose

Configures whether our repository will opt in or opt out of using Allstar app for reporting security violations. Since our organization does not contain a .allstar directory, the default Allstar strategy for all repositories is assumed requiring each repository to `opt in` to manage security policies. 

## binary_artifacts.yaml
### Purpose

This policy uses [check from scorecard](https://github.com/ossf/scorecard/#scorecard-checks). Remove the binary artifact from the repository to achieve compliance. As the scorecard results can be verbose, you may need to run scorecard itself to see all the detailed information.

## branch_protection.yaml
### Purpose

This policy checks if our repository's branch protection settings match with the branch protection settings outlined in this file.

## outside.yaml
### Purpose

By default this policy checks that only organizational members have administrative or push access to the repository.

## security.yaml
### Purpose

This policy checks that the repository has a security policy file in `SECURITY.md` and it is not empty. 

