const vscode = require("vscode");
const util = require("../helper/util");

/**
 * @async
 * Open a snippet file and jump to the snippet. If the snippet is not
 * found, it will open the snippet file with the cursor on the first line.
 * @returns {Promise<vscode.TextEditor>} The `TextEditor` that contains the user snippets document.
 */

async function editSnippet(uri, snippetName) {
  let textEditor = await vscode.window.showTextDocument(uri);
  let doc = textEditor.document;
  let text = doc.getText();

  let escapedSnippetName = util.escapeStringRegexp(snippetName);
  let regex = new RegExp(`"${escapedSnippetName}".*?:.*?\\{`);
  let match = regex.exec(text);
  let index = 0;

  if (match !== null) {
    index = match.index + 1;
  }

  let position = textEditor.document.positionAt(index);
  let range = new vscode.Range(position, position);
  textEditor.revealRange(range, vscode.TextEditorRevealType.AtTop);
  textEditor.selection = new vscode.Selection(position, position);
  return textEditor;
}

module.exports = { editSnippet };
