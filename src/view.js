/* eslint-disable class-methods-use-this, no-undef */
// @ts-nocheck
/* eslint-disable  */
const vscode = require("vscode");
const { basename } = require("path");
const SnippetsFetcher = require("./snippets-fetcher");
const Formatter = require("./formatter");
const path = require("path");
const LanguageSnippets = require("./language-snippets");
const NOT_FOUND_HTML = `<p class="empty">Oucho Gaucho! 🌵 Nothing to round up! 🤠</p>`;

/**
 * View for Snippet Ranger.
 */
class View {
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
		<body>
		<h1>Snippets Ranger</h1>`;
    let htmlEnd = `</body></html>`;

    let upIcon = `<a href="#toc"><svg class="upIcon" viewBox="0 0 32 32" aria-labelledby="upIconTitle" role="img"><title id="upIconTitle">Go to top</title><g><path d="m16 31a15 15 0 1 1 15-15 15 15 0 0 1-15 15zm0-28a13 13 0 1 0 13 13 13 13 0 0 0-13-13z"/><path d="m8.93 18.47 7.07-7.07 7.07 7.07a1 1 0 0 1 0 1.41 1 1 0 0 1-1.41 0l-5.66-5.65-5.66 5.66a1 1 0 0 1-1.41 0 1 1 0 0 1 0-1.42z"/></g>
		</svg></a>`;

    let userSection = await this.getUserSnippetsSection();
    let appSection = await this.getAppSnippetsSection();
    let extensionSection = await this.getExtensionSnippetsSection();
    let toc = this.getTableOfContents(); //relies on IDs being set by methods above

    return `${htmlStart}${toc}${userSection}${extensionSection}${appSection}${upIcon}${htmlEnd}`;
  }

  /**
   * Creates the HTML output for the section for a snippets set associated with a language. It has a title and a table listing all of the snippets.
   * @param {LanguageSnippets} languageSnippets The LanguageSnippets you want the section for
   * @param {String} type The type of snippets. Values can be "user" or "app".
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
   * Creates the HTML output for a set of snippets associated with a snippets file from an extension. There is a title, a list of all the associated languages, and a table listing all of the snippets.
   * @param {ExtensionSnippets} snippets The snippets associated with a snippets file for an extension.
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
   * @param {Array} snippetsArray Array of snippet objects.
   */
  getSnippetsTable(snippetsArray) {
    const tableStart = `<table>
		<thead><th>Prefix</th><th>Name</th><th>Description</th><th>Body</th></thead>
		<tbody>`;
    const tableEnd = `</tbody></table>`;
    let table = tableStart;

    snippetsArray.forEach((snippet) => {
      table += `<tr>
			<td>${snippet.prefix}</td>
			<td>${snippet.name}</td>
			<td>${snippet.description}</td>`;
      table += `<td><code>${Formatter.escapeBody(
        snippet.body
      )}</code></td></tr>`;
    });

    table += `${tableEnd}`;
    return table;
  }

  /**
   * Get the user-defined snippets as HTML.
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
   * Get the app-defined snippets as HTML.
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
   * Get the app-defined snippets as HTML.
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
   * Get the webview-compliant URI for the main stylesheet.
   */
  getStylesheetWebviewUri() {
    const onDiskPath = vscode.Uri.file(
      path.join(this.context.extensionPath, "dist", "styles.minified.css")
    );
    const stylesSrc = this.panel.webview.asWebviewUri(onDiskPath);
    return stylesSrc;
  }

  /**
   * Get the Table of Contents as HTML.
   */
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

  /**
   * Get the Table of Contents entry for Extension snippets as HTML.
   */
  getExtensionTOCEntry() {
    let html = "<ul>";
    this.extensionIDs.forEach((id) => {
      html += `<li><a href=#${id}>${id}</a>`;
    });
    html += "</ul>";
    return html;
  }

  /**
   * Get the Table of Contents entry for user snippets as HTML.
   */
  getUserTOCEntry() {
    let html = "<ul>";
    this.userIDs.forEach((id) => {
      let name = id.replace("user-", ""); //remove prefix
      html += `<li><a href=#${id}>${name}</a>`;
    });
    html += "</ul>";
    return html;
  }

  /**
   * Get the Table of Contents entry for app snippets as HTML.
   */
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

module.exports = View;
