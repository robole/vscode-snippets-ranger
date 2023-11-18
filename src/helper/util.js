const vscode = require("vscode");
const fs = require("fs");

/**
 * If the file exists, it does nothing. If the file does not exist, it will create a new file with an empty object.
 */
async function createFileIfDoesNotExist(filePath) {
  try {
    await fs.promises.writeFile(filePath, "{ }", { flag: "wx" });
  } catch (err) {
    console.error(err);
  }
}

/**
 * Get the end of line delimiter for the platform you are running on. It
 * differs on windows and *nix platforms.
 * @returns {string}
 */
function getEndOfLineDelimiter() {
  let eol = "\n";

  if (process.platform === "win32") {
    eol = "\r\n";
  }

  return eol;
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

/**
 * Escape characters with special meaning either inside or outside character sets.
 */
function escapeStringRegexp(string) {
  if (typeof string !== "string") {
    throw new TypeError("Expected a string");
  }

  // Use a simple backslash escape when it’s always valid, and a `\xnn` escape when the simpler form would be disallowed by Unicode patterns’ stricter grammar.
  return string.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
}

module.exports = {
  createFileIfDoesNotExist,
  askForLanguage,
  escapeStringRegexp,
  getEndOfLineDelimiter,
};
