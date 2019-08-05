import * as vscode from 'vscode';

export default async (textEditor: vscode.TextEditor, startStr: string, endStr: string) => {
    if (textEditor.selection.isReversed) {
        await textEditor.edit((editBuilder) => {
            editBuilder.insert(textEditor.selection.active, startStr);
            editBuilder.insert(textEditor.selection.anchor, endStr);
        });
    } else {
        await textEditor.edit((editBuilder) => {
            editBuilder.insert(textEditor.selection.anchor, startStr);
            editBuilder.insert(textEditor.selection.active, endStr);
        });
    }
};
