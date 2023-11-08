const { basename } = require("path");

/**
 * Get the title of the snippet file. The title is the file name of the snippet file without
 * the file extension.
 * @returns {string}
 */
const getTitle = function () {
  let name = basename(this.path);
  return name.split(".")[0];
};

/**
 * Get the filename of the snippet file
 * @returns {string}
 */
const getFileName = function () {
  return basename(this.path);
};

/**
 * Checks if the snippet file contains a snippet that the `scope` field populated.
 * @returns {boolean}
 */
const isScoped = function () {
  let scoped = false;

  const result = this.snippets.find(
    ({ scope }) => scope !== undefined && scope !== ""
  );

  if (result !== undefined) {
    scoped = true;
  }

  return scoped;
};

/**
 *  A file that contain code snippets.
 */
function SnippetsFile(path = "", snippets = []) {
  let languages = new Set();

  return {
    path,
    snippets,
    getTitle,
    getFileName,
    isScoped,
    addLanguage(language) {
      languages.add(language);
    },
    removeLanguage(language) {
      languages.delete(language);
    },
    getLanguages() {
      return [...languages];
    },
    setLanguages(newLanguages) {
      languages = new Set(newLanguages);
    },
  };
}

module.exports = SnippetsFile;
