# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
