/* eslint-disable no-template-curly-in-string */
const assert = require("assert");
const Snippet = require("../../../src/model/snippet");
const util = require("../../../src/helper/util");

describe("snippets.js", () => {
  describe("Snippet", () => {
    it("should create an empty object if no arguments given to constructor", () => {
      let mySnippet = new Snippet();
      assert.strictEqual(mySnippet.name, "", "name is not empty");
      assert.strictEqual(mySnippet.description, "", "description is not empty");
      assert.strictEqual(
        Array.isArray(mySnippet.prefix),
        true,
        "prefix is not an array"
      );
      assert.strictEqual(
        Array.isArray(mySnippet.body),
        true,
        "body is not an array"
      );
    });

    it("should allow double quotes in fields", () => {
      let mySnippet = new Snippet(
        `my "name"`,
        `my "prefix"`,
        `my "body"`,
        `my "description"`
      );
      assert.strictEqual(mySnippet.name, `my "name"`);
      assert.strictEqual(mySnippet.description, `my "description"`);
      assert.strictEqual(mySnippet.prefix[0], `my "prefix"`);
      assert.strictEqual(mySnippet.body[0], `my "body"`);
    });

    it("should format the `scope` field to be a sorted list of languages with equal whitespace", () => {
      let snippet = new Snippet(
        "stylelint disable next line",
        "stylelint disable next line",
        ["/* stylelint-disable-next-line ${1:rule} */$0"],
        "Disable Stylelint on the next line. If no rule is specified, then all rules will be disabled.",
        `xsl,html,css,less, javascript, javascriptreact, markdown, source.markdown.math, 
				postcss, sass, scss, source.css.styled, styled-css, sugarss, svelte, typescript,
				typescriptreact, vue, vue-html, vue-postcss, xml, `
      );

      let expectedResult = `css, html, javascript, javascriptreact, less, markdown, postcss, sass, scss, `;
      expectedResult += `source.css.styled, source.markdown.math, styled-css, sugarss, svelte, typescript, `;
      expectedResult += `typescriptreact, vue, vue-html, vue-postcss, xml, xsl`;

      assert.strictEqual(snippet.scope, expectedResult);
    });
  });
});
