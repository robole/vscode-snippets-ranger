/* eslint-disable class-methods-use-this */
const format = require("../helper/format");

/**
 * Create a HTML `table` that displays the snippet collection.
 * @param {SnippetsFile} snippetsFile - The `SnippetFile` to base the table on
 * @param {Boolean} editable - Are the snippets editable
 * @returns {string} The HTML `table`
 */
const createSnippetsTable = (snippetsFile, editable = true) => {
  let html = "";
  let opening = `<table data-path="${snippetsFile.path}"`;

  if (snippetsFile.isScoped() === true) {
    opening += ` class="scoped-table">`;
  } else {
    opening += `>`;
  }

  let head = createTableHead(snippetsFile);
  let body = createTableBody(snippetsFile, editable);
  let closing = `</table>`;

  html = `${opening}${head}${body}${closing}`;

  return html;
};

/**
 * Create the `thead` section for the `SnippetsFile`
 */
const createTableHead = (snippetsFile) => {
  let html = `<thead><th>Prefix</th><th>Name</th><th>Description</th><th>Body</th>`;

  if (snippetsFile.isScoped() === true) {
    html += `<th>Scope</th>`;
  }

  html += `<th>Action</th></thead>`;

  return html;
};

/**
 * Create the `tbody` section for the `SnippetsFile`
 */
const createTableBody = (snippetsFile, editable) => {
  // prevents funny business with charcters especially with slashes
  let uri = encodeURIComponent(snippetsFile.path);

  let body = "<tbody>";

  snippetsFile.snippets.forEach((snippet) => {
    let copyIcon = `<svg viewBox="0 0 36 36"><path fill="currentColor" d="M22.6 4h-1.05a3.89 3.89 0 0 0-7.31 0h-.84A2.41 2.41 0 0 0 11 6.4V10h14V6.4A2.41 2.41 0 0 0 22.6 4m.4 4H13V6.25a.25.25 0 0 1 .25-.25h2.69l.12-1.11a1.24 1.24 0 0 1 .55-.89a2 2 0 0 1 3.15 1.18l.09.84h2.9a.25.25 0 0 1 .25.25Z"/><path fill="currentColor" d="M33.25 18.06H21.33l2.84-2.83a1 1 0 1 0-1.42-1.42l-5.25 5.25l5.25 5.25a1 1 0 0 0 .71.29a1 1 0 0 0 .71-1.7l-2.84-2.84h11.92a1 1 0 0 0 0-2"/><path fill="currentColor" d="M29 16h2V6.68A1.66 1.66 0 0 0 29.35 5h-2.27v2H29Z"/><path fill="currentColor" d="M29 31H7V7h2V5H6.64A1.66 1.66 0 0 0 5 6.67v24.65A1.66 1.66 0 0 0 6.65 33h22.71A1.66 1.66 0 0 0 31 31.33v-9.27h-2Z"/><path fill="none" d="M0 0h36v36H0z"/></svg>`;
    let copyButton = `<button type="button" class="actionBtn" title="Copy" onclick=script.copySnippet('${encodeURI(
      snippet.toString(),
    )}')>${copyIcon}</button>`;

    let editIcon = `<svg viewBox="0 0 16 16" preserveAspectRatio="xMaxYMax meet" xmlns="http://www.w3.org/2000/svg"><path d="M13.23 1h-1.46L3.52 9.25l-.16.22L1 13.59 2.41 15l4.12-2.36.22-.16L15 4.23V2.77L13.23 1zM2.41 13.59l1.51-3 1.45 1.45-2.96 1.55zm3.83-2.06L4.47 9.76l8-8 1.77 1.77-8 8z"/></svg>`;
    let editButton = `<button type="button" class="actionBtn" title="Edit" onclick="script.editSnippet('${uri}', '${snippet.name}')">${editIcon}</button>`;

    let deleteIcon = `<svg viewBox="0 0 16 16" preserveAspectRatio="xMaxYMax meet" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M10 3h3v1h-1v9l-1 1H4l-1-1V4H2V3h3V2a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v1zM9 2H6v1h3V2zM4 13h7V4H4v9zm2-8H5v7h1V5zm1 0h1v7H7V5zm2 0h1v7H9V5z"/></svg>`;
    let deleteButton = `<button type="button" class="actionBtn" title="Delete" onclick="script.deleteSnippet('${uri}', '${snippet.name}')">${deleteIcon}</button>`;

    body += `<tr data-name="${snippet.name}">`;
    body += `<td>${createPrefixList(snippet.prefix)}</td>`;
    body += `<td>${format.escape(snippet.name)}</td>`;
    body += `<td>${format.escape(snippet.description)}</td>`;
    body += "<td><code>";
    body += format.escape(snippet.body);
    body += "</code></td>";

    if (snippetsFile.isScoped() === true) {
      body += `<td>${format.escape(snippet.scope)}</td>`;
    }

    if (editable) {
      body += `<td>${copyButton}${editButton}${deleteButton}</td></tr>`;
    } else {
      body += `<td>${copyButton}</td></tr>`;
    }
  });

  body += `</tbody>`;

  return body;
};

function createPrefixList(prefix) {
  let list = prefix;

  if (Array.isArray(prefix)) {
    list = `<ul class="prefix-list simple-list">`;

    prefix.forEach((item) => {
      list += `<li><code>${format.escape(item)}</code></li>`;
    });

    list += `</ul>`;
  }

  return list;
}

module.exports = { createSnippetsTable };
