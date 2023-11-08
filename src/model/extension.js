function addSnippetsFile(snippetsFile) {
  this.snippetsFiles.push(snippetsFile);
}

/* A VS Code extension */
function Extension(id, name = "", path = "") {
  let snippetsFiles = [];

  return {
    id,
    name,
    path,
    snippetsFiles,
    addSnippetsFile,
  };
}

module.exports = Extension;
