const { basename, normalize, resolve } = require("path");
const fs = require("fs");
const vscode = require("vscode");
const glob = require("glob");
const ExtensionSnippets = require("./extension-snippets");

/**
 * Environment information.
 */
class Environment {
  constructor(context) {
    this.context = context;
    this.os = process.platform;
    this.portableAppPath = process.env.VSCODE_PORTABLE;
    // @ts-ignore
    this.userSnippetsDir = this.resolveUserSnippetsDir();
    this.userExtensionsDir = this.resolveUserExtensionsDir();
  }

  /**
   * Get the filepath for User Snippets Directory.
   */
  resolveUserSnippetsDir() {
    let dir = "";
    if (this.portableAppPath === undefined) {
      dir = resolve(
        this.context.globalStoragePath,
        "../../..",
        "user",
        "snippets"
      ).concat(normalize("/"));
    } else {
      dir = resolve(
        this.portableAppPath,
        "user-data",
        "user",
        "snippets"
      ).concat(normalize("/"));
    }

    return dir;
  }

  /**
   * Get the filepath for User Extensions Directory.
   */
  resolveUserExtensionsDir() {
    let dir = "";
    if (this.portableAppPath === undefined) {
      dir = resolve(
        vscode.extensions.all.filter(
          (extension) => !extension.packageJSON.isBuiltin
        )[0].extensionPath,
        ".."
      ).concat(normalize("/"));
    } else {
      dir = resolve(this.portableAppPath, "extensions").concat(normalize("/"));
    }

    return dir;
  }

  /**
   * Get the filepaths for all of the User Snippets files.
   * @returns {Promise} Promise with array of filepaths.
   */
  async getUserSnippetsPaths() {
    let list = [];

    let filenames = await fs.promises.readdir(this.userSnippetsDir);
    filenames.forEach((file) => {
      let path = resolve(this.userSnippetsDir, file);
      list.push(path);
    });

    return list;
  }

  /**
   * Get the filepaths for all of App Snippets file.
   * @return {Promise} Promise with array of filepaths.
   */
  // eslint-disable-next-line class-methods-use-this
  async getAppSnippetsPaths() {
    let extensionRoot = resolve(vscode.env.appRoot, "extensions");
    return new Promise((fufil) => {
      glob(`${extensionRoot}/**/snippets/*.code-snippets`, {}, (err, files) => {
        fufil(files);
      });
    });
  }

  /**
   * Get the filepaths for all of Extension Snippets file.
   * @return {Promise} Promise with array of filepaths.
   */
  // eslint-disable-next-line class-methods-use-this
  async getExtensionSnippets() {
    let array = [];
    vscode.extensions.all.forEach((extension) => {
      let { packageJSON } = extension;
      if (
        packageJSON &&
        packageJSON.isBuiltin === false &&
        packageJSON.contributes &&
        packageJSON.contributes.snippets
      ) {
        let extensionSnippets = new ExtensionSnippets(
          packageJSON.name,
          packageJSON.displayName,
          packageJSON.publisher
        );
        packageJSON.contributes.snippets.forEach((snippet) => {
          let path = resolve(extension.extensionPath, snippet.path);
          extensionSnippets.addSnippetsFile(snippet.language, path);
        });
        array.push(extensionSnippets);
      }
    });

    return new Promise((fufil) => {
      fufil(array);
    });
  }

  /**
   * Get the file name without the extension.
   */
  static getLanguageName(path) {
    let name = basename(path);
    return name.split(".")[0];
  }
}
module.exports = Environment;
