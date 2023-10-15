/**
 * Snippets for a particular extension. An Extension can have snippets declared in
 * different files. One snippet file can be associated with 1 or more languages.
 */
class ExtensionSnippetsCollection {
  constructor(name, displayName, publisher) {
    this.name = name;
    this.displayName = displayName;
    this.publisher = publisher;
    this.id = `${publisher}.${name}`;
    this.snippets = [];
  }

  /**
   *
   * @param {String} language The programming language associated with the file.
   * @param {String} path The absolute file path for the snippet file.
   */
  addSnippetsFile(language, path) {
    let matched = false;
    this.snippets.forEach((snippet, index) => {
      if (path === snippet.path) {
        this.snippets[index].languages.add(language);
        matched = true;
      }
    });

    if (matched === false) {
      let languagesSet = new Set();
      languagesSet.add(language);
      this.snippets.push({ languages: languagesSet, path, snippets: [] });
    }
  }
}

module.exports = ExtensionSnippetsCollection;
