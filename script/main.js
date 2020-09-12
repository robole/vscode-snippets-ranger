let script = (function () {
  const vscode = acquireVsCodeApi();

  let openFile = function (path) {
    console.log("open");
    vscode.postMessage({
      command: "openSnippetFile",
      path,
    });
  };
  return {
    openFile,
  };
})();
