// @ts-nocheck
/* eslint-disable import/no-unresolved, import/no-useless-path-segments, no-template-curly-in-string, no-unused-vars */
const vscode = require("vscode");
const View = require("./view");
const Snippet = require("./snippet");
const SnippetsEditor = require("./snippets-editor");

// this is included for webpack, so that it picks up the CSS file
const styles = require("../src/css/styles.css");

function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand("snippets-ranger.show", () => {
      let view = new View(context);
      view.show();
    }),
    vscode.commands.registerCommand("snippets-ranger.add", () => {
      let snippetsEditor = new SnippetsEditor(context);
      let activeEditor = vscode.window.activeTextEditor;

      let bodyText = "${3}";
      if (activeEditor) {
        let selectedText = activeEditor.document.getText(
          activeEditor.selection
        );
        if (selectedText.length > 0) {
          bodyText = selectedText;
        }
      }

      let snippet = new Snippet("${1:enter a name}", "${2}", bodyText, "${4}");
      snippetsEditor.add(snippet);
    })
  );
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
