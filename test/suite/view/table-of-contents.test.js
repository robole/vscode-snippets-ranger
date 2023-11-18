const assert = require("assert");
const {
  createTableOfContents,
} = require("../../../src/view/table-of-contents");
const SnippetsFile = require("../../../src/model/snippets-file");
const Extension = require("../../../src/model/extension");

describe("table-of-contents.js", () => {
  describe("createTableOfContents()", () => {
    it("should create a table with category entries", () => {
      let toc = createTableOfContents(); // OR createTableOfContents([], [], [], []);

      let expected = `<div id="toc"><h2>Table of Contents</h2><ul><li><a href="#project">Project Snippets</a></li>`;
      expected += `<li><a href="#user">User Snippets</a></li><li><a href="#extension">Extension Snippets</a></li>`;
      expected += `<li><a href="#app">App Snippets</a></li></ul></div>`;

      assert.strictEqual(toc, expected);
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

      let expected = `<div id="toc"><h2>Table of Contents</h2><ul>`;
      expected += `<li><a href="#project">Project Snippets</a><ul>`;
      expected += `<li><a href="#somepathacode-snippets">a</a></li>`;
      expected += `<li><a href="#somepathbcode-snippets">b</a></li></ul></li>`;
      expected += `<li><a href="#user">User Snippets</a></li>`;
      expected += `<li><a href="#extension">Extension Snippets</a></li>`;
      expected += `<li><a href="#app">App Snippets</a></li>`;
      expected += `</ul></div>`;

      assert.strictEqual(toc, expected);
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

      let expected = `<div id="toc"><h2>Table of Contents</h2><ul>`;
      expected += `<li><a href="#project">Project Snippets</a></li>`;
      expected += `<li><a href="#user">User Snippets</a></li>`;
      expected += `<li><a href="#extension">Extension Snippets</a><ul>`;
      expected += `<li><a href="#robole-snippets-ranger">Snippets Ranger</a><ul>`;
      expected += `<li><a href="#somepathacode-snippets">a</a></li>`;
      expected += `<li><a href="#somepathbcode-snippets">b</a></li>`;
      expected += `</ul></li></ul></li>`;
      expected += `<li><a href="#app">App Snippets</a></li>`;
      expected += `</ul></div>`;

      assert.strictEqual(toc, expected);
    });
  });
});
