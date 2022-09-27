/**
 * Update workflows using a certain GitHub Action to a concrete version, i.e. actions/checkout@v{version_number}
 *
 * @param {string} actionName Name of the GitHub Action you want to update its version in your workflows
 * @param {string} actionVersion Version you want to change of the selected GitHub Action
 * @returns {import('@octokit/plugin-create-or-update-text-file').ContentUpdateFunction} Function which updates the content of a workflow file
 */
export const replaceActionVersionInWorkflow = (actionName, actionVersion) => {
  const updateWorkflow = ({ content }) => {
    if (!content) {
      return content;
    }

    const updatedContent = content.replace(
      new RegExp(`uses:\\s+${actionName}@\\w+`, "g"),
      `uses: ${actionName}@${actionVersion}`
    );

    return updatedContent;
  };

  return updateWorkflow;
};
