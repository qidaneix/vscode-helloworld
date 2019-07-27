import * as fs from 'fs';
import * as util from 'util';
import * as path  from 'path';

const readdirPromise = util.promisify(fs.readdir);

export default async (directory: string) => {
    const files: string[] = [];
    async function loop(dir: string) {
        const subItems = await readdirPromise(dir, { withFileTypes: true });
        for (const item of subItems) {
            if (item.isDirectory()) {
                await loop(path.join(dir, item.name));
            } else {
                files.push(path.join(dir, item.name));
            }
        }
    }
    await loop(directory);
    return files;
};
