const fs = require("fs");
const jsonc = require("jsonc-parser");

/**
 * @async
 * Asynchronously parse the contents of a file as JSON. The file can be formatted as JSON or
 * JSONC (Microsoft's JSON with comments standard).
 * @param {String} path A path to a file. If a URL is provided, it must use the `file:` protocol.
 * @returns {Object}
 */
async function parse(path) {
  let json = {};

  try {
    let data = await fs.promises.readFile(path, { encoding: "utf-8" });
    json = await jsonc.parse(data);
  } catch (err) {
    console.error(`Parsing error: ${err.message}`);
  }

  return json;
}

module.exports = { parse };
