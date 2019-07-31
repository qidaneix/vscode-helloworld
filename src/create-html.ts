import * as vscode from 'vscode';
import * as MarkdownIt from 'markdown-it';
import * as fs from 'fs';
import * as util from 'util';

const writeFilePromise = util.promisify(fs.writeFile);

export default async (textEditor: vscode.TextEditor) => {
    const md = new MarkdownIt({
        html: true,
    });
    const text = textEditor.document.getText();
    const html = `<article class="vscode-body">\n${md.render(text)}</article>\n`;
    try {
        await writeFilePromise(`${textEditor.document.uri.fsPath}.html`, html);
        vscode.window.showInformationMessage('Generate HTML successfully!');
    } catch (error) {
        vscode.window.showErrorMessage('Failed to generate HTML!');
        throw error;
    }
};
