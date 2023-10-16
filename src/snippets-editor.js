/* eslint-disable class-methods-use-this */
// @ts-nocheck
/* eslint-disable import/no-unresolved, no-useless-escape, prefer-destructuring, no-template-curly-in-string */
const vscode = require("vscode");
const fs = require("fs");
const Window = require("./window");
const Util = require("./util");
const SnippetsFetcher = require("./snippets-fetcher");

/**
 * Responsible for adding new snippets it to a user snippet file of the user's choosing.
 */
class SnippetsEditor {
  constructor(context) {
    this.context = context;
    this.window = new Window(context);
  }

  /**
   * @async
   * Add a new snippet to a snippet file based on what the user selects from a quickpick.
   * * @param {Snippet} snippet The snippet you want to add.
   */
  async add(snippet) {
    //  if a global snippets file is created or no option is chosen, `selected` is undefined. otherwse, it is true
    let selected = await vscode.commands.executeCommand(
      "workbench.action.openSnippets"
    );

    let editor = vscode.window.activeTextEditor;

    // if user didnt selected an option
    if (
      selected === undefined &&
      editor.document.fileName.endsWith(".code-snippets") === false
    ) {
      return;
    }

    // default document language is JSON which is a bug!
    await vscode.languages.setTextDocumentLanguage(editor.document, "jsonc");

    let range = new vscode.Range(0, 1, 0, 1);
    let snippetString = `${snippet.toString()},`;

    editor.insertSnippet(new vscode.SnippetString(snippetString), range);
  }

  /**
   * @async
   * Delete a snippet from a snippet file.
   * @param {vscode.Uri} uri URI of the snippet file you want to delete the snippet from.
   * @param {String} snippetName The name of the snippet to delete
   * @returns {Promise} The TextEditor that contains the user snippets document.
   */
  async deleteSnippet(uri, snippetName) {
    let json = await SnippetsFetcher.getJson(uri.fsPath);
		delete json[snippetName];
    await fs.promises.writeFile(uri.fsPath, JSON.stringify(json, null, 2));
  }
}

module.exports = SnippetsEditor;
