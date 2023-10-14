/**
 * Formatter for snippet data.
 */
class Formatter {
  static formatTitle(language) {
    if (
      language === "html" ||
      language === "css" ||
      language === "xml" ||
      language === "php" ||
      language === "vb" ||
      language === "cpp"
    ) {
      return language.toUpperCase();
    }
    return this.capitalize(language);
  }

  /**
   * Capitalize the first letter of the first word.
   * @param {String} str String to capitalize.
   */
  static capitalize(str) {
    if (typeof str === "string") {
      return str.replace(/^\w/, (c) => c.toUpperCase());
    }
    return "";
  }

  /**
   * Transforms HTML content that could be wrongfully interpreted as markup.
   * @param {String} text The text to format.
   */
  static escapeHtml(text) {
    let str = text
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
			.replace(/\\/g, "&#92;&#92;")
      .replace(/\r?\n/g, "<br/>")
      .replace(/\t/g, "&emsp;");

    return str;
  }

  /**
   * Escapes all HTML content in the elements of an array and concatenates it into a string 
	 * that can be consumed by a web page. Each value is appended with a HTML line break (BR tag).
   * @param {Array} array Array of values
   */
  static escapeBody(array) {
    let str = "";
    array.forEach((element) => {
      str += Formatter.escapeHtml(element);
			str += "<br>";
    });
    return str;
  }

  static convertToArray(text, eolChar = "\n") {
    if (text.includes(eolChar) === false) {
      return [text];
    }

    let array = text.split(eolChar);
    return array;
  }
}

module.exports = Formatter;
