# NVM Commands Reference

## Installation

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```

## Node Version Management

| Command | Description |
|---|---|
| `nvm install node` | Install the latest version of Node |
| `nvm install <version>` | Install a specific version (e.g. `nvm install 20.11.0`) |
| `nvm install --lts` | Install the latest LTS version |
| `nvm uninstall <version>` | Uninstall a specific version |

## Switching Versions

| Command | Description |
|---|---|
| `nvm use node` | Switch to the latest installed version |
| `nvm use <version>` | Switch to a specific version (e.g. `nvm use 20`) |
| `nvm use --lts` | Switch to the latest LTS version |
| `nvm use system` | Switch to the system-installed version |

## Listing & Info

| Command | Description |
|---|---|
| `nvm ls` | List all locally installed versions |
| `nvm ls-remote` | List all available versions to install |
| `nvm ls-remote --lts` | List only LTS versions available to install |
| `nvm current` | Show the currently active version |
| `nvm which <version>` | Show the path to an installed version |
| `nvm version` | Show the current nvm version |

## Aliases

| Command | Description |
|---|---|
| `nvm alias default <version>` | Set the default Node version for new shells |
| `nvm alias <name> <version>` | Create a custom alias |
| `nvm unalias <name>` | Remove an alias |

## .nvmrc

| Command | Description |
|---|---|
| `nvm use` | Use the version specified in `.nvmrc` |
| `nvm install` | Install the version specified in `.nvmrc` |
| `node -v > .nvmrc` | Create an `.nvmrc` file with the current version |

## Other Useful Commands

| Command | Description |
|---|---|
| `nvm exec <version> node app.js` | Run a command with a specific Node version |
| `nvm run <version> app.js` | Run a script with a specific Node version |
| `nvm reinstall-packages <version>` | Reinstall global packages from another version |
| `nvm cache dir` | Show the nvm cache directory |
| `nvm cache clear` | Clear the nvm cache |
| `nvm deactivate` | Deactivate nvm and revert to system Node |
