# Script to delete workflows

This script will delete past workflows that show up in the actions tab in github.

The script is simple and deletes a page at a time starting with the oldest. It currently leaves the last 5 pages of workflows for reference purposes. Due to rate limiting, there is a 30 second timeout when an error occurs to allow the script to work again. 

The long term intention is to have the script run every Friday to keep the workflow history clean.