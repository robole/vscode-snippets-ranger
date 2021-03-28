# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
