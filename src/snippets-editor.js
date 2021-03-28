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
   * * @param {String} bodyText The body of the snippet you want to create.
   */
  async add(bodyText) {
    let language = await util.askForLanguage();

    if (language === undefined) {
      return;
    }

    try {
      this.editor = await this.window.openUserSnippets(language);
    } catch (err) {
      console.log(`Cannot open user snippets file. ${err.message}`);
    }

    this.insertSnippet(bodyText);
  }

  /**
   * @async
   * Insert a new snippet to the current text editor.
   * * @param {String} body The body of the snippet you want to create.
   */
  async insertSnippet(body) {
    if (!this.editor) {
      return;
    }

    let document = this.editor.document;
    let eolChar = "\n";

    if (document && document.eol === vscode.EndOfLine.CRLF) {
      eolChar = "\r\n";
    }

    let snippetString =
      eolChar + '"${1:enter a name}": {' + eolChar + ' "prefix": "${2}",';

    if (body.length > 1) {
      let bodyArray = formatter.convertToArray(body, eolChar);
      snippetString += `${eolChar} "body":  ${JSON.stringify(bodyArray)},`;
    } else {
      snippetString += eolChar + ' "body": ["${3}"],';
    }

    snippetString +=
      eolChar + ' "description" : "${4}"' + eolChar + "},${0}" + eolChar;

    let range = new vscode.Range(0, 1, 0, 1);
    this.editor.insertSnippet(new vscode.SnippetString(snippetString), range);
  }
}

module.exports = SnippetsEditor;
