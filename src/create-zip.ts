import * as vscode from 'vscode';
import * as JSZip from 'jszip';
import * as path from 'path';
import * as fs from 'fs';
import * as util from 'util';
import recursiveReadFile from './recursive-read-file';
import openExplorer from './open-explorer';

const readFilePromise = util.promisify(fs.readFile);

export default async (textEditor: vscode.TextEditor, saveDir: vscode.Uri) => {
    // .md文件目录
    const folderPath = path.dirname(textEditor.document.uri.fsPath);
    // .md父文件夹名
    const folderName = path.basename(folderPath);
    // .zip文件存放位置
    const savePath = path.join(saveDir.fsPath, `${folderName}.zip`);
    const mdZip = (new JSZip()).folder(folderName);
    try {
        const files = await recursiveReadFile(folderPath);
        for (const item of files) {
            const file = await readFilePromise(item);
            mdZip.file(path.relative(folderPath, item), file);
        }
        mdZip
            .generateNodeStream({ type: 'nodebuffer', streamFiles: true })
            .pipe(fs.createWriteStream(savePath))
            .on('finish', async () => { 
                // JSZip generates a readable stream with a "end" event,
                // but is piped here in a writable stream which emits a "finish" event.
                vscode.window.showInformationMessage('Generate zip successfully!');
                await openExplorer(savePath);
            });
    } catch (error) {
        vscode.window.showErrorMessage('File or folder reading failed!');
        throw error;
    }
};
