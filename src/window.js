// eslint-disable-next-line import/no-unresolved
const vscode = require("vscode");
const path = require("path");
const Util = require("./util");
const Environment = require("./environment");

/**
 * Convenience class for the window of the editor.
 */
class Window {
  constructor(context) {
    this.context = context;
    this.env = new Environment(this.context);
  }

  /**
   * @async
   * Open a user snippet file. The user it prompted to pick a language.
   * @returns {Promise} The TextEditor that contains the user snippets document.
   */
  async openUserSnippetFile(language) {
    let dir = this.env.getUserSnippetsDirPath();
    let languageFile = `${language}.json`;
    let languageFilePath = path.join(dir, languageFile);
    await Util.createFileIfDoesNotExist(languageFilePath);

    let uri = vscode.Uri.file(decodeURIComponent(languageFilePath));
    let editor = await vscode.window.showTextDocument(uri);
    return editor;
  }

  /**
   * @async
   * Open a snippet file and jump to the snippet. If the snippet is not found, it will go to the first line.
   * @returns {Promise} The TextEditor that contains the user snippets document.
   */
  static async goToSnippet(uri, snippetName) {
    let textEditor = await vscode.window.showTextDocument(uri);
    let doc = textEditor.document;
    let text = doc.getText();

    let escapedSnippetName = Util.escapeStringRegexp(snippetName);
    let regex = new RegExp(`"${escapedSnippetName}".*?:.*?\\{`);
    let match = regex.exec(text);
    let index = 0;

    if (match !== null) {
      index = match.index;
    }

    let position = textEditor.document.positionAt(index);
    let range = new vscode.Range(position, position);
    textEditor.revealRange(range, vscode.TextEditorRevealType.AtTop);
    textEditor.selection = new vscode.Selection(position, position);
    return textEditor;
  }
}

module.exports = Window;
