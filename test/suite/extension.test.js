let assert = require("assert");
const vscode = require("vscode");

describe("extension", function () {
  describe("snippets-ranger.show", function () {
    it("should create a webview", async () => {
      await vscode.commands.executeCommand("snippets-ranger.show");
      // how can i test webview?
      // assert.equal(1, 1);
    });
  });
});
