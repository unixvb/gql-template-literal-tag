import {readdir, stat, Stats} from 'fs';

const excludeList = ['node_modules', 'dist', 'build', 'Pods'];

export const loopThroughFolder = (folderPath: string, fileHandler: (filePath: string) => void) => {
    readdir(folderPath, (error, list) => {
        if (error) {
            console.error(error);
            return;
        }

        const filteredList = list.filter(item => !excludeList.includes(item));

        for (let item of filteredList) {
            const itemPath = `${folderPath}/${item}`;

            stat(itemPath, (err, fileStats) => {
                fileStats.isDirectory() && loopThroughFolder(itemPath, fileHandler);
                fileStats.isFile() && fileHandler(itemPath);
            });
        }
    });
};
