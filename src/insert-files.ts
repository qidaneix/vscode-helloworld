import * as vscode from 'vscode';
import * as path from 'path';

export default async (textEditor: vscode.TextEditor, files: vscode.Uri[]) => {
    // .md文件目录
    const folderPath = path.dirname(textEditor.document.uri.fsPath);
    const fileRelativePaths = files.map((item) => {
        return path.relative(folderPath, item.fsPath);
    });
    const hasIncorrectFile = fileRelativePaths.some((item) => {
        const fileName = path.basename(item);
        if (item.startsWith('..') || /^[a-zA-Z]:.*$/.test(item)) {
            // 引用项目目录以外的文件
            vscode.window.showWarningMessage(`The storage path of ${fileName} does not meet the requirements!`);
            return true;
        }
        return false;
    });
    if (!hasIncorrectFile) {
        for (const item of fileRelativePaths) {
            await textEditor.edit((editBuilder) => {
                editBuilder.insert(textEditor.selection.active, `
[${item}](${item})
`);
            });
        }
    }
};
