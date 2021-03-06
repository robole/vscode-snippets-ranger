const assert = require("assert");
const Snippet = require("../../src/snippet");

describe("Snippet", function () {
  it("should create an empty object if no arguments given to constructor", function () {
    let mySnippet = new Snippet();
    assert.strictEqual(mySnippet.name, "");
    assert.strictEqual(mySnippet.description, "");
    assert.strictEqual(mySnippet.prefix, "");
    assert.strictEqual(typeof mySnippet.body === "object", true); // it should be an array
  });

  it("should allow double quotes in fields", function () {
    let mySnippet = new Snippet(
      `my "name"`,
      `my "prefix"`,
      `my "body"`,
      `my "description"`
    );
    assert.strictEqual(mySnippet.name, 'my "name"');
    assert.strictEqual(mySnippet.description, 'my "description"');
    assert.strictEqual(mySnippet.prefix, 'my "prefix"');
    assert.strictEqual(mySnippet.body[0], 'my "body"');
  });

  it("should produce a string of the object", function () {
    let mySnippet = new Snippet(
      `map js`,
      `map`,
      ['console.log("err");', 'alert("hello");'],
      "blah"
    );

    let eol = "\n";

    if (process.platform === "win32") {
      eol = "\r\n";
    }

    let expectedResult = `${eol}"map js" : {${eol}\t"prefix": "map",${eol}\t"body": ["console.log(\\"err\\");","alert(\\"hello\\");"],${eol}\t"description": "blah"${eol}}`;

    assert.strictEqual(mySnippet.toString(), expectedResult);
  });
});
