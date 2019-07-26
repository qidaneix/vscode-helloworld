import * as vscode from 'vscode';
import * as path from 'path';


export default (textEditor: vscode.TextEditor) => {
    if (path.extname(textEditor.document.uri.fsPath) !== '.md') {
        vscode.window.showWarningMessage('请打开目录下的markdown格式文件！');
        return false;
    }
    return true;
};
