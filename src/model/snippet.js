const format = require("../helper/format");
const util = require("../helper/util");

/**
 * The body can be a string or an array. This formats it to be an array internally always.
 * @param {*} body - The string to format
 * @param {string} [eol="\n"] - The end of line characters look to use for tokenization
 * @returns {string}
 * */
function formatBody(body) {
  let formatted = body;

  if (typeof body === "string") {
    formatted = format.convertToArray(body);
  }

  return formatted;
}

/**
 * The prefix can be a string or an array. This formats it to be an array internally always.
 * @param {*} prefix - The string to format
 * @param {string} [eol="\n"] - The end of line delimiter look to use for tokenization
 * @returns {string}
 * */
function formatPrefix(prefix) {
  let formatted = prefix;

  if (typeof prefix === "string") {
    formatted = format.convertToArray(prefix);
  }

  return formatted;
}

/**
 * Sort the languages and normalize the whitespace of the `scope` field.
 * @param {string} scope
 * @returns {string}
 */
function formatScope(scope) {
  let formatted;

  let items = scope.split(",");
  let nonblankItems = items.filter((item) => item.trim().length > 0);
  let trimmedItems = nonblankItems.map((item) => item.trim());
  trimmedItems.sort();

  formatted = trimmedItems.join(", ");

  return formatted;
}

/**
 * A code snippet. Code snippets are templates that make it easier to enter repeating code patterns.
 */
function Snippet(
  name = "",
  prefix = [],
  body = [],
  description = "",
  scope = ""
) {
  let formattedPrefix = formatPrefix(prefix);
  let formattedBody = formatBody(body);
  let formattedScope = formatScope(scope);
  let endOfLineDelimiter = util.getEndOfLineDelimiter();

  return {
    name,
    description,
    set prefix(newPrefix) {
      formattedPrefix = formatPrefix(newPrefix);
    },
    get prefix() {
      return formattedPrefix;
    },
    set body(newBody) {
      formattedBody = formatBody(newBody);
    },
    get body() {
      return formattedBody;
    },
    set scope(newScope) {
      formattedScope = formatScope(newScope);
    },
    get scope() {
      return formattedScope;
    },
  };
}

module.exports = Snippet;
