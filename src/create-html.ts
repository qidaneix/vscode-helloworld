import * as vscode from 'vscode';
import * as MarkdownIt from 'markdown-it';
import * as markdownItAttrs from 'markdown-it-attrs';
import * as markdownItBracketedSpans from 'markdown-it-bracketed-spans';
import * as fs from 'fs';
import * as util from 'util';

const writeFilePromise = util.promisify(fs.writeFile);

export default async (textEditor: vscode.TextEditor) => {
    const md = (new MarkdownIt()).use(markdownItAttrs).use(markdownItBracketedSpans);
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
