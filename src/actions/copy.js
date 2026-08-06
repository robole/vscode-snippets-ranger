const vscode = require("vscode");

/**
 * @async
 * Copy a snippet to the clipboard.
 * @param {Snippet} snippet The snippet to copy
 */
async function copySnippet(snippet) {
  console.log(`Copying...${snippet}`);
  await vscode.env.clipboard.writeText(snippet);
}

module.exports = { copySnippet };
