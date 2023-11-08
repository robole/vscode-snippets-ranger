let {
  createFileSection,
  createExtensionFileSection,
} = require("./file-section");
let format = require("../helper/format");

const notFoundHTML = `<p class="empty">Oucho Gaucho! 🌵 Nothing to round up! 🤠</p>`;

/**
 * Creates the HTML for a section for a category of snippets e.g. "project" for snippets defined in
 * the currently opened project.
 * @param {SnippetsFile} snippetsFile - The snippets file you want the section based on.
 * @param {string} category - The category of snippets. Examples are: project, user, app.
 * @returns {string} The HTML for the section
 */
let createCategorySection = (snippetsFiles, category) => {
  let title = `${format.capitalize(category)} Snippets`;
  let opening = `<section id="${category}"><h2>${title}</h2>`;

  let section = opening;

  snippetsFiles.forEach((snippetFile) => {
    section += createFileSection(snippetFile);
  });

  if (section === opening) {
    section += notFoundHTML;
  }

  section += "</section>";

  return section;
};

/**
 * Creates the HTML for a section for snippets defined in installed extensions.
 * @param {Array} extensions - An array of `Extension` objects.
 * @returns {string} The HTML for the section
 */
let createExtensionCategorySection = (extensions) => {
  let opening = `<section id="extension"><h2>Extension Snippets</h2>`;

  let section = opening;

  extensions.forEach((extension) => {
    let id = format.slugify(extension.id);
    section += `<div><h3 id="${id}">${extension.name}</h3>`;

    extension.snippetsFiles.forEach((snippetsFile) => {
      section += createExtensionFileSection(snippetsFile);
    });

    section += `</div>`;
  });

  if (section === opening) {
    section += notFoundHTML;
  }

  section += "</section>";

  return section;
};

module.exports = { createCategorySection, createExtensionCategorySection };
