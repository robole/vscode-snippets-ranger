const assert = require("assert");
const SnippetsFile = require("../../../src/model/snippets-file");
const { createFileSection } = require("../../../src/view/file-section");

describe("file-section.js", () => {
  describe("createFileSection()", () => {
    it("should create a section with a heading and a 'view source' button", () => {
      let snippets = [];
      snippets[0] = {
        name: "Region Start",
        prefix: "#region",
        body: ["//#region"],
        description: "Folding Region Start",
        scope: "",
      };

      let snippetsFile = new SnippetsFile(
        "/somepath/java.code-snippets",
        snippets
      );

      let section = createFileSection(snippetsFile);

      let expected = `<header><h3>java.code-snippets</h3>`;
      expected += `<button type="button" class="sourceBtn" `;
      expected += `onclick="script.openFile('%2Fsomepath%2Fjava.code-snippets')">View Source File</button>`;

      assert.strictEqual(section.includes(expected), true);
    });

    it("should create a section with a snippets table when there are snippets", () => {
      let snippets = [];
      snippets[0] = {
        name: "Region Start",
        prefix: "#region",
        body: ["//#region"],
        description: "Folding Region Start",
        scope: "",
      };

      let snippetsFile = new SnippetsFile(
        "/somepath/java.code-snippets",
        snippets
      );

      let section = createFileSection(snippetsFile, "app");

      let expected = `<table data-path="/somepath/java.code-snippets"><thead>`;

      assert.strictEqual(section.includes(expected), true);
    });

    it("should create a section that states there are no snippets when there are no snippets", () => {
      let snippets = [];
      let snippetsFile = new SnippetsFile(
        "/somepath/java.code-snippets",
        snippets
      );

      let section = createFileSection(snippetsFile);
      let expected = `<p>No snippets`;

      assert.strictEqual(section.includes(expected), true);
    });
  });
});
