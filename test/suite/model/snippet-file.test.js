const assert = require("assert");
const SnippetsFile = require("../../../src/model/snippets-file");

describe("snippets-file.js", () => {
  describe("SnippetsFile", () => {
    it("should create a Snippets File object with values supplied for: path and snippets", () => {
      let snippet = {
        name: "Region Start",
        prefix: "#region",
        body: ["//#region"],
        description: "Folding Region Start",
        scope: "",
      };
      let file1 = new SnippetsFile("/somepath/java.json", [snippet]);
      let file2 = new SnippetsFile("/somepath/typescript.json", []);

      assert.strictEqual(file1.path, "/somepath/java.json");
      assert.strictEqual(file1.snippets[0], snippet);
      assert.strictEqual(file2.path, "/somepath/typescript.json");
    });

    it("should create a Snippets File object with a title that is the filename without the extension", () => {
      let file = new SnippetsFile("/somepath/java.json", "user", []);

      assert.strictEqual(file.getTitle(), "java");
    });

    it("should state if any of the snippets have the `scope` field populated", () => {
      let snippet = {
        name: "Region Start",
        prefix: "#region",
        body: ["//#region"],
        description: "Folding Region Start",
        scope: "java",
      };

      let file = new SnippetsFile("/somepath/java.json", [snippet]);
      assert.equal(file.isScoped(), true);
    });

    it(`should be able to associate a language with a Snippet File without duplication`, () => {
      let snippet = {
        name: "Region Start",
        prefix: "#region",
        body: ["//#region"],
        description: "Folding Region Start",
        scope: "java",
      };

      let file = new SnippetsFile("/somepath/java.json", [snippet]);
      file.addLanguage("java");
      file.addLanguage("kotlin");
      file.addLanguage("java");
      assert.equal(file.getLanguages().length, 2);
      assert.equal(file.getLanguages()[0], "java");
      assert.equal(file.getLanguages()[1], "kotlin");
    });

    it(`should be able to remove association of a language with a Snippet File`, () => {
      let snippet = {
        name: "Region Start",
        prefix: "#region",
        body: ["//#region"],
        description: "Folding Region Start",
        scope: "java",
      };

      let file = new SnippetsFile("/somepath/java.json", [snippet]);
      file.addLanguage("java");
      file.addLanguage("kotlin");

      assert.equal(file.getLanguages().length, 2);
      file.removeLanguage("java");
      assert.equal(file.getLanguages().length, 1);
      assert.equal(file.getLanguages()[0], "kotlin");
    });
  });
});
