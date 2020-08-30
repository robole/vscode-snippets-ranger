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

  static capitalize(str) {
    if (typeof str === "string") {
      return str.replace(/^\w/, (c) => c.toUpperCase());
    }
    return "";
  }
}

module.exports = Formatter;
