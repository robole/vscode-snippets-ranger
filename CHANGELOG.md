# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.24.0] - 2023-10-15

### Added

- Added **Project** snippets section. The source of the snippets is from files with the *.code-snippets* extension found in the *.vscode* folder in your workspace.
- Added `scope` field for snippets (*snippets.js*).
- Added GitHub issue template for bugs. This was done on github.com but edited locally.

### Changed

- The `id` attribute generated for `h3` headings is in the form of the *<section-id>-<title>*. Now the `title` portion is slugified. This ensures that there are no unwanted characters that can break links for table of contents.
- The `scope` field is shown in tables when there is at least one instance of the field in the **project**, **user** and **vs code** snippet files.
- Updated animated image demonstrating UI to reflect that project snippets are there now also. I used WebP instead of GIF for better compression/quality.
- Some refactoring to improve readability.
- Updated tests to reflect changes.

### Fixed

- There was some whitespace in `<img src="img/screenshots/demo.webp" ...` in the README.md that broke `vsce package`!

## [0.23.0] - 2023-10-14

### Changed

- Updated README. Removed *Installation* section and improved copy.

## [0.22.2] - 2023-10-14

### Fixed

- Escaped backslashes (2 consecutive backslashes) were not appearing correctly in HTML output. e.g a snippet with a `body` of "\\${num};" appears as "\${num}".

### Changed

