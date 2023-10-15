/**
 * Snippets for a particular programming language.
 */
class SnippetsCollection {
  constructor(path, type, scoped, snippets, language = "" ) {
    this.path = path;
    this.type = type;
		this.scoped = scoped;
    this.snippets = snippets;
		this.language = language.toLowerCase();
  }
}

module.exports = SnippetsCollection;
