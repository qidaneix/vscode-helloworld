// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
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
		vscode.commands.registerTextEditorCommand('extension.insertOnlineImage', async (textEditor, edit) => {
			// The code you place here will be executed every time your command is executed
			if (isMarkdown(textEditor)) {
				edit.insert(textEditor.selection.active, `
![alt](link)
`);
			}
		})
	);

	context.subscriptions.push(
		vscode.commands.registerTextEditorCommand('extension.insertLocalImage', async (textEditor) => {
			// The code you place here will be executed every time your command is executed
			if (isMarkdown(textEditor)) {
				try {
					const images = await vscode.window.showOpenDialog({
						defaultUri: textEditor.document.uri,
						canSelectMany: true,
						filters: { 
							Images: ['png', 'jpg', 'jpeg', 'gif'],
						},
					});
					if (images) {
						// .md文件目录
						const folderPath = path.dirname(textEditor.document.uri.fsPath);
						const imageRelativePaths = images.map((item) => {
							return path.relative(folderPath, item.fsPath);
						});
						const hasIncorrectImage = imageRelativePaths.some((item) => {
							const imageName = path.basename(item);
							if (item.startsWith('..') || /^[a-zA-Z]:.*$/.test(item)) {
								// 引用项目目录以外的图片文件
								vscode.window.showWarningMessage(`${imageName}的存放路径不满足要求！`);
								return true;
							}
							if (!(/^.*?\.(png|jpg|jpeg|gif|PNG|JPG|JPEG|GIF)$/.test(item))) {
								// 引用非图片文件
								vscode.window.showWarningMessage(`${imageName}文件的格式不满足要求！`);
								return true;
							}
							return false;
						});
						if (!hasIncorrectImage) {
							for (const item of imageRelativePaths) {
								await textEditor.edit((editBuilder) => {
									editBuilder.insert(textEditor.selection.active, `
![${item}](${item})
`);
								});
							}
						}
					}
				} catch (error) {
					throw error;
				}
			}
		})
	);

	context.subscriptions.push(
		vscode.commands.registerTextEditorCommand('extension.addColor', async (textEditor, edit) => {
			// The code you place here will be executed every time your command is executed
			if (isMarkdown(textEditor)) {
				if (textEditor.selection.isEmpty) {
					vscode.window.showWarningMessage(`请选中一段文字！`);
					return false;
				}
				const item = await vscode.window.showQuickPick(['red', 'green', 'yellow'], { canPickMany: false });
				console.log(item);
				if (textEditor.selection.isReversed) {
					edit.insert(textEditor.selection.active, '<span style="color:red">');
					edit.insert(textEditor.selection.anchor, '</span>');
				} else {
					edit.insert(textEditor.selection.anchor, '<span style="color:red">');
					edit.insert(textEditor.selection.active, '</span>');
				}
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
