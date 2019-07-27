// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import isMarkdown from './is-markdown';
import createHTML from './create-html';
import createZip from './create-zip';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "ma ma markdown!" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	context.subscriptions.push(
		vscode.commands.registerTextEditorCommand('extension.insertTable', async (textEditor, edit) => {
			// The code you place here will be executed every time your command is executed
			if (isMarkdown(textEditor)) {
				edit.insert(textEditor.selection.active, `
|    |    |    |    |
|----|:---|---:|:--:|
|    |    |    |    |
|    |    |    |    |
`);
			}
		})
	);

	context.subscriptions.push(
		vscode.commands.registerTextEditorCommand('extension.insertLink', async (textEditor, edit) => {
			// The code you place here will be executed every time your command is executed
			if (isMarkdown(textEditor)) {
				edit.insert(textEditor.selection.active, `
[text](link)
`);
			}
		})
	);

	context.subscriptions.push(
		vscode.commands.registerTextEditorCommand('extension.insertImage', async (textEditor, edit) => {
			// The code you place here will be executed every time your command is executed
			if (isMarkdown(textEditor)) {
				edit.insert(textEditor.selection.active, `
![alt](link)
`);
			}
		})
	);

	context.subscriptions.push(
		vscode.commands.registerTextEditorCommand('extension.markdownToRawHtml', async (textEditor) => {
			// The code you place here will be executed every time your command is executed
			if (isMarkdown(textEditor)) {
				try {
					await createHTML(textEditor);
				} catch (error) {
					throw error;
				}
			}
		})
	);

	context.subscriptions.push(
		vscode.commands.registerTextEditorCommand('extension.markdownToZip', async (textEditor) => {
			// The code you place here will be executed every time your command is executed
			if (isMarkdown(textEditor)) {
				try {
					const saveDir = await vscode.window.showOpenDialog({
						canSelectFiles: false,
						canSelectFolders: true,
						canSelectMany: false,
					});
					if (saveDir) {
						await createHTML(textEditor);
						await createZip(textEditor, saveDir);
					}
				} catch (error) {
					throw error;
				}
			}
		})
	);

}

// this method is called when your extension is deactivated
export function deactivate() {}
