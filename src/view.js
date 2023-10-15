/* eslint-disable class-methods-use-this */
// @ts-nocheck
// eslint-disable-next-line import/no-unresolved
const vscode = require("vscode");
const { basename } = require("path");
const path = require("path");
const SnippetsFetcher = require("./snippets-fetcher");
const Formatter = require("./formatter");
const Window = require("./window");
const SnippetsEditor = require("./snippets-editor");

const notFoundHTML = `<p class="empty">Oucho Gaucho! 🌵 Nothing to round up! 🤠</p>`;

/**
 * View for Snippet Ranger.
 */
class View {
  constructor(context) {
    this.context = context;
    this.panel = vscode.window.createWebviewPanel(
      "snippetView",
      "Snippets Ranger",
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
      }
    );

    this.snippetsFetcher = new SnippetsFetcher(this.context);

    this.panel.webview.onDidReceiveMessage(
      async (message) => {
        // eslint-disable-next-line default-case
        switch (message.command) {
          case "openSnippetFile": {
            // path is encoded, so must decode first!
            let uri = vscode.Uri.file(decodeURIComponent(message.path));
            await vscode.window.showTextDocument(uri);
            break;
          }
          case "editSnippet": {
            // path is encoded, so must decode first!
            let uri = vscode.Uri.file(decodeURIComponent(message.path));
            await Window.showSnippet(uri, message.snippetName);
            break;
          }
          case "deleteSnippet": {
            // path is encoded, so must decode first!
            let uri = vscode.Uri.file(decodeURIComponent(message.path));

            let snippetsEditor = new SnippetsEditor(context);

            await snippetsEditor.deleteSnippet(uri, message.snippetName);
            break;
          }
        }
      },
      {},
      this.context.subscriptions
    );

