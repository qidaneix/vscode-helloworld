import * as vscode from 'vscode';
import * as path from 'path';


export default (textEditor: vscode.TextEditor) => {
    if (path.extname(textEditor.document.uri.fsPath) !== '.md') {
        vscode.window.showWarningMessage('Please open the markdown format file in the directory!');
        return false;
    }
    return true;
};
