import * as vscode from 'vscode';

const PBURL = 'https://pastebin.com/api/api_post.php';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('pastebincode.pastebinCode', () => {
		let APIPB : string | undefined = vscode.workspace.getConfiguration().get("pastebincode.pastebinAPI");
		let FORMATPB : string | undefined = vscode.workspace.getConfiguration().get("pastebincode.pastebinFormat");
		if (APIPB === undefined || APIPB === "") {
			const header = "Pastebin developer key didn't set";
			const options: vscode.MessageOptions = { detail: "Please, set your Pastebin developer key in settings", modal: true};
			const ok: vscode.MessageItem = {title: "OK",  isCloseAffordance: true };
			vscode.window.showInformationMessage(header, options, ok);
			return;
		}
		if (FORMATPB === undefined) {
			return;
		}
		console.log(APIPB);
		const editor = vscode.window.activeTextEditor;
		const selection = editor?.selection;
		if (selection === undefined || selection.isEmpty) {	
			vscode.window.showInformationMessage('Please, selection code!');
			return;
		}
		const selectionRange = new vscode.Range(selection?.start, selection?.end);
		const highlighted = editor?.document.getText(selectionRange);
		const content = {
			'api_dev_key': APIPB,
			'api_paste_code': String(highlighted),
			'api_option': 'paste',
			'api_paste_format': FORMATPB
		};
		fetch(PBURL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
			},
			body: new URLSearchParams(content).toString()
			 }).then((response) => {
				if (response.status !== 200) {
					const header = "Invalid Pastebin developer key";
					const options: vscode.MessageOptions = { detail: "Please, set valid Pastebin developer key", modal: true};
					const ok: vscode.MessageItem = {title: "OK",  isCloseAffordance: true };
					vscode.window.showInformationMessage(header, options, ok);
				} else {
					console.log(response.text().then((link) => {
						console.log(link);
						vscode.env.clipboard.writeText(link);
						vscode.window.showInformationMessage('Code is copied! Link in clipboard!');
					}));
				}
			 });
	});
	context.subscriptions.push(disposable);
}

export function deactivate() {}
