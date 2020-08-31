/* eslint-disable class-methods-use-this, no-undef */
// @ts-nocheck
/* eslint-disable  */
const vscode = require("vscode");
const { basename } = require("path");
const SnippetsFetcher = require("./snippets-fetcher");
const Formatter = require("./formatter");
const path = require("path");
const LanguageSnippets = require("./language-snippets");
const NOT_FOUND_HTML = `<p class="empty">Oucho Gaucho!🌵 Nothing to round up! 🤠</p>`;

/**
 * Webview for Snippet Ranger
 */
class RangerView {
  constructor(context) {
    this.context = context;
    this.panel = vscode.window.createWebviewPanel(
      "snippetView",
      "Snippet Ranger",
      vscode.ViewColumn.One,
      {
        enableScripts: true,
      }
    );
    this.userIDs = [];
    this.extensionIDs = [];
    this.appIDs = [];

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
		<body><h1>Snippets Ranger</h1>`;
    let htmlEnd = `</body></html>`;

    let userSection = await this.getUserSnippetsSection();
    let appSection = await this.getAppSnippetsSection();
    let extensionSection = await this.getExtensionSnippetsSection();
    let toc = this.getTableOfContents();

    return `${htmlStart}${toc}${userSection}${extensionSection}${appSection}${htmlEnd}`;
  }

  /**
   * Creates the HTML output for the snippets for a language. There is a title and a table listing all of the snippets.
   * @param {LanguageSnippets} languageSnippets
   */
  createLanguageSection(languageSnippets, type) {
    let section = "";

    if (
      languageSnippets !== undefined &&
      languageSnippets.snippets.length > 0
    ) {
      section += "<div>";
      let title = Formatter.formatTitle(languageSnippets.language);
      let id = `${type}-${languageSnippets.language}`;
      section += `<h3 id="${id}"> ${title} </h3>`;
      section += this.getSnippetsTable(languageSnippets.snippets);
      section += `</div>`;

      if (type === "user") {
        this.userIDs.push(id);
      } else if (type === "app") {
        this.appIDs.push(id);
      }
    }

    return section;
  }

  /**
   * Creates the HTML output for the snippets for a language. There is a title and a table listing all of the snippets.
   * @param {LanguageSnippets} snippets
   */
  createExtensionFileSection(snippets) {
    let section = "";

    if (snippets !== undefined) {
      section += "<div>";
      let title = basename(snippets.path);
      section += `<h4> ${title} </h4>`;
      // convert from set to array, then make it into comma-separated list
      let languages = Array.from(snippets.languages).join(", ");
      section += `Available in the following languages: ${languages}.`;
      section += this.getSnippetsTable(snippets.data);
      section += `</div>`;
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

    table += `${tableEnd}`;
    return table;
  }

  /**
   * Get the user-defined snippets as HTML output.
   */
  async getUserSnippetsSection() {
    let userSnippets = await this.snippetsFetcher.getUserSnippetsCollection();
    let opening = `<section id="user"><h2>User Snippets</h2>`;
    let section = opening;

    userSnippets.forEach((element) => {
      section += this.createLanguageSection(element, "user");
    });

    if (section === opening) {
      section += NOT_FOUND_HTML;
    }

    section += "</section>";

    return section;
  }

  /**
   * Get the app-defined snippets as HTML output.
   */
  async getAppSnippetsSection() {
    let appSnippets = await this.snippetsFetcher.getAppSnippetsCollection();
    let section = `<section id="app"><h2>VS Code Snippets</h2>`;
    appSnippets.forEach((element) => {
      section += this.createLanguageSection(element, "app");
    });
    section += `</section>`;
    return section;
  }

  /**
   * Get the app-defined snippets as HTML output.
   */
  async getExtensionSnippetsSection() {
    return this.snippetsFetcher
      .getExtensionSnippetsCollection()
      .then((extensionSnippetsArray) => {
        let opening = `<section id="extension"><h2>Extension Snippets</h2>`;
        let section = opening;
        extensionSnippetsArray.forEach((extensionSnippetsObj) => {
          let appID = extensionSnippetsObj.id;
          section += `<h3 id="${appID}">${extensionSnippetsObj.displayName} (${extensionSnippetsObj.id})</h3>`;
          this.extensionIDs.push(appID);
          extensionSnippetsObj.snippets.forEach((snippetsObj) => {
            section += this.createExtensionFileSection(snippetsObj);
          });
        });

        if (section === opening) {
          section += NOT_FOUND_HTML;
        }

        section += `</section>`;
        return section;
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

  getTableOfContents() {
    let html = `<section id="toc">
		<h2>Table of Contents</h2>
		<ul>
		<li><a href="#user">User Snippets</a></li>`;
    html += this.getUserTOCEntry();
    html += `<li><a href="#extension">Extension Snippets</a></li>`;
    html += this.getExtensionTOCEntry();
    html += `<li><a href="#app">VS Code Snippets</a></li>`;
    html += this.getAppTOCEntry();
    html += `</ul></section>`;
    return html;
  }

  getExtensionTOCEntry() {
    let html = "<ul>";
    this.extensionIDs.forEach((id) => {
      html += `<li><a href=#${id}>${id}</a>`;
    });
    html += "</ul>";
    return html;
  }

  getUserTOCEntry() {
    let html = "<ul>";
    this.userIDs.forEach((id) => {
      let name = id.replace("user-", ""); //remove prefix
      html += `<li><a href=#${id}>${name}</a>`;
    });
    html += "</ul>";
    return html;
  }

  getAppTOCEntry() {
    let html = "<ul>";
    this.appIDs.forEach((id) => {
      let name = id.replace("app-", ""); //remove prefix
      html += `<li><a href=#${id}>${name}</a>`;
    });
    html += "</ul>";
    return html;
  }
}

module.exports = RangerView;
