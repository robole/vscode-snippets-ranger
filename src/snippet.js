/* eslint-disable no-underscore-dangle */
const formatter = require("./formatter");

/**
 * VS Code Snippet.
 */
class Snippet {
  constructor(name = "", prefix = "", body = [], description = "", scope = "") {
    this.name = name;
    this.prefix = prefix;
    this.description = description; // optional field in source JSON file
    this.body = body; // a string or array is permitted in source JSON file
		this.scope = scope; // comma-separated list of languages

    // ensures no formatting issues when toString() is used
    this.eol = "\n";
    if (process.platform === "win32") {
      this.eol = "\r\n";
    }
  }

  set name(newName) {
    this._name = newName;
  }

  get name() {
    return this._name;
  }

  set prefix(newPrefix) {
    this._prefix = newPrefix;
  }

  get prefix() {
    return this._prefix;
  }

  set description(newDesc) {
    this._description = newDesc;
  }

  get description() {
    return this._description;
  }

  set body(newBody) {
    if (typeof newBody === "object") {
      // array
      this._body = newBody;
    } else if (typeof newBody === "string") {
      this._body = formatter.convertToArray(newBody, this.eol);
    }
  }

  get body() {
    return this._body;
  }

	set scope(newScope) {
    this._scope = newScope;
  }

  get scope() {
    return this._scope;
  }

  toString() {
    // prettier-ignore
    return `${this.eol}${JSON.stringify(this.name)} : {${this.eol}\t"prefix": ${JSON.stringify(this.prefix)},${this.eol}\t"body": ${JSON.stringify(this.body)},${this.eol}\t"description": ${JSON.stringify(this.description)}${this.eol}\t"scope": ${JSON.stringify(this.scope)}${this.eol}}`;
  }
}

module.exports = Snippet;
