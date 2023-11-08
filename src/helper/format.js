/**
 * Convenience methods for formatting text and HTML.
 */

/**
 * Capitalize the first letter of the first word.
 * @param {String} str String to capitalize.
 */
function capitalize(str) {
  if (typeof str === "string") {
    return str.replace(/^\w/, (c) => c.toUpperCase());
  }
  return "";
}

/**
 * Transforms HTML content that could be wrongfully interpreted as markup.
 * @param {String} text The text to format.
 */
function escapeHtml(text) {
  let str = text
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\\/g, "&#92;&#92;")
    .replace(/\r?\n/g, "<br/>")
    .replace(/\t/g, "&emsp;");

  return str;
}

/**
 * Escapes all the HTML content in the items of an array and concatenates it into a string
 * that can be consumed by a web page. Each item is appended with a HTML line break (BR tag).
 * @param {string|Array} array Array of values
 */
function escapeBody(body) {
  let str = "";

  if (typeof body === "string") {
    str = escapeHtml(body);
  } else if (Array.isArray(body)) {
    body.forEach((element) => {
      str += escapeHtml(element);
      str += "<br>";
    });
  }

  return str;
}

/**
 * Convert a string into an array. If it is a multi-line string, each line becomes an element.
 * @param {string} text
 * @returns
 */
function convertToArray(text) {
  if (/\n|\r\n/gm.test(text) === false) {
    return [text];
  }

  let array = text.split(/\n|\r\n/gm);
  return array;
}

/**
 * Produces an ID from the text provided that can be used as an URL fragment. Does it in the same style as GitHub.
 * Based on source code: https://github.com/jch/html-pipeline/blob/master/lib/html/pipeline/toc_filter.rb
 * @param {string} text - The text to slugify
 * @returns {string} The slug.
 */
function slugify(text) {
  const PUNCTUATION_REGEXP = /[^\p{L}\p{M}\p{N}\p{Pc}\- ]/gu;

  let slug = text.trim().toLowerCase();
  slug = slug.replace(PUNCTUATION_REGEXP, "").replace(/ /g, "-");
  return slug;
}

module.exports = {
  capitalize,
  escapeHtml,
  escapeBody,
  convertToArray,
  slugify,
};
