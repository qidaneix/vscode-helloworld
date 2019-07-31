import * as vscode from 'vscode';

export default async (textEditor: vscode.TextEditor, startTag: string, endTag: string) => {
    if (textEditor.selection.isReversed) {
        await textEditor.edit((editBuilder) => {
            editBuilder.insert(textEditor.selection.active, startTag);
            editBuilder.insert(textEditor.selection.anchor, endTag);
        });
    } else {
        await textEditor.edit((editBuilder) => {
            editBuilder.insert(textEditor.selection.anchor, startTag);
            editBuilder.insert(textEditor.selection.active, endTag);
        });
    }
};
