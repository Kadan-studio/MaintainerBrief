# MaintainerBrief

Turn GitHub issues and pull requests into clean, structured context for AI coding assistants.

MaintainerBrief copies the essential context from one GitHub issue or pull request page into a prompt-ready clipboard format. It helps a maintainer begin triage, review, or a focused fix without manually reformatting the page.

## Supported pages

- `https://github.com/{owner}/{repo}/issues/{number}`
- `https://github.com/{owner}/{repo}/pull/{number}`

Lists, repository pages, discussions, releases, comparisons, GitHub Enterprise, and other GitHub pages are not supported.

## Features

- Issue: copy context for triage or a fix
- Pull request: copy context for review or a fix
- Includes repository, number, title, URL, first description, and selected page text when present
- Limits descriptions to 6,000 characters and selected text to 2,000 characters
- Works only on the current active GitHub page

## Privacy

Page data is processed locally in the browser. MaintainerBrief does not collect, store, or transmit user data. It has no analytics, telemetry, GitHub API calls, AI API calls, or other external network requests. See [PRIVACY.md](PRIVACY.md).

## Permissions

- `activeTab`: access only the tab the user invokes the extension on.
- `scripting`: read the supported GitHub page's visible DOM on demand.
- `clipboardWrite`: copy the generated context after the user clicks a copy button.

## Install from source

1. Download or clone this repository.
2. Open `chrome://extensions` in Chrome.
3. Enable **Developer mode**.
4. Select **Load unpacked**.
5. Choose this repository folder.

## Usage

1. Open a supported GitHub issue or pull request.
2. Optionally select text on the page before opening the extension.
3. Open MaintainerBrief from the Chrome toolbar.
4. Choose the relevant copy action, then paste into your AI coding assistant.

## Project structure

```
manifest.json   Extension metadata and minimum permissions
popup.*         Popup UI and browser interaction
core.mjs        Pure URL, text, and clipboard-template logic
icons/          Packaged PNG icons
tests/          Node built-in test runner tests
```

## Test

```sh
node --test tests/core.test.mjs
```

## v1 non-goals

This release does not include AI or GitHub APIs, authentication, settings, history, sync, analytics, comment/diff/commit extraction, keyboard shortcuts, dark mode, an options page, or support for GitHub Enterprise, Firefox, or Safari.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Focused changes within the v1 scope are welcome.

## License

[MIT](LICENSE)
