const { Octokit } = require('@octokit/core');
const octokit = new Octokit({
  auth: process.env.WORKFLOW_TOKEN,
});

function printError(error) {
  const {
    status,
    response: {
      data: { message },
    },
  } = error;
  status === 404 && console.log(message);
  status === 403 && console.log(message);
}

async function deleteWorkflows(owner, repo) {
  // Get total amount of workflows
  const {
    data: { total_count },
  } = await octokit.request('GET /repos/{owner}/{repo}/actions/runs', {
    owner,
    repo,
  });

  // Get the current page or runs to delete
  let pageToDelete = Math.ceil(total_count / 25);

  // Delete from the oldest workflows until there are only 5 of the most recent pages left
  while (pageToDelete > 5) {
    try {
      const {
        data: { total_count, workflow_runs },
      } = await octokit.request('GET /repos/{owner}/{repo}/actions/runs', {
        owner,
        repo,
        per_page: 25,
        page: pageToDelete,
      });
      pageToDelete = Math.ceil(total_count / 25);
      workflow_runs.forEach(async ({ id }) => {
        try {
          await octokit.request(
            'DELETE /repos/{owner}/{repo}/actions/runs/{run_id}',
            {
              owner,
              repo,
              run_id: id,
            },
          );
          console.log(`Deleted workflow ${id}`);
        } catch (error) {
          printError(error);
        }
      });
    } catch (error) {
      printError(error);
    }
    // Waiting a second between deleting pages of workflows (25 workflows per page)
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}
deleteWorkflows('department-of-veterans-affairs', 'lighthouse-embark');
