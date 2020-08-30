/* eslint-disable class-methods-use-this, no-undef */
// @ts-nocheck
/* eslint-disable  */
const vscode = require("vscode");
const SnippetsFetcher = require("./snippets-fetcher");
const Formatter = require("./formatter");
const path = require("path");
const LanguageSnippets = require("./language-snippets");

/**
 * Webview for Snippet Ranger
 */
class RangerView {
  constructor(context) {
    this.context = context;
    this.userSnippets = [];
    this.appSnippets = [];
    this.panel = vscode.window.createWebviewPanel(
      "snippetView",
      "Snippet Ranger",
      vscode.ViewColumn.One,
      {
        enableScripts: true,
      }
    );

    this.snippetsFetcher = new SnippetsFetcher(context);
    this.getWebviewContent().then((html) => {
      this.panel.webview.html = html;
    });
  }

  /**
   * Get the HTML page for the webview.
   */
  async getWebviewContent() {
    const stylesSrc = this.getStylesheetWebviewUri();

    let htmlStart = `<!DOCTYPE html><html lang="en">
		<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Snippet Ranger</title>
				<link rel="stylesheet" href="${stylesSrc}"/>
		</head>
		<body>`;
    let htmlEnd = `</body></html>`;

    let sections = this.getUserSnippetsSection();
    sections += this.getAppSnippetsSection();

    return `${htmlStart}${sections}${htmlEnd}`;
  }

  /**
   * Creates the HTML output for the snippets for a language. There is a title and a table listing all of the snippets.
   * @param {LanguageSnippets} languageSnippets
   */
  createLanguageSection(languageSnippets) {
    let section = "";
    const tableStart = `<table>
		<thead><th>Prefix</th><th>Name</th><th>Description</th><th>Body</th></thead>
		<tbody>`;
    const tableEnd = `</tbody></table>`;

    if (
      languageSnippets !== undefined &&
      languageSnippets.snippets.length > 0
    ) {
      let title = Formatter.formatTitle(languageSnippets.language);
      section += `<section><h3> ${title} </h3>`;
      section += this.getSnippetsTable(languageSnippets.snippets);
    }
    return section;
  }

  /** Create the HTML output for a collection of snippets.
   * @param {Array} snippets Array of snippet objects
   */
  getSnippetsTable(snippets) {
    const tableStart = `<table>
		<thead><th>Prefix</th><th>Name</th><th>Description</th><th>Body</th></thead>
		<tbody>`;
    const tableEnd = `</tbody></table>`;
    let table = tableStart;

    snippets.forEach((snippet) => {
      table += `<tr>
			<td>${snippet.prefix}</td>
			<td>${snippet.name}</td>
			<td>${snippet.description}</td>`;
      if (snippet.body && typeof snippet.body === "string") {
        table += `<td><code>${snippet.body}</code></td></tr>`;
      } else if (snippet.body && typeof snippet.body === "object") {
        table += `<td><code>${snippet.body.join("<br>")}</code></td></tr>`;
      }
    });

    table += `${tableEnd}</section>`;
    return table;
  }

  /**
   * Get the user-defined snippets as HTML output.
   */
  async getUserSnippetsSection() {
    this.userSnippets = await this.snippetsFetcher.getUserSnippetsCollection();
    let section = "<h2>User Snippets</h2>";

    this.userSnippets.forEach((element) => {
      section += this.createLanguageSection(element);
    });

    if (section === "<h2>User Snippets</h2>") {
      section += `<p class="empty">Oucho Gaucho! 🤦‍♂️🤠 Nothing to round up!</p>`;
    }

    return section;
  }

  /**
   * Get the app-defined snippets as HTML output.
   */
  async getAppSnippetsSection() {
    let section = "<h2>App Snippets</h2>";
    this.appSnippets.forEach((element) => {
      sections += this.createLanguageSection(element);
    });
  }

  /**
   * Get the webview-compliant URI for the stylesheet.
   */
  getStylesheetWebviewUri() {
    const onDiskPath = vscode.Uri.file(
      path.join(this.context.extensionPath, "src", "css", "styles.css")
    );
    const stylesSrc = this.panel.webview.asWebviewUri(onDiskPath);
    return stylesSrc;
  }
}

module.exports = RangerView;
