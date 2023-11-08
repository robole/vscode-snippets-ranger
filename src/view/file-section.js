const { createSnippetsTable } = require("./snippets-table");
const format = require("../helper/format");

/**
 * Creates the HTML for a section for the snippets contained in a file.
 * @param {SnippetsFile} snippetsFile The snippets file you want the section based on.
 * @param {string} category The category of the snippets e.g "project".
 * @returns {string} The HTML for the section
 */
const createFileSection = (snippetsFile) => {
  let html = "";

  if (snippetsFile !== undefined) {
    html += `<div class="file-section">`;

    html += `<header><h3>${snippetsFile.getFileName()}</h3>`;

    html += createViewSourceButton(snippetsFile.path);
    html += `</header>`;

    let id = format.slugify(snippetsFile.path);
    html += `<div id="${id}" class="bookmark"></div>`;

    if (snippetsFile.snippets.length > 0) {
      html += createSnippetsTable(snippetsFile);
    } else {
      html += `<p>No snippets.</p>`;
    }

    html += `</div>`;
  }

  return html;
};

/**
 * Creates the HTML for a section for the snippets contained in a file that is defined in an extension.
 * @param {SnippetsFile} snippetsFile The snippets file you want the section based on.
 * @returns {string} The HTML for the section
 */
const createExtensionFileSection = (snippetsFile) => {
  let html = "";

  if (snippetsFile !== undefined) {
    html += `<div class="file-section">`;
    html += `<header><h4>${snippetsFile.getFileName()}</h4>`;

    html += createViewSourceButton(snippetsFile.path);

    let languageList = createLanguageList(snippetsFile);
    html += `<div>Languages available in: ${languageList}.</div></header>`;

    let id = format.slugify(snippetsFile.path);
    html += `<div id="${id}" class="bookmark"></div>`;

    if (snippetsFile.snippets.length > 0) {
      html += createSnippetsTable(snippetsFile);
    } else {
      html += `<p>No snippets.</p>`;
    }

    html += `</div>`;
  }

  return html;
};

/**
 * Create the HTML for a "view source" button that opens a snippet file.
 * @param {string} path  - the path to the snippet file
 * @returns {string} - the HTML for the button
 */
function createViewSourceButton(path) {
  let uri = encodeURIComponent(path); // prevents funny business with charcters especially with slashes
  let html = `<button type="button" class="sourceBtn" onclick="script.openFile('${uri}')">View Source File</button>`;
  return html;
}

/**
 * Create a `ul` of the languages associated with a snippets file.
 * @param {SnippetsFile} snippetsFile - The snippets file you want to create the list from
 */
function createLanguageList(snippetsFile) {
  let html = `<ul class="language-list">`;

  snippetsFile
    .getLanguages()
    .sort()
    .forEach((language) => {
      html += `<li><code>${language}</code></li>`;
    });

  html += `</ul>`;

  return html;
}

module.exports = { createFileSection, createExtensionFileSection };
