/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-useless-path-segments */
const vscode = require("vscode");
const View = require("./view");

// this is included for webpack, so that it picks up the CSS file
// eslint-disable-next-line import/no-unresolved
// @ts-ignore
const styles = require("../src/css/styles.css");

function activate(context) {
  let view;

  context.subscriptions.push(
    vscode.commands.registerCommand("snippets-ranger.show", () => {
      view = new View(context);
    })
  );
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
