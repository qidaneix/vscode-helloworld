import * as vscode from 'vscode';
import * as path from 'path';

export default async (textEditor: vscode.TextEditor, images: vscode.Uri[]) => {
    // .md文件目录
    const folderPath = path.dirname(textEditor.document.uri.fsPath);
    const imageRelativePaths = images.map((item) => {
        return path.relative(folderPath, item.fsPath);
    });
    const hasIncorrectImage = imageRelativePaths.some((item) => {
        const imageName = path.basename(item);
        if (item.startsWith('..') || /^[a-zA-Z]:.*$/.test(item)) {
            // 引用项目目录以外的图片文件
            vscode.window.showWarningMessage(`The storage path of ${imageName} does not meet the requirements!`);
            return true;
        }
        if (!(/^.*?\.(png|jpg|jpeg|gif|webp|PNG|JPG|JPEG|GIF|WEBP)$/.test(item))) {
            // 引用非图片文件
            vscode.window.showWarningMessage(`The format of the ${imageName} file does not meet the requirements!`);
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
};