- Modify *webpack.config.js* to work with Node v18.x. It was throwing a ['ERR_OSSL_EVP_UNSUPPORTED' error](https://stackoverflow.com/questions/69394632/webpack-build-failing-with-err-ossl-evp-unsupported) whose cause is: "it’s likely that your application or a module you’re using is attempting to use an algorithm or key size which is no longer allowed by default with OpenSSL 3.0".
- Updated tests in *formatter.test.js*.
- Updated secret for GitHub Action to publish automatically.

## [0.22.1] - 2022-06-29

### Fixed

- Add "main" and "master" branches to GitHub Action. It did not start for some reason!

## [0.22.0] - 2022-06-29

### Changed

- Update GitHub Action to latest major version (version 1).
- Update *.eslintrc.json* to use `eslint-config-node-roboleary` config.

### Fixed

- Autofixed some mistakes caught by ESLint.

## [0.21.2] - 2022-06-12

### Fixed

- Update vsce to latest.

## [0.21.1] - 2022-06-12

### Fixed

- The `scripts` needed to be updated to work with latest Node. An issue with webpack ERR_OSSL_EVP_UNSUPPORTED.

## [0.21.0] - 2022-06-12

### Added

- Added sponsorship url to `package.json`

## [0.20.2] - 2021-07-05

### Fixed

- Fixed spacing between headings. The text of the *h3* was getting slightly truncated at the top when the tab is less than 800px.

### Changed

- Edited "add-new.jpg" explanation of *add new* command. Changed bg color and made into smaller webp.

## [0.20.1] - 2021-05-09

### Fixed

- Mistake in README about installation.

## [0.20.0] - 2021-05-09

### Changed

- Changed README format.
- Updated demo.gif.

## [0.19.0] - 2021-04-25

### Changed

- Moved "Go to top" floating button to the top right side. Only appears when table of contents is out of view.

## [0.18.0] - 2021-04-24

### Changed

- Moved "Go to top" floating button to the left-hand side. On thr right-hand side, it floats above the action buttons, which could lead to a fat finger mistake.
- Updated add-new.jpg to blend in better with surrounding text. Reduced font-size of text in the figure.

## [0.17.0] - 2021-04-23

### Added

- Delete action.

### Changed

- Edit action to open snippet with the cursor at the first character of the snippet name.
- Improved appearance at different viewport sizes.

## [0.16.0] - 2021-04-22

### Changed

- For edit action, move the cursor to the specified position, as well as reveal the range.

## [0.15.1] - 2021-04-22

### Changed

- Fix typo in README.md.

## [0.15.0] - 2021-04-22

### Changed

- Improved add-new.jpg.
- Small edits in README.md.

## [0.14.0] - 2021-04-22

### Added

- Added *edit* action button to tables.

### Changed

- Updated README with new demo GIF and images.

## [0.13.0] - 2021-03-31

### Changed

- Changed table highlight colors.
- Improved README.

## [0.12.0] - 2021-03-31

### Changed

- Changed the "Add new snippet" command to open up the built-in  "open snippets" quickPick to make it possible to add a snippet to any type of snippet file.
- Changed `toString()` in `snippets.js` to include a new line at the start of the string.
- Edited the README for the "Add new snippet" command. Replaced the GIF with a photo showing the step-by-step actions of adding a new snippet.

## [0.11.0] - 2021-03-30

### Changed

- Improved formatting of `body` in View to show tabs and line breaks. Changed `Formatter.escapeHtml()`.
- Refactored `Snippets` and `SnippetsEditor` to simplify code.

### Added

- Tests: formatter.test.js,  snippet.test.js.

## [0.10.0] - 2021-03-29

### Added

- `Snippets Ranger: Add new snippet` command.

## [0.9.0] - 2021-03-28

### Changed

- Changed loading GIF. This reduced the extension size from 355KB to 62KB.

## [0.8.0] - 2021-01-06

### Added

- Github action to publish to VS Code marketplace and Open VSX.

## [0.7.2] - 2020-11-17

### Fixed

- Always show loading GIF. The reveal animation for the GIF doesn't run, it seems that the thread doesn't get time once it starts the async fetching of snippets!

## [0.7.1] - 2020-11-16

### Fixed

- Introduced a bug when refactoring view.js. Fixed the reference variables.

## [0.7.0] - 2020-11-16

### Added

- To retain the webview content when the panel is not in focus, added `retainContextWhenHidden: true`. This improves rendering time when switching between editor tabs, but requires more resources overall. A necessary tradeoff.
- Added download and install badges to *readme.md*.
- Added a loading screen to show after 3/4 of a second.

### Changed

- Tidied up code to remove remaining ES Lint errors.

## [0.6.0] - 2020-11-12

### Added

- Loading text for webview
- Added a test for the extension

### Fixed

- For Linux, there was an issue with the file path for user extensions, which lead to the extension not loading.

## [0.5.0] - 2020-09-28

### Added

- Added "View Source File" button.
- Added a version of logo as a github sharing picture.

## [0.4.1] - 2020-09-05

### Fixed

- When clicking on one of the Table of Contents links, the paragraph part of the section is obscured when shown. Adjusted margin, so this does not happen.

## [0.4.0] - 2020-09-05

### Added

- Added Demo gif to *README.md*.

### Changed

- Improved styles for light mode, dark mode, and high contrast mode.
- Change title for Extension TOC entries to be the display name of the Extension.
- Changed title for Extension Snippets to be the display name of the Extension.
- Changed languages associated with an extension snippets file into an unordered list (it was a string in a paragraph).

## [0.3.0] - 2020-09-04

### Added

- Go to top link.

### Changed

- Changed logo.
- Changed z-index on h4 so that it slides under h3 and h2 on scroll.
- Added node engines to package.json to stop ES Lint reporting unsupported features errors.
- Update rules ES Lint config.
- Adding formatting of snippets to ensure data is consistent and that the body can be shown on a webpage without formatting issues. Added *snippet.js* which will ensure that *description* is set to blank if it is undefined, and that *body* is always an array. Added *escapeBody()* to *Formatter.js* that will escape markup in the *body* array and concatenate it into a well-formatted string for use in the webview.
- Changed webpack config to minify the stylesheet.

## [0.2.0] - 2020-09-01

### Added

- Show extension snippets in webview.
- Added a Table of Contents.

## [0.1.0] - 2020-08-31

### Added

- Initial release. Shows user and app snippets.
