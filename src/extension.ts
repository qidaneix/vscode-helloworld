// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as marked from 'marked';
import { promises } from 'fs';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "markdownToRawHtml" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.markdownToRawHtml', () => {
		// The code you place here will be executed every time your command is executed
		if (!vscode.window.activeTextEditor) {
			vscode.window.showWarningMessage('请打开目录下的markdown格式文件！');
		} else if (!vscode.window.activeTextEditor.document.uri.fsPath.endsWith('.md')) {
			vscode.window.showWarningMessage('请打开目录下的markdown格式文件！');
		} else {
			const text = vscode.window.activeTextEditor.document.getText();
			const html = `<div id="sku-markdown">\n${marked(text)}</div>\n`;
			const result = promises.writeFile(`${vscode.window.activeTextEditor.document.uri.fsPath}.html`, html);
			result.then(() => {
				// Display a message box to the user
				vscode.window.showInformationMessage('HTML生成成功！');
			}).catch((err) => {
				vscode.window.showErrorMessage('HTML生成出错了！');
			});
		}
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
