import { exec } from 'child_process';
import * as util from 'util';


export default async (path: string) => {
    const asyncExec = util.promisify(exec);
    // possible outcomes -> 'darwin', 'freebsd', 'linux', 'sunos' or 'win32'
    const isWin = /^win/.test(process.platform);
    return await asyncExec(`${isWin ?  'start' : 'open'} "" "${path}"`);
};
