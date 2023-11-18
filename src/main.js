/* eslint-disable no-template-curly-in-string */
const vscode = require("vscode");

const fetch = require("./core/fetch");
const View = require("./view/webview");
const { addSnippet } = require("./actions/add");

// This is included for Webpack, so that it picks up the CSS file
// eslint-disable-next-line no-unused-vars
const styles = require("./view/styles.css");

async function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand("snippets-ranger.show", async () => {
      await showView(context);
    }),

    vscode.commands.registerCommand("snippets-ranger.add", async () => {
      await addSnippet();
    })
  );
}

async function showView(context) {
  let view = View(context);
  let { globalStoragePath } = context;

  if (globalStoragePath === undefined || globalStoragePath === "") {
    await vscode.window.showErrorMessage(
      `The context.globalStoragePath variable is not defined: ${globalStoragePath}`
    );

    return;
  }

  let fetcher = fetch(globalStoragePath);

  let projectSnippetsFiles = await fetcher.fetchProjectSnippetsFiles();
  let userSnippetsFiles = await fetcher.fetchUserSnippetsFiles();
  let appSnippetsFiles = await fetcher.fetchAppSnippetsFiles();
  let extensions = await fetcher.fetchExtensions();

  view.load(
    projectSnippetsFiles,
    userSnippetsFiles,
    appSnippetsFiles,
    extensions
  );
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
