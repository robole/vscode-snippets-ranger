const assert = require("assert");
const format = require("../../../src/helper/format");

describe("format.js", () => {
  describe("convertToArray()", () => {
    it("should create an array from a single-line string", () => {
      let array = format.convertToArray("some text");
      assert.strictEqual(array[0], "some text");
    });

    it("should create an array from a multi-line string on windows", () => {
      let array = format.convertToArray("line 1\r\nline 2");
      assert.strictEqual(array.length, 2);
      assert.strictEqual(array[1], "line 2");
    });

    it("should create an array from a multi-line string on *nix", () => {
      let array = format.convertToArray("line 1\nline 2");
      assert.strictEqual(array.length, 2);
      assert.strictEqual(array[1], "line 2");
    });
  });

  describe("capitalize()", () => {
    it("should capitilize the first word", () => {
      let word = format.capitalize("word1 word2");

      assert.strictEqual(word, "Word1 word2");
    });
  });

  describe("escapeHtml()", () => {
    it("should replace html element with a HTML-safe equivalent", () => {
      let text1 = format.escapeHtml(`This is the <html> tag.`);

      assert.strictEqual(text1, "This is the &lt;html&gt; tag.");
    });

    it("should replace single quotes, double quotes, and ampersands with a HTML-safe equivalent", () => {
      let text2 = format.escapeHtml(`No '"& allowed.`);

      assert.strictEqual(text2, "No &#39;&quot;&amp; allowed.");
    });

    it("should replace a tab with a HTML-safe equivalent", () => {
      let text3 = format.escapeHtml(`\t let x = 1;`);

      assert.strictEqual(text3, "&emsp; let x = 1;");
    });

    it("should replace line breaks with a HTML-safe equivalent", () => {
      let text1 = format.escapeHtml(`Line 1.\r\nLine 2.`);
      let text2 = format.escapeHtml(`Line 1.\nLine 2.`);

      assert.strictEqual(text1, "Line 1.<br/>Line 2.");
      assert.strictEqual(text2, "Line 1.<br/>Line 2.");
    });

    it("should replace an escaped backslash with a HTML-safe equivalent", () => {
      let text = format.escapeHtml("`\\$num is a variable`;");
      assert.strictEqual(text, "`&#92;&#92;$num is a variable`;");
    });
  });

  describe("slugify()", () => {
    it("should slugify in a GitHub style by creating a trimmed, lowercase, hypenated version of the string", () => {
      assert.equal(format.slugify(" Robole Github com "), "robole-github-com");
    });

    it("should slugify by removing characters that are not: a letter, space or hypen", () => {
      assert.equal(format.slugify("robole 🙏 com"), "robole--com");
      assert.equal(
        format.slugify("Uniform Resource Locator (URL)"),
        "uniform-resource-locator-url"
      );
      assert.equal(format.slugify("[re] [] [f])"), "re--f");
      assert.equal(format.slugify("[robole.github.io"), "robolegithubio");
      assert.equal(format.slugify("robole 🙏 com-"), "robole--com-");
      assert.equal(format.slugify("ha 🐇-👎"), "ha--");
    });
  });

  describe("escape()", () => {
    it("should replace html elements with a HTML-safe equivalent for a string", () => {
      let body = format.escape(`This is the <html> tag.`);

      assert.strictEqual(body, "This is the &lt;html&gt; tag.");
    });

    it("should replace html elements with a HTML-safe equivalent for an array", () => {
      let text1 = format.escape([`This is the <html> tag.`, `\t let x = 1;`]);

      assert.strictEqual(
        text1,
        "This is the &lt;html&gt; tag.<br>&emsp; let x = 1;<br>"
      );
    });
  });
});
