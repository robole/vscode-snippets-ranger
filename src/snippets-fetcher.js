/* eslint-disable class-methods-use-this */
// eslint-disable-next-line node/no-missing-require, import/no-unresolved
const vscode = require("vscode");
const fs = require("fs");
const jsonc = require("jsonc-parser");
const { basename, normalize, resolve } = require("path");
const Environment = require("./environment");
const LanguageSnippets = require("./language-snippets");

/**
 * Fetch the Snippets from the file system.
 */
class SnippetsFetcher {
  constructor(context) {
    this.context = context;
    this.env = new Environment(this.context);
  }

  /**
   * Get the snippets from the files as JSON objects.
   * @param {String} filepaths The filepaths for the files you want to extract snippets from.
   * @param {String} type The type of snippets you are seeking. Can be "user", "app", or "extension".
   * @returns {Promise} A Promise with an array of JSON objects.
   */
  async getSnippetsCollection(filepaths, type) {
    let jsonObjects = await this.toJSON(filepaths);
    let array = [];

    jsonObjects.forEach((obj, index) => {
      if (obj !== undefined) {
        let flatSnippets = this.flattenSnippets(obj);
        let language = Environment.getLanguageName(filepaths[index]);
        let languageSnippets = new LanguageSnippets(
          language,
          filepaths[index],
          type,
          flatSnippets
        );
        array.push(languageSnippets);
      }
    });
    return array;
  }

  /**
   * Get an array of the snippets in flat object without nested properties. The properties are: name, prefix, body, description.
   * @param {Object} snippets JSON object of snippets file contents.
   */
  flattenSnippets(snippets) {
    let flatSnippets = [];
    // eslint-disable-next-line no-restricted-syntax
    for (let [key, value] of Object.entries(obj)) {
      const { prefix, body, description } = value;
      let flatSnippet = { name: key, prefix, body, description };
      flatSnippets.push(flatSnippet);
    }
    return flatSnippets;
  }

  /**
   * Get all of the User snippets as JSON objects.
   * @returns {Promise} A Promise with an array of JSON objects.
   */
  async getUserSnippetsCollection() {
    let paths = await this.env.getUserSnippetsPaths();
    return this.getSnippetsCollection(paths, "user");
  }

  /**
   * Get all of the App snippets as JSON objects.
   * @returns {Promise} A Promise with an array of JSON objects.
   */
  async getAppSnippetsCollection() {
    let paths = await this.env.getAppSnippetsPaths();
    return this.getSnippetsCollection(paths, "app");
  }

  /**
   * Get the contents of the files.
   * @param {Array} filepaths
   * @returns {Promise} A Promise with an array of the file contents.
   */
  async getData(filepaths) {
    return Promise.all(filepaths.map((f) => fs.promises.readFile(f, "utf-8")));
  }

  /**
   * Get the contents of the files as JSON objects. The files can be JSON or JSONC files (Microsoft JSON with comments standard).
   * @param {Array} filepaths
   * @returns {Promise} A Promise with an array of JSON objects.
   */
  async toJSON(filepaths) {
    let data = await this.getData(filepaths);
    let json = data.map((d) => jsonc.parse(d));
    return Promise.all(json);
  }
}

module.exports = SnippetsFetcher;
