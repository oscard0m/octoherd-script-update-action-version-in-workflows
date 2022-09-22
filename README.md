# octoherd-script-update-action-version-in-workflows

> Update workflows using a certain GitHub Action to a concrete version, i.e. actions/checkout@v{version_number}

[![@latest](https://img.shields.io/npm/v/octoherd-script-update-action-version-in-workflows.svg)](https://www.npmjs.com/package/octoherd-script-update-action-version-in-workflows)
[![Build Status](https://github.com/oscard0m/octoherd-script-update-action-version-in-workflows/workflows/Test/badge.svg)](https://github.com/oscard0m/octoherd-script-update-action-version-in-workflows/actions?query=workflow%3ATest+branch%3Amain)

## Usage

Minimal usage

```js
npx octoherd-script-update-action-version-in-workflows \
        --actionName actions/checkout \
        --actionVersion v3
```

Pass all options as CLI flags to avoid user prompts

```js
npx octoherd-script-update-action-version-in-workflows \
  -T ghp_0123456789abcdefghjklmnopqrstuvwxyzA \
  -R "oscard0m/*" \
        --actionName actions/checkout \
        --actionVersion v3 \
        --workflow my-workflow.yml
```

## Options

| option                       | type             | description                                                                                                                                                                                                                                 |
| ---------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--action-name`              | string           | **Required.** Name of the GitHub Action you want to update its version in your workflows                                                                                                                                                    |
| `--action-version`           | string           | **Required.** Version you want to change of the selected GitHub Action                                                                                                                                                                      |
| `--workflow`                 | string           | Name of the workflow you want to apply the changes. Defaults to "\*"                                                                                                                                                                        |
| `--octoherd-token`, `-T`     | string           | A personal access token ([create](https://github.com/settings/tokens/new?scopes=repo)). Script will create one if option is not set                                                                                                         |
| `--octoherd-repos`, `-R`     | array of strings | One or multiple space-separated repositories in the form of `repo-owner/repo-name`. `repo-owner/*` will find all repositories for one owner. `*` will find all repositories the user has access to. Will prompt for repositories if not set |
| `--octoherd-bypass-confirms` | boolean          | Bypass prompts to confirm mutating requests                                                                                                                                                                                                 |

## Caveats

`js-yaml` does not preserve comments in yaml files so bear in mind this script might get rid of the comments inside the modified files:

- https://github.com/nodeca/js-yaml/issues/624
- https://github.com/nodeca/js-yaml/issues/494
- https://github.com/nodeca/js-yaml/issues/305
- https://github.com/nodeca/js-yaml/issues/196

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## About Octoherd

[@octoherd](https://github.com/octoherd/) is project to help you keep your GitHub repositories in line.

## License

[ISC](LICENSE.md)
