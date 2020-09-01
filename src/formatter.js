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
   * Escapes HTML content removing traces of offending characters that could be wrongfully interpreted as markup. This is based on https://github.com/component/escape-html
   * @param {String} text The text to format.
   */
  static escapeHtml(text) {
    // eslint-disable-next-line prefer-template
    let str = "" + text;
    let matchHtmlRegExp = /["'&<>]/;
    let match = matchHtmlRegExp.exec(str);

    if (!match) {
      return str;
    }

    let escape;
    let html = "";
    let lastIndex = 0;
    let index;

    for ({ index } = match; index < str.length; index++) {
      switch (str.charCodeAt(index)) {
        case 34: // "
          escape = "&quot;";
          break;
        case 38: // &
          escape = "&amp;";
          break;
        case 39: // '
          escape = "&#39;";
          break;
        case 60: // <
          escape = "&lt;";
          break;
        case 62: // >
          escape = "&gt;";
          break;
        default:
          // eslint-disable-next-line no-continue
          continue;
      }

      if (lastIndex !== index) {
        html += str.substring(lastIndex, index);
      }

      lastIndex = index + 1;
      html += escape;
    }

    return lastIndex !== index ? html + str.substring(lastIndex, index) : html;
  }

  /**
   * Escapes all HTML content in the elements of an array and concatenates it into a string that can be consumed by a web page. Each value is appended with a HTML line break (BR tag).
   * @param {Array} array Array of values
   */
  static escapeBody(array) {
    let str = "";
    array.forEach((element) => {
      str += `${Formatter.escapeHtml(element)}<br>`;
    });
    return str;
  }
}

module.exports = Formatter;
