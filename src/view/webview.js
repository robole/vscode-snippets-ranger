const vscode = require("vscode");
const path = require("path");
const {
  createCategorySection,
  createExtensionCategorySection,
} = require("./category-section");
const { createTableOfContents } = require("./table-of-contents");
const { deleteSnippet } = require("../actions/delete");
const { editSnippet } = require("../actions/edit");

/**
 * A view displaying the snippets on a user's system.
 *
 * @param {*} context - The extension context
 */
function View(context) {
  let panel;
  let head;

  init();

  function init() {
    show();
    addMessageHandlers();
  }

  /**
   * Show the web view.
   */
  function show() {
    // createWebviewPanel shows a blank panel
    panel = vscode.window.createWebviewPanel(
      "snippetView",
      "Snippets Ranger",
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
      }
    );

    head = createHead();

    panel.webview.html = getLoadingStateHtml();
  }

  /**
   * The message handlers respond to events from the webview. The events are
   * triggered by `script/main.js` script.
   */
  function addMessageHandlers() {
    panel.webview.onDidReceiveMessage(
      async (message) => {
        if (message.command === "openSnippetFile") {
          let uri = vscode.Uri.file(decodeURIComponent(message.path));

          await vscode.window.showTextDocument(uri);
        } else if (message.command === "editSnippet") {
          let uri = vscode.Uri.file(decodeURIComponent(message.path));

          await editSnippet(uri, message.snippetName);
        } else if (message.command === "deleteSnippet") {
          let uri = vscode.Uri.file(decodeURIComponent(message.path));

          await deleteSnippet(uri, message.snippetName);
        }
      },
      {},
      context.subscriptions
    );
  }

  /**
   * Create the `head` for the document.
   * @returns
   */
  function createHead() {
    let stylesheetLink = `<link rel="stylesheet" href="${convertToWebviewUri(
      "dist",
      "styles.minified.css"
    )}">`;

    let html = `<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
		${stylesheetLink}<title>Snippet Ranger</title></head>`;

    return html;
  }

  /**
   * Get the HTML for the page in a loading state. A spinner animation is shown alongside the text
   * "Rounding them up!".
   * @returns {string} This is the html.
   */
  function getLoadingStateHtml() {
    let html = `<!DOCTYPE html><html lang="en">${head}
		<body>
		<main class="loading">
		<h1>Snippets Ranger</h1>
			<video src=${convertToWebviewUri(
        "img",
        "loader-clip.mp4"
      )} autoplay muted loop></video>
			<p>Rounding them up!</p>
		</main>
		</body></html>`;

    return html;
  }

  /**
   * Get a webview-compliant URI for the provided paths
   * @returns {vscode.Uri} The vscode uri.
   */
  function convertToWebviewUri(...paths) {
    const uri = vscode.Uri.file(path.join(context.extensionPath, ...paths));
    return panel.webview.asWebviewUri(uri);
  }

  /**
   * Load the data provided to update the view.
   *
   * @param {Array} projectSnippetsFiles - an array of `SnippetsFile` objects for the project
   * @param {Array} userSnippetsFiles - an array of `SnippetsFile` objects for the user
   * @param {Array} appSnippetsFiles - an array of `SnippetsFile` objects for the app (VS Code)
   * @param {Array} extensions - an array of installed `Extension` objects that has snippets
   */
  function load(
    projectSnippetsFiles,
    userSnippetsFiles,
    appSnippetsFiles,
    extensions
  ) {
    let html = `<!DOCTYPE html><html lang="en">${head}
		<body><main><h1>Snippets Ranger</h1>`;
    html += createTableOfContents(
      projectSnippetsFiles,
      userSnippetsFiles,
      appSnippetsFiles,
      extensions
    );
    html += createCategorySection(projectSnippetsFiles, "project");
    html += createCategorySection(userSnippetsFiles, "user");
    html += createExtensionCategorySection(extensions);
    html += createCategorySection(appSnippetsFiles, "app");
    html += `<script src="${convertToWebviewUri(
      "script",
      "main.js"
    )}"></script>`;
    html += `</main></body></html>`;

    panel.webview.html = html;
  }

  return { load };
}

module.exports = View;