    this.userIDs = [];
    this.extensionIDs = [];
    this.appIDs = [];
		this.projectIDs = [];
  }

  /**
   * Show the web view.
   */
  async show() {
    this.getLoadingWebviewContent().then((html) => {
      this.panel.webview.html = html;
    });

    this.getWebviewContent().then((html) => {
      this.panel.webview.html = html;
    });
  }

  /**
   * Get the HTML for the loading page.
   */
  async getLoadingWebviewContent() {
    const stylesSrc = this.getStylesheetWebviewUri();

    let html = `<!DOCTYPE html><html lang="en">
		<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Snippet Ranger</title>
				<link rel="stylesheet" href="${stylesSrc}"/>
		</head>
		<body>
		<main class="loading">
		<h1>Snippets Ranger</h1>
			<img src=${this.getLoadingWebviewUri()} alt="loading image" class="gif"/>
			<p style="text-align:center">Rounding them up!</p>
		</main>
		</body></html>`;

    return html;
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

    let upIcon = `<a id="toTopLink" href="#toc"><svg class="upIcon" viewBox="0 0 16 16" aria-labelledby="upIconTitle" role="img"><title id="upIconTitle">Go to Table of Contents</title><path fill-rule="evenodd" clip-rule="evenodd" d="M8.024 5.928l-4.357 4.357-.62-.618L7.716 5h.618L13 9.667l-.619.618-4.357-4.357z"/></svg></a>`;

    let userSection = await this.getUserSnippetsSection();
    let appSection = await this.getAppSnippetsSection();
    let extensionSection = await this.getExtensionSnippetsSection();
		let projectSection = await this.getProjectSnippetsSection();
    let toc = this.getTableOfContents(); // relies on IDs being set by methods above

    let scriptSrc = this.getScriptWebviewUri();
    let script = `<script src="${scriptSrc}"></script>`;

    return `${htmlStart}${toc}${projectSection}${userSection}${extensionSection}${appSection}${upIcon}${script}${htmlEnd}`;
  }

  /**
   * Creates the HTML output for the section for a snippets set associated with a language. 
	 * It has a title and a table listing all of the snippets.
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
      let id = `${type}-${title}`;
      section += `<h3 id="${id}"> ${title} </h3>`;

      // encodeURIComponent prevents funny business with charcters especially with slashes
      let uri = encodeURIComponent(languageSnippets.path);
      section += `<div class="source"><button type="button" class="sourceBtn" onclick="script.openFile('${uri}')")>View Source File</button></div>`;

      section += this.getSnippetsTable(languageSnippets);
      section += `</div>`;

      let idObj = {
        id,
        name: title,
      };
      if (type === "user") {
        this.userIDs.push(idObj);
      } else if (type === "app") {
        this.appIDs.push(idObj);
      }
    }

    return section;
  }

	 /**
   * Creates the HTML output for the section for a snippets set associated with a file. 
	 * It has a title and a table listing all of the snippets.
   * @param {LanguageSnippets} languageSnippets The LanguageSnippets you want the section for
   * @param {String} type The type of snippets. Values can be "user" or "app".
   */
	 createFileSection(collection) {
    let section = "";

    if (
      collection !== undefined &&
      collection.snippets.length > 0
    ) {
      section += "<div>";
      let title = basename(collection.path, ".code-snippets");
      let id = `${collection.type}-${Formatter.slugify(title)}`;
      section += `<h3 id="${id}"> ${title} </h3>`;

      // encodeURIComponent prevents funny business with charcters especially with slashes
      let uri = encodeURIComponent(collection.path);
      section += `<div class="source"><button type="button" class="sourceBtn" onclick="script.openFile('${uri}')")>View Source File</button></div>`;

      section += this.getSnippetsTable(collection);
      section += `</div>`;

      let idObj = {
        id,
        name: title,
      };
     
      this.projectIDs.push(idObj);
      
    }

    return section;
  }
	

  /**
   * Creates the HTML output for a set of snippets associated with a snippets file from 
	 * an extension. There is a title, a list of all the associated languages, 
	 * and a table listing all of the snippets.
   * @param {ExtensionSnippets} snippets The snippets associated with a snippets file for an extension.
   */
  createExtensionFileSection(snippets) {
    let section = "";

    if (snippets !== undefined) {
      section += "<div>";
      let title = basename(snippets.path);
      section += `<h4> ${title} </h4>`;
      // convert from set to array, then make it into comma-separated list
      let languages = this.toUnorderedList(Array.from(snippets.languages));
      section += `<p>Available in the following languages:</p> ${languages}`;

      // encodeURIComponent prevents funny business with charcters especially with slashes
      let uri = encodeURIComponent(snippets.path);
      section += `<div class="source"><button type="button" class="sourceBtn" onclick="script.openFile('${uri}')")>View Source File</button></div>`;

      section += this.getSnippetsTable(snippets);
      section += `</div>`;
    }
    return section;
  }

  /** Create the HTML output for a collection of snippets.
   * @param {Array} snippetsCollection Array of snippet objects.
   */
  getSnippetsTable(snippetsCollection) {
    let tableStart = `<table data-path="${snippetsCollection.path}"`;
		
		if (snippetsCollection.scoped === true) {
			tableStart += `class="scoped-table"`;
		}
		
		tableStart += `><thead><th>Prefix</th><th>Name</th><th>Description</th><th>Body</th>`;
		
		if (snippetsCollection.scoped === true) {
			tableStart += `<th>Scope</th>`;
		}
		
		tableStart += `<th>Action</th></thead><tbody>`;
    const tableEnd = `</tbody></table>`;
    let table = tableStart;

    // prevents funny business with charcters especially with slashes
    let uri = encodeURIComponent(snippetsCollection.path);

    snippetsCollection.snippets.forEach((snippet, index) => {
      let editIcon = `<svg viewBox="0 0 16 16" preserveAspectRatio="xMaxYMax meet" xmlns="http://www.w3.org/2000/svg" fill="inherit"><path d="M13.23 1h-1.46L3.52 9.25l-.16.22L1 13.59 2.41 15l4.12-2.36.22-.16L15 4.23V2.77L13.23 1zM2.41 13.59l1.51-3 1.45 1.45-2.96 1.55zm3.83-2.06L4.47 9.76l8-8 1.77 1.77-8 8z"/></svg>`;
      let editButton = `<button type="button" class="editBtn actionBtn" title="Edit" onclick="script.editSnippet('${uri}', '${snippet.name}')")>${editIcon}</button>`;

      let rowIndex = index + 1;

      let deleteIcon = `<svg viewBox="0 0 16 16" preserveAspectRatio="xMaxYMax meet" xmlns="http://www.w3.org/2000/svg" fill="inherit"><path fill-rule="evenodd" clip-rule="evenodd" d="M10 3h3v1h-1v9l-1 1H4l-1-1V4H2V3h3V2a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v1zM9 2H6v1h3V2zM4 13h7V4H4v9zm2-8H5v7h1V5zm1 0h1v7H7V5zm2 0h1v7H9V5z"/></svg>`;
      let deleteButton = `<button type="button" class="deleteBtn actionBtn" title="Delete" onclick="script.deleteSnippet('${uri}', '${snippet.name}', '${rowIndex}')")>${deleteIcon}</button>`;

      table += `<tr>
			<td>${snippet.prefix}</td>
			<td>${snippet.name}</td>
			<td>${snippet.description}</td>`;
      table += "<td><code>";
			table += Formatter.escapeBody(snippet.body);
			table += "</code></td>";

			if (snippetsCollection.scoped === true) {
				table += `<td>${snippet.scope}</td>`
			}

			table += `<td>${editButton}${deleteButton}</td></tr>`;
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
      section += notFoundHTML;
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
   * Get the extension-defined snippets as HTML.
   */
  async getExtensionSnippetsSection() {
    return this.snippetsFetcher
      .getExtensionSnippetsCollection()
      .then((extensionSnippetsArray) => {
        let opening = `<section id="extension"><h2>Extension Snippets</h2>`;
        let section = opening;
        extensionSnippetsArray.forEach((extensionSnippetsObj) => {
          let appID = Formatter.slugify(extensionSnippetsObj.id);
          section += `<h3 id="${appID}">${extensionSnippetsObj.displayName}</h3>`;

          this.extensionIDs.push({
            id: appID,
            name: extensionSnippetsObj.displayName,
          });

          extensionSnippetsObj.snippets.forEach((snippetsObj) => {
            section += this.createExtensionFileSection(snippetsObj);
          });
        });

        if (section === opening) {
          section += notFoundHTML;
        }

        section += `</section>`;
        return section;
      });
  }

	async getProjectSnippetsSection(){
		let projectSnippets = await this.snippetsFetcher.getProjectSnippetsCollection();
		
      
    let opening = `<section id="project"><h2>Project Snippets</h2>`;
    let section = opening;

		projectSnippets.forEach((element) => {
      section += this.createFileSection(element);
    });

		 if (section === opening) {
      section += notFoundHTML;
    }
  
    section += `</section>`;
    return section; 
	}

  /**
   * Get the webview-compliant URI for the loading image.
   */
  getLoadingWebviewUri() {
    const onDiskPath = vscode.Uri.file(
      path.join(this.context.extensionPath, "img", "loading.gif")
    );
    const stylesSrc = this.panel.webview.asWebviewUri(onDiskPath);
    return stylesSrc;
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
   * Get the webview-compliant URI for the main script.
   */
  getScriptWebviewUri() {
    const onDiskPath = vscode.Uri.file(
      path.join(this.context.extensionPath, "script", "main.js")
    );
    const script = this.panel.webview.asWebviewUri(onDiskPath);
    return script;
  }

  /**
   * Get the Table of Contents as HTML.
   */
  getTableOfContents() {
    let html = `<div id="toc">
		<h2>Table of Contents</h2>
		<ul>
		<li><a href="#project">Project Snippets</a></li>`;
		html += this.createTableOfContentsEntry(this.projectIDs);
		html += `<li><a href="#user">User Snippets</a></li>`;
		html += this.createTableOfContentsEntry(this.userIDs);
    html += `<li><a href="#extension">Extension Snippets</a></li>`;
    html += this.createTableOfContentsEntry(this.extensionIDs);
    html += `<li><a href="#app">VS Code Snippets</a></li>`;
    html += this.createTableOfContentsEntry(this.appIDs);
    html += `</ul></div>`;
    return html;
  }

  /**
   * Get the Table of Contents entry for Extension snippets as HTML.
   */
  createTableOfContentsEntry(array) {
    let html = "<ul>";

    array.forEach((obj) => {
      html += `<li><a href=#${obj.id}>${obj.name}</a>`;
    });

    html += "</ul>";

    return html;
  }

  toUnorderedList(array) {
    let html = `<ul>`;

    array.forEach((element) => {
      html += `<li>${element}</li>`;
    });

    html += `</ul>`;

    return html;
  }
}

module.exports = View;
