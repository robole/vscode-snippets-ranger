const assert = require("assert");
const {
  createTableOfContents,
} = require("../../../src/view/table-of-contents");
const SnippetsFile = require("../../../src/model/snippets-file");
const Extension = require("../../../src/model/extension");

describe("table-of-contents.js", () => {
  describe("createTableOfContents()", () => {
    it("should create an empty table if an empty outline is provided", () => {
      let toc = createTableOfContents(); // OR createTableOfContents([], [], [], []);

      assert.strictEqual(toc, "");
    });

    it("should create a table with an entry for a collection of snippets files", () => {
      let snippetsFile1 = new SnippetsFile("/somepath/a.code-snippets", []);
      let snippetsFile2 = new SnippetsFile("/somepath/b.code-snippets", []);

      let toc = createTableOfContents(
        [snippetsFile1, snippetsFile2],
        [],
        [],
        []
      );

      let expectedOutput = `<div id="toc"><h2>Table of Contents</h2><ul>`;
      expectedOutput += `<li><a href="#project">Project Snippets</a><ul>`;
      expectedOutput += `<li><a href="#somepathacode-snippets">a</a></li>`;
      expectedOutput += `<li><a href="#somepathbcode-snippets">b</a></li>`;
      expectedOutput += `</ul></li>`;
      expectedOutput += `</ul></div>`;

      assert.strictEqual(toc, expectedOutput);
    });

    it("should create a table with an entry for an extension and its snippets files", () => {
      let snippetsFile1 = new SnippetsFile("/somepath/a.code-snippets", []);
      let snippetsFile2 = new SnippetsFile("/somepath/b.code-snippets", []);
      let extension = new Extension(
        "robole-snippets-ranger",
        "Snippets Ranger",
        "/somepath/snippets-ranger"
      );
      extension.snippetsFiles = [snippetsFile1, snippetsFile2];

      let toc = createTableOfContents([], [], [], [extension]);

      let expectedOutput = `<div id="toc"><h2>Table of Contents</h2><ul>`;
      expectedOutput += `<li><a href="#extension">Extension Snippets</a><ul>`;
      expectedOutput += `<li><a href="#robole-snippets-ranger">Snippets Ranger</a><ul>`;
      expectedOutput += `<li><a href="#somepathacode-snippets">a</a></li>`;
      expectedOutput += `<li><a href="#somepathbcode-snippets">b</a></li>`;
      expectedOutput += `</ul></li></ul>`;
      expectedOutput += `</li></ul></div>`;

      assert.strictEqual(toc, expectedOutput);
    });
  });
});
