/* eslint-disable no-useless-escape */
/* eslint-disable no-template-curly-in-string */
const vscode = require("vscode");
const util = require("../helper/util");
const { convertToArray } = require("../helper/format");

/**
 * @async
 * Add a new snippet to a snippet file of the user's choosing. The user is presented with a
 * QuickPick menu to choose an existing snippet file or to create a new file. It will open the file
 * and insert a snippet to enable you to complete a snippet entry in the file. The `body` field will
 * be populated with selected from the active `TextEditor`.
 */
async function addSnippet() {
  let activeEditor = vscode.window.activeTextEditor;
  let selection = "";

  if (activeEditor) {
    selection = activeEditor.document.getText(activeEditor.selection);
  }

  // If a file is selected from QuickPick, `true` is returned. If 'New Global Snippets file..' is selected
  // or no file is selected, then `undefined` is returned
  let selectedFile = await vscode.commands.executeCommand(
    "workbench.action.openSnippets"
  );
  activeEditor = vscode.window.activeTextEditor;

  // User did not select an option. This is not exact!! Exception is when a user does not select a file
  // and has a .code-snippets file open, this will insert a snippet into that file.
  if (
    selectedFile === undefined &&
    activeEditor.document.fileName.endsWith(".code-snippets") === false
  ) {
    return;
  }

  let snippetString = createSnippetString(selection);
  await insertSnippetAtTop(snippetString);
}

/**
 * Insert a snippet to the first line, second character of the active text editor
 *
 * @param {string} text - The text to convert
 * @returns {vscode.SnippetString}
 */
async function insertSnippetAtTop(snippetString) {
  let activeEditor = vscode.window.activeTextEditor;

  if (activeEditor === undefined) {
    return;
  }

  let range = new vscode.Range(0, 1, 0, 1);

  await activeEditor.insertSnippet(snippetString, range);
}

/**
 * Create a SnippetString object with tab stops for easy filling of fields. The `body` field is populated from
 * the `bodyText` argument, the value is converted into an array and has some special characters
 * such as the dollar sign escaped.
 *
 * @param {string} text - The text to convert
 * @returns {vscode.SnippetString}
 */
function createSnippetString(bodyText = "") {
  let body;
  let eol = util.getEndOfLineDelimiter();

  if (bodyText.length === 0) {
    body = `["\$5"]`;
  } else {
    let escapedText = escapeDollarSigns(bodyText);
    body = printAsArray(escapedText);
  }

  let string = `${eol}\t"\${1:name}" : {${eol}`;
  string += `\t\t"prefix" : "\$2",${eol}\t\t"description": "\$4",`;
  string += `${eol}\t\t"body" : ${body}${eol}\t},\$0`;

  return new vscode.SnippetString(string);
}

/**
 * Convert a string into an array and print. The text is split into element using a line break as a delimiter.
 * It is printed in the form of: ["element1", "element2"]
 * @param {string} text - The text to convert
 * @returns {string}
 */
function printAsArray(text) {
  let array = convertToArray(text);
  let string = "[";

  array.forEach((element, index) => {
    string += `"${escapeDoubleQuotes(element)}"`;

    if (index !== array.length - 1) {
      string += ", ";
    }
  });

  string += "]";

  return string;
}

/**
 * Escape dollar signs with multiple backslashes. This is to have a string retain a dollar sign
 * when it is used as text inserted into a snippet file and then used as a snippet. This requires
 * an unusual amount of backslash escapes to make it through the 2 steps!
 * @param {string} text - the text to update
 * @returns {string}
 */
function escapeDollarSigns(text) {
  return text.replaceAll(/\$/gm, "\\\\\\\\\\$");
}

/**
 * Escape double quote characters. Two backslashes are required in strings.
 * @param {string} text - the text to update
 * @returns {string}
 */
function escapeDoubleQuotes(text) {
  return text.replaceAll(/"/gm, `\\"`);
}

module.exports = { addSnippet };
