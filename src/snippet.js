const Formatter = require("./formatter");

/**
 * VS Code Snippet.
 */
class Snippet {
  constructor(name, prefix, description, body) {
    this.name = name;
    this.prefix = prefix;
    this.description = this.setToBlank(description); // optional field in source JSON file
    this.body = this.setToArray(body); // a string or array is permitted in source JSON file
  }

  setToBlank(field) {
    if (field === undefined) {
      return "";
    }
    return field;
  }

  setToArray(body) {
    if (typeof body === "string") {
      return [body];
    }
    return body;
  }
}

module.exports = Snippet;
