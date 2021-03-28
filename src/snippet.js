const Formatter = require("./formatter");

/**
 * VS Code Snippet.
 */
class Snippet {
  constructor(name, prefix, description = "", body) {
    this.name = name;
    this.prefix = prefix;
    this.description = description; // optional field in source JSON file
    this.body = body; // a string or array is permitted in source JSON file

    if (typeof body === "string") {
      this.body = [body];
    }
  }
}

module.exports = Snippet;
