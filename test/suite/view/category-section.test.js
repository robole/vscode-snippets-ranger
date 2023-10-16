const assert = require("assert");
const SnippetsFile = require("../../../src/model/snippets-file");
const { createCategorySection } = require("../../../src/view/category-section");

describe("category-section.js", () => {
  describe("createCategorySection()", () => {
    it("should create a section with a heading", () => {
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

      let section = createCategorySection([snippetsFile], "user");
      let expected = `<section id="user"><h2>User Snippets</h2>`;

      assert.strictEqual(section.startsWith(expected), true);
    });

    it("should create a subsection for each snippets file", () => {
      let snippets = [];
      snippets[0] = {
        name: "Region Start",
        prefix: "#region",
        body: ["//#region"],
        description: "Folding Region Start",
        scope: "",
      };

      let snippetsFile = new SnippetsFile(
        "/somepath/global-snippets.code-snippets",
        snippets
      );

      let section = createCategorySection([snippetsFile], "user");

      let expected = `<header><h3>global-snippets.code-snippets</h3>`;

      assert.strictEqual(section.includes(expected), true);
    });

    it("should create a section that states there are no snippets when there are no snippets", () => {
      let section = createCategorySection([], "user");
      let expected = `<p class="empty">Oucho Gaucho!`;

      assert.strictEqual(section.includes(expected), true);
    });
  });
});
