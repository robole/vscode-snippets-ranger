/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-useless-path-segments */
const vscode = require("vscode");
const View = require("./view");
const SnippetsEditor = require("./snippets-editor");

// this is included for webpack, so that it picks up the CSS file
// eslint-disable-next-line import/no-unresolved
// @ts-ignore
const styles = require("../src/css/styles.css");

function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand("snippets-ranger.show", () => {
      let view = new View(context);
    }),
    vscode.commands.registerCommand("snippets-ranger.add", () => {
      let snippetsEditor = new SnippetsEditor(context);
      let activeEditor = vscode.window.activeTextEditor;

      let selectedText = "";
      if (activeEditor) {
        selectedText = activeEditor.document.getText(activeEditor.selection);
      }
      snippetsEditor.add(selectedText);
    })
  );
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
