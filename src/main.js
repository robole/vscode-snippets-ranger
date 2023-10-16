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
      let view = View(context);

      let fetcher = fetch(context.globalStoragePath);

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
    }),
    vscode.commands.registerCommand("snippets-ranger.add", async () => {
      await addSnippet();
    })
  );
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
