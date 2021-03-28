const path = require("path");
const Util = require("./util");
const Environment = require("./environment");
const vscode = require("vscode");

/**
 * Convenience class for the current window of the editor.
 */
class Window {
  constructor(context) {
    this.context = context;
    this.env = new Environment(this.context);
  }

  /**
   * @async
   * Open a user snippet file. The user it prompted to pick a language.
   * @returns {vscode.TextEditor} The TextEditor that contains the user snippets document.
   */
  async openUserSnippets(language) {
    let dir = this.env.getUserSnippetsDirPath();
    let languageFile = `${language}.json`;
    let languageFilePath = path.join(dir, languageFile);
    await Util.createFileIfDoesNotExist(languageFilePath);

    let uri = vscode.Uri.file(decodeURIComponent(languageFilePath));
    let editor = await vscode.window.showTextDocument(uri);
    return editor;
  }
}

module.exports = Window;
