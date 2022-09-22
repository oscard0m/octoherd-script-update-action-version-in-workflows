// @ts-check

/**
 * Update workflows using a certain GitHub Action to a concrete version, i.e. actions/checkout@v{version_number}
 *
 * @param {import('@octoherd/cli').Octokit} octokit
 * @param {import('@octoherd/cli').Repository} repository
 * @param {object} options
 * @param {string} options.actionName Name of the GitHub Action you want to update its version in your workflows
 * @param {string} options.actionVersion Version you want to change of the selected GitHub Action
 * @param {string} [options.workflow] Name of the workflow you want to apply the changes
 */
export async function script(
  octokit,
  repository,
  { actionName, actionVersion, workflow }
) {}
