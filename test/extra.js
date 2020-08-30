this.panel.webview.onDidReceiveMessage(
  async (message) => {
    switch (message.command) {
      case "openSnippetFile":
        vscode.window.showErrorMessage(message.text);
        return vscode.workspace.openTextDocument(message.text);
    }
  },
  {},
  this.context.subscriptions
);

let script = this.getScript();
section += `<button onclick="open('${uri}')")>Open source file</button>`;

getScript() {
	let script = `<script>
		(function() {
			const vscode = acquireVsCodeApi();

			function open(path){
				window.alert("open");
				vscode.postMessage({
					command: 'openSnippetFile',
					text: path
				});
			}
		}())
</script>`;
	return script;
}
