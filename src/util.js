const fs = require("fs");
const vscode = require("vscode");

/**
 * If the file exists, it does nothing. If  the file does not exist, it will create a new file with an empty object.
 */
async function createFileIfDoesNotExist(filePath) {
  try {
    await fs.promises.writeFile(filePath, "{ }", { flag: "wx" });
  } catch (err) {
    console.log(err);
  }
}

/**
 * Prompts the user to pick a language with a quickpicker.
 */
async function askForLanguage() {
  let languages = await vscode.languages.getLanguages();

  let options = {
    placeHolder: "Pick a language",
  };

  const result = await vscode.window.showQuickPick(languages.sort(), options);
  return result;
}

module.exports = { createFileIfDoesNotExist, askForLanguage };
