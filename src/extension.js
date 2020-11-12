const vscode = require("vscode");
const View = require("./view");
// this is included for webpack, so that it picks up the CSS file
const styles = require("../src/css/styles.css");

function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand("snippets-ranger.show", () => {
      // eslint-disable-next-line no-unused-vars
      let view = new View(context);
    })
  );
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
