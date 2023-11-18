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
    let paths = [];

    try {
      paths = await env.getProjectSnippetPaths();
    } catch (error) {
      console.log(`No project files. Error: ${error}`);
    }

    let snippetsFiles = await fetchSnippetsFiles(paths);
    return snippetsFiles;
  }

  /**
   * Fetch the snippet files for the user.
   * @returns {Array} An array of `SnippetsFile` objects
   */
  async function fetchUserSnippetsFiles() {
    let paths = [];

    try {
      paths = await env.getUserSnippetPaths(globalStoragePath);
    } catch (error) {
      console.log(`No user files. Error: ${error}`);
    }

    let snippetsFiles = fetchSnippetsFiles(paths);
    return snippetsFiles;
  }

  /**
   * Fetch the snippet files for the app i.e. VS Code's builtin snippets.
   * @returns {Array} An array of `SnippetsFile` objects
   */
  async function fetchAppSnippetsFiles() {
    let paths = [];

    try {
      paths = await env.getAppSnippetPaths();
    } catch (error) {
      console.log(`No app files. Error: ${error}`);
    }

    let snippetsFiles = await fetchSnippetsFiles(paths);
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
    let snippetsArray = toSnippetsArray(snippetsJson);
    let snippetsFile = new SnippetsFile(paths[index], snippetsArray);
    array.push(snippetsFile);
  });

  return array;
}

module.exports = fetch;
