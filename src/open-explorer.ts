import { exec } from 'child_process';
import * as util from 'util';


export default async (path: string) => {
    const asyncExec = util.promisify(exec);
    // possible outcomes -> 'darwin', 'freebsd', 'linux', 'sunos' or 'win32'
    const isWin = /^win/.test(process.platform);
    if (!isWin) {
        return await asyncExec(`Explorer.exe /select,"${path}"`);
    } else {
        // return await Promise.reject('暂时只支持windows系统，见谅！'); TODO
        return false;
    }
};
