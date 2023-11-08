const SnippetsFile = require("../model/snippets-file");
const env = require("./env");
const parser = require("./parser");
const { createExtensionObjects, toSnippetsArray } = require("./transform");

function fetch(globalStoragePath) {
  /**
   * Fetch the snippet files for the active project (workspace folder).
   * @returns {Array} An array of `SnippetsFile` objects
   */
  async function fetchProjectSnippetsFiles() {
    let projectPaths = await env.getProjectSnippetPaths();
    let snippetsFiles = await fetchSnippetsFiles(projectPaths);
    return snippetsFiles;
  }

  /**
   * Fetch the snippet files for the user.
   * @returns {Array} An array of `SnippetsFile` objects
   */
  async function fetchUserSnippetsFiles() {
    let userPaths = await env.getUserSnippetPaths(globalStoragePath);
    let snippetsFiles = fetchSnippetsFiles(userPaths);
    return snippetsFiles;
  }

  /**
   * Fetch the snippet files for the app i.e. VS Code's builtin snippets.
   * @returns {Array} An array of `SnippetsFile` objects
   */
  async function fetchAppSnippetsFiles() {
    let appPaths = await env.getAppSnippetPaths();
    let snippetsFiles = await fetchSnippetsFiles(appPaths);
    return snippetsFiles;
  }

  /**
   * Fetch the installed extensions that have snippets files.
   * @returns {Array} An array of `Extension` objects
   */
  async function fetchExtensions() {
    let extensions = createExtensionObjects();

    for (let i = 0; i < extensions.length; i++) {
      const extension = extensions[i];

      let collectionPromised = extension.snippetsFiles.map((snippetsFile) =>
        parser.parse(snippetsFile.path)
      );

      // eslint-disable-next-line no-await-in-loop
      let collection = await Promise.all(collectionPromised);

      collection.forEach((snippetsJson, index) => {
        let snippetsArray = toSnippetsArray(snippetsJson);
        extension.snippetsFiles[index].snippets = snippetsArray;
      });
    }

    return extensions;
  }

  return {
    fetchProjectSnippetsFiles,
    fetchUserSnippetsFiles,
    fetchAppSnippetsFiles,
    fetchExtensions,
  };
}

async function fetchSnippetsFiles(paths) {
  let array = [];
  let parsedCollectionPromised = paths.map((path) => parser.parse(path));
  let collection = await Promise.all(parsedCollectionPromised);

  collection.forEach((snippetsJson, index) => {
    if (snippetsJson !== undefined) {
      let snippetsArray = toSnippetsArray(snippetsJson);
      let snippetsFile = new SnippetsFile(paths[index], snippetsArray);
      array.push(snippetsFile);
    }
  });

  return array;
}

module.exports = fetch;
