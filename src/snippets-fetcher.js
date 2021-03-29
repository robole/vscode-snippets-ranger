const fs = require("fs");
const jsonc = require("jsonc-parser");
const Environment = require("./environment");
const LanguageSnippets = require("./language-snippets");
const Snippet = require("./snippet");

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
   * @param {Array} filepaths The filepaths for the files you want to extract snippets from.
   * @param {String} type The type of snippets you are seeking. Can be "user", "app", or "extension".
   * @returns {Promise} A Promise with an array of JSON objects.
   */
  async getSnippetsCollection(filepaths, type) {
    let jsonObjects = await this.getObjectArray(filepaths);
    let array = [];

    jsonObjects.forEach((obj, index) => {
      if (obj !== undefined) {
        let flatSnippets = this.flattenSnippets(obj);
        let language = Environment.getFilename(filepaths[index]);
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
    for (let [key, value] of Object.entries(snippets)) {
      let { prefix, body, description } = value;
      let flatSnippet = new Snippet(key, prefix, body, description);
      flatSnippets.push(flatSnippet);
    }
    return flatSnippets;
  }

  /**
   * Get all of the ExtensionSnippets. The actual file data for snippet file is an embedded JSON object.
   * @returns {Promise} A Promise with an array of ExtensionSnippets.
   */
  async getExtensionSnippetsCollection() {
    let extensionSnippetsArray = await this.env.getExtensionSnippets();
    let modifiedSnippetsArray = extensionSnippetsArray.map(
      this.fetchExtensionSnippets.bind(this)
    );
    return Promise.all(modifiedSnippetsArray).then(() => {
      return extensionSnippetsArray;
    });
  }

  async fetchExtensionSnippets(extensionSnippets) {
    let promises = extensionSnippets.snippets.map(async (snippet) => {
      let data = await this.getObject(snippet.path);

      if (data !== undefined) {
        let flatSnippets = this.flattenSnippets(data);
        // eslint-disable-next-line no-param-reassign
        snippet.data = flatSnippets;
      }
      return snippet;
    });

    return Promise.all(promises);
  }

  /**
   * Get all of the User snippets as JSON objects.
   * @returns {Promise} A Promise with an array of JSON objects.
   */
  async getUserSnippetsCollection() {
    let paths = await this.env.getUserSnippetsPaths();
    return this.getSnippetsCollection(paths, "User");
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
  async getDataArray(filepaths) {
    return Promise.all(filepaths.map((f) => fs.promises.readFile(f, "utf-8")));
  }

  /**
   * Get the contents of the files.
   * @param {String} filepath
   * @returns {Promise} A Promise with an array of the file contents.
   */
  async getData(filepath) {
    return fs.promises.readFile(filepath, { encoding: "utf-8" });
  }

  /**
   * Get the contents of the files as JSON objects. The files can be JSON or JSONC files (Microsoft JSON with comments standard).
   * @param {Array} filepaths
   * @returns {Promise} A Promise with an array of JSON objects.
   */
  async getObjectArray(filepaths) {
    let data = await this.getDataArray(filepaths);
    let json = data.map((d) => jsonc.parse(d));
    return Promise.all(json);
  }

  /**
   * Get the contents of the file as JSON objects. The files can be JSON or JSONC files (Microsoft JSON with comments standard).
   * @param {String} filepath
   * @returns {Promise} A Promise with an array of JSON objects.
   */
  async getObject(filepath) {
    let data = await this.getData(filepath);
    let json = await jsonc.parse(data);
    return json;
  }
}

module.exports = SnippetsFetcher;
