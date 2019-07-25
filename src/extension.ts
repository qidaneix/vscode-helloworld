// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as marked from 'marked';
import * as JSZip from 'jszip';
import { promises as fsPromises, createWriteStream } from 'fs';
import * as path from 'path';
import recursiveReaddir from './recursive-readdir';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "markdownToRawHtml" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.markdownToRawHtml', async () => {
		// The code you place here will be executed every time your command is executed
		if (!vscode.window.activeTextEditor) {
			vscode.window.showWarningMessage('请打开目录下的markdown格式文件！');
		} else if (path.extname(vscode.window.activeTextEditor.document.uri.fsPath) !== '.md') {
			vscode.window.showWarningMessage('请打开目录下的markdown格式文件！');
		} else {
			const text = vscode.window.activeTextEditor.document.getText();
			const html = `<article id="sku-markdown">\n${marked(text)}</article>\n`;
			try {
				await fsPromises.writeFile(`${vscode.window.activeTextEditor.document.uri.fsPath}.html`, html);
				vscode.window.showInformationMessage('HTML生成成功！');
				try {
					const folderPath = path.dirname(vscode.window.activeTextEditor.document.uri.fsPath);
					const folderName = path.basename(folderPath);
					const files = await recursiveReaddir(folderPath);
					const mdZip = (new JSZip()).folder(folderName);
					for (const item of files) {
						const file = await fsPromises.readFile(item);
						mdZip.file(path.relative(folderPath, item), file);
					}
					mdZip
						.generateNodeStream({ type:'nodebuffer', streamFiles:true })
						.pipe(createWriteStream(path.join(folderPath, `${folderName}.zip`)))
						.on('finish', function () { 
							// JSZip generates a readable stream with a "end" event,
							// but is piped here in a writable stream which emits a "finish" event.
							vscode.window.showInformationMessage('zip生成成功！');
						});
					vscode.window.showInformationMessage('文件夹读取成功！');
				} catch (error) {
					vscode.window.showErrorMessage('文件夹读取出错了！');
				}
			} catch (error) {
				// Display a message box to the user
				vscode.window.showErrorMessage('HTML生成出错了！');
			}
		}
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
