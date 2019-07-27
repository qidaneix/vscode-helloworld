import * as vscode from 'vscode';
import * as marked from 'marked';
import * as fs from 'fs';
import * as util from 'util';

const writeFilePromise = util.promisify(fs.writeFile);

export default async (textEditor: vscode.TextEditor) => {
    const text = textEditor.document.getText();
    const html = `<article id="sku-markdown">\n${marked(text)}</article>\n`;
    try {
        await writeFilePromise(`${textEditor.document.uri.fsPath}.html`, html);
        vscode.window.showInformationMessage('HTML生成成功！');
    } catch (error) {
        vscode.window.showErrorMessage('HTML生成出错了！');
        throw error;
    }
};
