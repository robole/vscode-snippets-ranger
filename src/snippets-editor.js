/* eslint-disable no-useless-escape, prefer-destructuring, no-template-curly-in-string */
const fs = require("fs");
const path = require("path");
const Snippet = require("./snippet");
const util = require("./util");
const formatter = require("./formatter");
const Window = require("./window");
const vscode = require("vscode");

/**
 * Responsible for adding new snippets it to a user snippet file of the user's choosing.
 */
class SnippetsEditor {
  constructor(context) {
    this.context = context;
    this.window = new Window(context);
    this.editor = null;
  }

  /**
   * @async
   * Add a new snippets to a user snippet file based on the language that the user selects.
   * * @param {Snippet} snippet The snippet you want to add.
   */
  async add(snippet) {
    let language = await util.askForLanguage();

    if (language === undefined) {
      return;
    }

    try {
      this.editor = await this.window.openUserSnippets(language);
    } catch (err) {
      console.log(`Cannot open user snippets file. ${err.message}`);
    }

    let range = new vscode.Range(0, 1, 0, 1);
    let snippetString = `${snippet.toString()},`;
    this.editor.insertSnippet(new vscode.SnippetString(snippetString), range);
  }
}

module.exports = SnippetsEditor;
