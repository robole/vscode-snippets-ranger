/**
 * Extension-specific snippets.
 */
class ExtensionSnippets {
  constructor(name, displayName, publisher) {
    this.name = name;
    this.displayName = displayName;
		this.publisher = publisher;
		this.id = `${publisher}.${name}`;
    this.snippets = [];
  }

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
      this.snippets.push({ languages: languagesSet, path, data: [] });
    }
  }
}

module.exports = ExtensionSnippets;
