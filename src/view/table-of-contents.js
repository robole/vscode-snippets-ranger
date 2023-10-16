/**
 * A HTML Table of Contents created from data.
 */
class TableOfContents {
  constructor(data) {
    this.data = data;
  }

  /**
   * Get the Table of Contents as HTML.
   */
  getTableOfContents() {
    let html = `<div id="toc">
		<h2>Table of Contents</h2>
		<ul>
		<li><a href="#project">Project Snippets</a></li>`;
		html += this.createTableOfContentsEntry(this.projectIDs);
		html += `<li><a href="#user">User Snippets</a></li>`;
		html += this.createTableOfContentsEntry(this.userIDs);
    html += `<li><a href="#extension">Extension Snippets</a></li>`;
    html += this.createTableOfContentsEntry(this.extensionIDs);
    html += `<li><a href="#app">VS Code Snippets</a></li>`;
    html += this.createTableOfContentsEntry(this.appIDs);
    html += `</ul></div>`;
    return html;
  }

  /**
   * Get the Table of Contents entry for Extension snippets as HTML.
   */
  createTableOfContentsEntry(array) {
    let html = "<ul>";

    array.forEach((obj) => {
      html += `<li><a href=#${obj.id}>${obj.name}</a>`;
    });

    html += "</ul>";

    return html;
  }
}

module.exports = TableOfContents;
