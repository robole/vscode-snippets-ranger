const fs = require("fs");
const jsonc = require("jsonc-parser");
const Environment = require("./environment");
const SnippetsCollection = require("./snippets-collection");
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
   * @param {String} type The type of snippets you are seeking. Can be "user", "app", "project", or "extension".
   * @returns {Promise} A Promise with an array of JSON objects.
   */
  async createSnippetsCollection(filepaths, type) {
    let jsonObjects = await SnippetsFetcher.getObjectArray(filepaths);
    let array = [];

    jsonObjects.forEach((obj, index) => {
      if (obj !== undefined) {
        let flatSnippets = this.flattenSnippets(obj);
        let language = Environment.getFilename(filepaths[index]);
				let scoped = hasScopeField(flatSnippets);

        let snippetsCollection = new SnippetsCollection(
          filepaths[index],
          type,
					scoped,
          flatSnippets,
					language	
        );
        array.push(snippetsCollection);
      }
    });
    return array;
  }

  /**
   * A snippet is written in a file as a key-value pair where the key is the `name`, and
	 * the value is an object with the `prefix`, `body`, and `description` fields.
	 * This function converts the key-value pair into a single object with those four fields.
   * @param {Object} snippets JSON object of snippets file contents.
	 * @return {Object} An array with flattened snippets objects
   */
  flattenSnippets(snippets) {
    let flatSnippets = [];
    
    for (let [key, value] of Object.entries(snippets)) {
      let { prefix, body, description, scope } = value;
      let flatSnippet = new Snippet(key, prefix, body, description, scope);
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
    return Promise.all(modifiedSnippetsArray).then(() => extensionSnippetsArray);
  }

  async fetchExtensionSnippets(extensionSnippets) {
    let promises = extensionSnippets.snippets.map(async (snippet) => {
      let data = await SnippetsFetcher.getObject(snippet.path);

      if (data !== undefined) {
        let flatSnippets = this.flattenSnippets(data);
        // eslint-disable-next-line no-param-reassign
        snippet.snippets = flatSnippets;
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
    let paths = await this.env.getUserSnippetFilepaths();
    return this.createSnippetsCollection(paths, "user");
  }

	/**
   * Get all of the project's snippets as JSON objects.
   * @returns {Promise} A Promise with an array of JSON objects.
   */
  async getProjectSnippetsCollection() {
    let paths = await this.env.getProjectSnippetFilepaths();
		
    return this.createSnippetsCollection(paths, "project");
  }

  /**
   * Get all of the App snippets as JSON objects.
   * @returns {Promise} A Promise with an array of JSON objects.
   */
  async getAppSnippetsCollection() {
    let paths = await this.env.getAppSnippetFilepaths();
    return this.createSnippetsCollection(paths, "app");
  }

  /**
   * @static
   * @async
   * Get the contents of the files.
   * @param {Array} filepaths
   * @returns {Promise} A Promise with an array of the file contents.
   */
  static async getDataArray(filepaths) {
    return Promise.all(filepaths.map((f) => fs.promises.readFile(f, "utf-8")));
  }

  /**
   * @async
   * @static
   * Get the contents of the file.
   * @param {String} filepath
   * @returns {Promise} A Promise with the file contents.
   */
  static async getData(filepath) {
    return fs.promises.readFile(filepath, { encoding: "utf-8" });
  }

  /**
   * Get the contents of the files as JSON objects. The files can be JSON or JSONC 
	 * files (Microsoft JSON with comments standard).
   * @param {Array} filepaths
   * @returns {Promise} A Promise with an array of JSON objects.
   */
  static async getObjectArray(filepaths) {
    let data = await SnippetsFetcher.getDataArray(filepaths);
    let json = data.map((d) => jsonc.parse(d));
    return Promise.all(json);
  }

  /**
   * @async
   * @static
   * Get the contents of the file as JSON objects. The files can be JSON or 
	 * JSONC files (Microsoft JSON with comments standard).
   * @param {String} filepath
   * @returns {Promise} A Promise with an array of JSON objects.
   */
  static async getObject(filepath) {
    let data = await SnippetsFetcher.getData(filepath);
    let json = await jsonc.parse(data);
    return json;
  }
}

function hasScopeField(array){
	has = false;

	const result = array.find(({ scope }) => scope !== undefined && scope !== "" );

	if(result !== undefined){
		has = true;
	}

	return has;
}

module.exports = SnippetsFetcher;
