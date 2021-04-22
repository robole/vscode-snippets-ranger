// @ts-nocheck
/* eslint-disable no-undef, no-unused-vars */
let script = (function () {
  const vscode = acquireVsCodeApi();

  let openFile = function (path) {
    vscode.postMessage({
      command: "openSnippetFile",
      path,
    });
  };

  let editSnippet = function (path, snippetName) {
    vscode.postMessage({
      command: "editSnippet",
      path,
      snippetName,
    });
  };

  return {
    openFile,
    editSnippet,
  };
})();
