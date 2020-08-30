// eslint-disable-next-line import/no-unresolved, node/no-missing-require
const vscode = require("vscode");
const RangerView = require("./ranger-view");

function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand("snippets-ranger.show", () => {
      let view = new RangerView(context);
    })
  );
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
