import { promises as fsPromises } from 'fs';
import * as path  from 'path';


export default async function recursiveReaddir(directory: string) {
    const files: string[] = [];
    async function loop(dir: string) {
        const subItems = await fsPromises.readdir(dir, { withFileTypes: true });
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
}
