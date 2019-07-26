import * as vscode from 'vscode';
import * as JSZip from 'jszip';
import * as path from 'path';
import { promises as fsPromises, createWriteStream } from 'fs';
import recursiveReaddir from './recursive-readdir';
import openExplorer from './open-explorer';


export default async (textEditor: vscode.TextEditor, saveDir: vscode.Uri[]) => {
    // .md文件目录
    const folderPath = path.dirname(textEditor.document.uri.fsPath);
    // .md父文件夹名
    const folderName = path.basename(folderPath);
    // .zip文件存放位置
    const savePath = path.join(saveDir[0].fsPath, `${folderName}.zip`);
    const mdZip = (new JSZip()).folder(folderName);
    try {
        const files = await recursiveReaddir(folderPath);
        for (const item of files) {
            const file = await fsPromises.readFile(item);
            mdZip.file(path.relative(folderPath, item), file);
        }
        mdZip
            .generateNodeStream({ type: 'nodebuffer', streamFiles: true })
            .pipe(createWriteStream(savePath))
            .on('finish', async () => { 
                // JSZip generates a readable stream with a "end" event,
                // but is piped here in a writable stream which emits a "finish" event.
                vscode.window.showInformationMessage('zip生成成功！');
                await openExplorer(savePath);
            });
    } catch (error) {
        vscode.window.showErrorMessage('文件、文件夹读取出错了！');
        throw error;
    }
};
