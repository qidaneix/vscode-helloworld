import * as vscode from 'vscode';
import * as marked from 'marked';
import { promises as fsPromises } from 'fs';


export default async (textEditor: vscode.TextEditor) => {
    const text = textEditor.document.getText();
    const html = `<article id="sku-markdown">\n${marked(text)}</article>\n`;
    try {
        await fsPromises.writeFile(`${textEditor.document.uri.fsPath}.html`, html);
        vscode.window.showInformationMessage('HTML生成成功！');
    } catch (error) {
        vscode.window.showErrorMessage('HTML生成出错了！');
        throw error;
    }
};
