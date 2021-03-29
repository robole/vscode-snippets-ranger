const assert = require("assert");
const formatter = require("../../src/formatter");

describe("Formatter", function () {
  describe("convertToArray()", function () {
    it("should create an array from a single-line string", function () {
      let array = formatter.convertToArray("some text");
      assert.strictEqual(array[0], "some text");
    });

    it("should create an array from a multi-line string", function () {
      let array = formatter.convertToArray("line 1\nline 2");
      assert.strictEqual(array.length, 2);
      assert.strictEqual(array[1], "line 2");
    });
  });

  describe("formatTitle()", function () {
    it("should capitilize most languages", function () {
      let js = formatter.formatTitle("javascript");
      let python = formatter.formatTitle("python");

      assert.strictEqual(js, "Javascript");
      assert.strictEqual(python, "Python");
    });

    it("should uppercase some languages", function () {
      let html = formatter.formatTitle("html");
      let css = formatter.formatTitle("css");

      assert.strictEqual(html, "HTML");
      assert.strictEqual(css, "CSS");
    });
  });

  describe("capitalize()", function () {
    it("should capitilize the first word", function () {
      let word = formatter.formatTitle("word1 word2");

      assert.strictEqual(word, "Word1 word2");
    });
  });

  describe("escapeHtml()", function () {
    it("should replace anything that could be interpeted as HTML with a text equivalent", function () {
      let text1 = formatter.escapeHtml(`This is the <html> tag.`);
      let text2 = formatter.escapeHtml(`No '"& allowed.`);
      let text3 = formatter.escapeHtml(`\t let x = 1;`);
      let text4 = formatter.escapeHtml(`Line 1.\r\n`);

      assert.strictEqual(text1, "This is the &lt;html&gt; tag.");
      assert.strictEqual(text2, "No &#39;&quot;&amp; allowed.");
      assert.strictEqual(text3, "&emsp; let x = 1;");
      assert.strictEqual(text4, "Line 1.<br/>");
    });
  });
});
