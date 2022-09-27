// @ts-check

import { isMatch } from "matcher";
import { composeCreateOrUpdateTextFile } from "@octokit/plugin-create-or-update-text-file";
import chalk from "chalk";
import terminalLink from "terminal-link";
import { replaceActionVersionInWorkflow } from "./utils.js";

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
  { actionName, actionVersion, workflow = "*" }
) {
  if (!actionName) {
    throw new Error(chalk.red("✖ --action-name is required"));
  }

  if (!actionVersion) {
    throw new Error(chalk.red("✖ --action-version is required"));
  }

  if (repository.archived) {
    octokit.log.info(chalk.gray("▶▶ Repository is archived, ignoring"));
    return;
  }

  const owner = repository.owner.login;
  const repo = repository.name;

  // find all workflow files
  const { data: files } = await octokit
    .request("GET /repos/{owner}/{repo}/contents/{path}", {
      owner,
      repo,
      path: ".github/workflows",
    })
    .catch((error) => {
      if (error.status !== 404) throw error;

      // if `.github/workflows` does not exist we treat it an empty directory
      return { data: [] };
    });

  if (!Array.isArray(files)) {
    octokit.log.warn(
      chalk.yellow(`⚠ .github/workflows is not a directory. Ignoring`)
    );
    return;
  }

  if (files.length === 0) {
    octokit.log.info(chalk.gray(`◯ No workflow files to update`));
    return;
  }

  const fileNames = files.map((file) => file.name);
  const ignored = [];
  const filteredFileNames = fileNames.filter((name) => {
    if (isMatch(name, workflow)) return true;
    ignored.push(name);
  });

  if (ignored.length) {
    octokit.log.debug(
      chalk.gray(`▶▶ Ignored workflows: ${ignored.join(", ")}`)
    );
  }

  for (const fileName of filteredFileNames) {
    try {
      const {
        updated,
        // @ts-ignore - incorrect types returned by `composeCreateOrUpdateTextFile`
        data: { commit },
      } = await composeCreateOrUpdateTextFile(octokit, {
        owner,
        repo,
        path: `.github/workflows/${fileName}`,
        content: replaceActionVersionInWorkflow(actionName, actionVersion),
        message: `ci(${fileName}): set version ${actionVersion} to ${actionName}`,
      });

      if (updated) {
        octokit.log.info(
          chalk.green(
            `  ✔ '${fileName}' updated ${terminalLink(
              "(Link to commit)",
              commit.html_url
            )}`
          )
        );
      } else {
        octokit.log.info(
          chalk.cyan(
            ` ℹ No '${actionName}' action found in '${fileName}' which need an update.`
          )
        );
      }
    } catch (error) {
      octokit.log.error(
        chalk.red("There was an error updating the workflow file")
      );
      octokit.log.error(error);
    }
  }
}
