const format = require("../helper/format");

/**
 * Create a table of contents in HTML from the snippets files.
 * @param {Array} projectSnippetsFiles - An array of `SnippetsFile` objects for the project (workspace)
 * @param {Array} userSnippetsFiles - An array of `SnippetsFile` objects for the user
 * @param {Array} appSnippetsFiles - An array of `SnippetsFile` objects for the app (VS Code)
 * @param {Array} extensions - An array of `Extension` objects that have snippets
 * @returns {string}
 */
const createTableOfContents = (
  projectSnippetsFiles = [],
  userSnippetsFiles = [],
  appSnippetsFiles = [],
  extensions = []
) => {
  let html = "";
  let entries = "";

  entries += createCategoryEntry("project", projectSnippetsFiles);
  entries += createCategoryEntry("user", userSnippetsFiles);
  entries += createExtensionEntry(extensions);
  entries += createCategoryEntry("app", appSnippetsFiles);

  if (entries !== "") {
    html = `<div id="toc"><h2>Table of Contents</h2><ul>${entries}</ul></div>`;
  }

  return html;
};

const createCategoryEntry = (category, snippetsFiles) => {
  let html = "";
  let entries = "";

  snippetsFiles.forEach((snippetsFile) => {
    entries += createSnippetsFileEntry(snippetsFile);
  });

  if (entries !== "") {
    let title = `${format.capitalize(category)} Snippets`;
    html += `<li><a href="#${category}">${title}</a><ul>`;
    html += `${entries}</ul></li>`;
  }

  return html;
};

const createSnippetsFileEntry = (snippetsFile) => {
  let id = format.slugify(snippetsFile.path);
  return `<li><a href="#${id}">${snippetsFile.getTitle()}</a></li>`;
};

const createExtensionEntry = (extensions) => {
  let html = "";
  let entries = "";

  extensions.forEach((extension) => {
    let id = format.slugify(extension.id);
    entries += `<li><a href="#${id}">${extension.name}</a><ul>`;

    extension.snippetsFiles.forEach((snippetsFile) => {
      entries += createSnippetsFileEntry(snippetsFile);
    });

    entries += "</ul></li>";
  });

  if (entries !== "") {
    html += `<li><a href="#extension">Extension Snippets</a><ul>${entries}</ul></li>`;
  }

  return html;
};

module.exports = { createTableOfContents };
