const { normalize, resolve } = require("path");
const fs = require("fs");
const vscode = require("vscode");
const glob = require("glob");

let portableAppPath = process.env.VSCODE_PORTABLE;

/**
 * Get the filepath for the folder that contains the user's snippets files.
 * @param {string} globalStoragePath - The absolute path for the VS Code installation.
 * @returns {string} The path for the folder containg the user's snippets files.
 */
function getUserSnippetsHome(globalStoragePath) {
  let path = "";

  if (portableAppPath === undefined) {
    path = resolve(globalStoragePath, "../../..", "User", "snippets").concat(
      normalize("/")
    );
  } else {
    path = resolve(portableAppPath, "user-data", "User", "snippets").concat(
      normalize("/")
    );
  }

  return path;
}

/**
 * Get the filepath for all of the user's snippets files.
 * @param {string} globalStoragePath - The absolute path for the VS Code installation.
 * @returns {Promise} Promise with array of filepaths.
 */
async function getUserSnippetPaths(globalStoragePath) {
  let userSnippetsHome = getUserSnippetsHome(globalStoragePath);
  let list = [];

  let filenames = await fs.promises.readdir(userSnippetsHome).catch((error) => {
    console.error(`No user snippets. ${error}`);
    return list;
  });

  filenames.forEach((file) => {
    let path = resolve(userSnippetsHome, file);
    list.push(path);
  });

  return list;
}

/**
 * Get the filepaths for all of built-in VS Code snippets files.
 * @return {Promise<Array>} Promise with array of filepaths.
 */
async function getAppSnippetPaths() {
  let extensionRoot = resolve(vscode.env.appRoot, "extensions");

  return new Promise((fufil, reject) => {
    glob(`${extensionRoot}/**/snippets/*.code-snippets`, {}, (err, files) => {
      if (err) {
        reject(err);
      } else {
        fufil(files);
      }
    });
  });
}

/**
 * Get the filepaths for all of the snippets files in the opened project.
 * @return {Promise<Array>} Promise with array of filepaths.
 */
async function getProjectSnippetPaths() {
  let root = vscode.workspace.workspaceFolders[0].uri.fsPath;

  return new Promise((fufil, reject) => {
    glob(`${root}/.vscode/*.code-snippets`, { dot: true }, (err, files) => {
      if (err) {
        reject(err);
      } else {
        fufil(files);
      }
    });
  });
}

module.exports = {
  getUserSnippetsHome,
  getUserSnippetPaths,
  getAppSnippetPaths,
  getProjectSnippetPaths,
};
