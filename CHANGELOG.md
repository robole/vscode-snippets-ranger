# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
