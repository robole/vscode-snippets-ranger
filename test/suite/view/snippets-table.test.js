const assert = require("assert");
const SnippetsFile = require("../../../src/model/snippets-file");
const { createSnippetsTable } = require("../../../src/view/snippets-table");

describe("snippets-table.js", () => {
  describe("createSnippetsTable()", () => {
    let editIcon = `<svg viewBox="0 0 16 16" preserveAspectRatio="xMaxYMax meet" xmlns="http://www.w3.org/2000/svg"><path d="M13.23 1h-1.46L3.52 9.25l-.16.22L1 13.59 2.41 15l4.12-2.36.22-.16L15 4.23V2.77L13.23 1zM2.41 13.59l1.51-3 1.45 1.45-2.96 1.55zm3.83-2.06L4.47 9.76l8-8 1.77 1.77-8 8z"/></svg>`;
    let deleteIcon = `<svg viewBox="0 0 16 16" preserveAspectRatio="xMaxYMax meet" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M10 3h3v1h-1v9l-1 1H4l-1-1V4H2V3h3V2a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v1zM9 2H6v1h3V2zM4 13h7V4H4v9zm2-8H5v7h1V5zm1 0h1v7H7V5zm2 0h1v7H9V5z"/></svg>`;

    it("should create a table from a snippets file", () => {
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

      let table = createSnippetsTable(snippetsFile);

      let expected = `<table data-path="/somepath/java.code-snippets"><thead>`;
      expected += `<th>Prefix</th><th>Name</th><th>Description</th><th>Body</th><th>Action</th></thead>`;
      expected += `<tbody>`;
      expected += `<tr data-name="Region Start"><td>#region</td><td>Region Start</td><td>Folding Region Start</td><td><code>//#region<br></code></td>`;
      expected += `<td><button type="button" class="editBtn actionBtn" title="Edit" onclick="script.editSnippet('%2Fsomepath%2Fjava.code-snippets', 'Region Start')">`;
      expected += `${editIcon}</button><button type="button" class="deleteBtn actionBtn" title="Delete" onclick="script.deleteSnippet('%2Fsomepath%2Fjava.code-snippets', 'Region Start')">`;
      expected += `${deleteIcon}</button></td></tr>`;
      expected += `</tbody></table>`;

      assert.strictEqual(table, expected);
    });

    it("should create an empty table if there is are no snippets provided", () => {
      let snippetsFile = new SnippetsFile("/somepath/java.json", []);

      let table = createSnippetsTable(snippetsFile);

      let expected = `<table data-path="/somepath/java.json"><thead><th>Prefix</th><th>Name</th>`;
      expected += `<th>Description</th><th>Body</th><th>Action</th></thead><tbody>`;
      expected += `</tbody></table>`;

      assert.strictEqual(table, expected);
    });

    it("should create a table with the 'scope' column when a snippet has a populated `scope` field", () => {
      let snippet = {
        name: "Region Start",
        prefix: "#region",
        body: ["//#region"],
        description: "Folding Region Start",
        scope: "java",
      };

      let snippetsFile = new SnippetsFile("/somepath/a.code-snippets", [
        snippet,
      ]);

      let table = createSnippetsTable(snippetsFile);

      let expected = `<table data-path="/somepath/a.code-snippets" class="scoped-table"><thead><th>Prefix</th><th>Name</th>`;
      expected += `<th>Description</th><th>Body</th><th>Scope</th><th>Action</th></thead><tbody>`;

      assert.strictEqual(table.startsWith(expected), true);
    });

    it("should create a table when a snippet contains reserved HTML characters", () => {
      let snippet = {
        name: "test",
        prefix: ["<html>", "test"],
        body: ["This is <i>"],
        description: "Testing <div>",
        scope: "<bogus>",
      };

      let snippetsFile = new SnippetsFile("/somepath/a.code-snippets", [
        snippet,
      ]);

      let table = createSnippetsTable(snippetsFile);

      let expected = `<tr data-name="test"><td><ul class="prefix-list simple-list"><li><code>&lt;html&gt;</code></li><li><code>test</code></li></ul></td><td>test</td><td>Testing &lt;div&gt;</td><td><code>This is &lt;i&gt;<br></code></td><td>&lt;bogus&gt;</td>`;

      assert.strictEqual(table.includes(expected), true);
    });
  });
});
