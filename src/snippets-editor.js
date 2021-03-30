/* eslint-disable no-useless-escape, prefer-destructuring, no-template-curly-in-string */
const Window = require("./window");
const vscode = require("vscode");

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

    // if user didnt selected an option, do nothing!
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
}

module.exports = SnippetsEditor;
