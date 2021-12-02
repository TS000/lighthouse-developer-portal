# [RFC] Sitewide Maintenance Banner (SMB)

**Summary**: 

We are in the process of developing a sitewide banner to update users on important information concerning the site.

## Background

Its important to keep users notified of sitewide issues before they encounter problems on their own. The banner can communiate any information from site problems to new features. This will enhance the user experience and lead to fewer complaints.

## Goal

We want to have the maintenance banner notify users about the status of the site. The banner will be automatically triggered based on information collected in Datadog.

## Findings

### Controlling State of SMB

We can use a combination of [monitors](https://docs.datadoghq.com/monitors/create/) and [alerts](https://docs.datadoghq.com/monitors/) from Datadog to control the banner state. [RUM](https://www.datadoghq.com/product/real-user-monitoring/) (Real User Monitoring) is built into Backstage so me may be able to take advantage of its functionality.

### Creating SMB as a backend plugin

Backstage has a CLI tool for creating plugins. [Here](https://backstage.io/docs/plugins/backend-plugin) is a link to the docs.

### Proxy

Backstage supports [proxying](https://backstage.io/docs/plugins/proxying) if we wanted to control the SMB with a third party plugin.

### Manually triggering SMB from Datadog

From what I have been able to find, there is no way to manually trigger a value from with in Datadog. But we could set a value to Datadog that would trigger the SMB.

### Pager Duty

The DI team has [Pager duty](https://www.datadoghq.com/blog/pagerduty/) on their road map but haven't implemented it yet. An alternative might be to use [Slack](https://www.datadoghq.com/blog/datadog-slack-app/) instead.