/**
 * Snippets for a particular programming language.
 */
class LanguageSnippets {
  constructor(language, path, type, snippets) {
    this.language = language.toLowerCase();
    this.path = path;
    this.type = type;
    this.snippets = snippets;
  }
}

module.exports = LanguageSnippets;
