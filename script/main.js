// @ts-nocheck
/* eslint-disable no-undef, no-unused-vars */
let script = (function () {
  const vscode = acquireVsCodeApi();

  let toTopLink = document.getElementById("toTopLink");
  let debounceTimer;

  window.onscroll = function () {
    if (debounceTimer) {
      window.clearTimeout(debounceTimer);
    }
    debounceTimer = window.setTimeout(() => {
      showToTopLink();
    }, 100);
  };

  function showToTopLink() {
    let gap = 750;

    if (
      document.body.scrollTop > gap ||
      document.documentElement.scrollTop > gap
    ) {
      toTopLink.style.display = "block";
    } else {
      toTopLink.style.display = "none";
    }
  }

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

  let deleteSnippet = function (path, snippetName, rowIndex) {
    vscode.postMessage({
      command: "deleteSnippet",
      path,
      snippetName,
    });

    let decodedPath = decodeURIComponent(path);
    let row = document.querySelector(
      `table[data-path='${decodedPath}'] tbody tr:nth-child(${rowIndex})`
    );

    if (row !== null) {
      row.remove();
    }
  };

  return {
    openFile,
    editSnippet,
    deleteSnippet,
  };
})();
