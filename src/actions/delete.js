const fs = require("fs");
const { parse } = require("../core/parser");

/**
 * @async
 * Delete a snippet from a snippet file.
 * @param {vscode.Uri} uri URI of the snippet file you want to delete the snippet from.
 * @param {String} snippetName The name of the snipepet to delete
 * @returns {Promise} The TextEditor that contains the user snippets document.
 */
async function deleteSnippet(uri, snippetName) {
  let json = await parse(uri.fsPath);
  delete json[snippetName];
  await fs.promises.writeFile(uri.fsPath, JSON.stringify(json, null, 2));
}

module.exports = { deleteSnippet };
