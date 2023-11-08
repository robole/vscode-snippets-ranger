const vscode = require("vscode");
const { resolve } = require("path");
const Snippet = require("../model/snippet");
const SnippetsFile = require("../model/snippets-file");
const Extension = require("../model/extension");

/**
 * A snippet is written in a file as a key-value pair where the key is the `name`, and
 * the value is an object with the `prefix`, `body`, `description`, and `scope` fields.
 * This function converts the key-value pair into a single object with all of those fields.
 * @param {Object} snippetsObj JSON object of snippets file contents.
 * @return {Object} An array with flattened `Snippet` objects
 */
function toSnippetsArray(snippetsObj) {
  let array = [];

  Object.entries(snippetsObj).forEach(([key, value]) => {
    let snippet = new Snippet(
      key,
      value.prefix,
      value.body,
      value.description,
      value.scope
    );
    array.push(snippet);
  });

  return array;
}

/**
 * Create `Extension` objects from VS Code's installed extensions that have snippets. The
 * `package.json` of each extension is inspected to gather the set of snippets of the
 * the extension.
 * @return {Array} Array of `Extension` objects.
 */
function createExtensionObjects() {
  let extensionObjs = [];

  vscode.extensions.all.forEach((extension) => {
    let { packageJSON } = extension;

    if (
      packageJSON &&
      packageJSON.isBuiltin === false &&
      packageJSON.contributes &&
      packageJSON.contributes.snippets
    ) {
      let id = `${packageJSON.publisher}-${packageJSON.name}`;
      let name = packageJSON.displayName;

      let { extensionPath } = extension;

      let snippetsFiles = transformFileEntries(
        packageJSON.contributes.snippets,
        extensionPath
      );

      let extensionObj = new Extension(id, name, extensionPath);
      extensionObj.snippetsFiles = snippetsFiles;

      extensionObjs.push(extensionObj);
    }
  });

  return extensionObjs;
}

/**
 * Extensions can have mutliple snippets file associated with multiple languages. These
 * associations are defined as a collection of entries in the `package.json` in the form of
 * `{ language : "javascript", path : "somepath/a.json" }`. Since a path can feature in more than one entry,
 * duplication is an issue. This function transforms these file entries into unique `SnippetsFile` objects.
 * @param {Array} fileEntries This is an array of objects. Each object has a `path` and `language` field.
 * @returns {Array} An array of `SnippetsFile` objects.
 */
function transformFileEntries(fileEntries, extensionPath) {
  let uniquePaths = new Map();

  fileEntries.forEach((entry) => {
    let absolutePath = resolve(extensionPath, entry.path);

    if (uniquePaths.has(absolutePath)) {
      let snippetsFile = uniquePaths.get(absolutePath);
      snippetsFile.addLanguage(entry.language);

      uniquePaths.set(absolutePath, snippetsFile);
    } else {
      let snippetsFile = new SnippetsFile(absolutePath);
      snippetsFile.addLanguage(entry.language);

      uniquePaths.set(absolutePath, snippetsFile);
    }
  });

  return [...uniquePaths.values()];
}

module.exports = { toSnippetsArray, createExtensionObjects };
