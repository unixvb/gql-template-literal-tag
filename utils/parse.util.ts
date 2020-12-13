import {readFile, unlinkSync, writeFileSync} from 'fs';
import {gqlFilePathToTsFilePath} from './path.util';

const gqlEntities = ['query', 'mutation', 'fragment', 'subscription'];
const gutter = '    ';

const isGqlImportRow = (row: string) => row.startsWith('#import "');

const isGqlEntityRow = (row: string) => {
    const [firstWord] = row.split(' ');

    return gqlEntities.includes(firstWord);
}

const parseGqlImportRow = (row: string): [string, string] => {
    const [, importPath] = row.match(new RegExp('#import "(.*?)"')) ?? ['', ''];
    const [dirPath, tsFileName, variableName] = gqlFilePathToTsFilePath(importPath);

    return [`import { ${variableName} } from '${dirPath}${tsFileName}'`, variableName];
}

const parseGqlEntityRows = (gqlRows: string[], variableName: string): [string[], string[]] => {
    const lastGqlRow = gqlRows.pop();

    return [
        [`export const ${variableName} = gql\``, ...gqlRows.map(row => `${gutter}${row}`)],
        [`${gutter}${lastGqlRow}`, `\`;`, ``]
    ];
}

export const parseFileWithGqlTemplateLiteralTag = (fileName: string) => {
    readFile(fileName, 'utf8', (error, fileContent) => {
        if (error) {
            console.error(error);
            return;
        }

        const outputContentArray = [`import gql from 'graphql-tag';`, ``];
        const variablesArray = [];

        const fileContentRows = fileContent.split('\n');

        const [dirPath, tsFileName, variableName] = gqlFilePathToTsFilePath(fileName);

        for (let i = 0; i < fileContentRows.length; i++) {
            const fileRow = fileContentRows[i];

            if (isGqlImportRow(fileRow)) {
                const [tsImportRow, variableName] = parseGqlImportRow(fileRow);

                outputContentArray.push(tsImportRow);
                variablesArray.push(variableName);
            } else if (isGqlEntityRow(fileRow)) {
                const [contentArray, closingTagsArray] = parseGqlEntityRows(fileContentRows.slice(i, fileContentRows.length - 1), variableName);

                outputContentArray.push(
                    ...contentArray,
                    ...variablesArray.map(variableName => `${gutter}${gutter}\${${variableName}}`),
                    ...closingTagsArray
                );

                break;
            } else {
                outputContentArray.push(fileRow === '' ? fileRow : `//${fileRow}`);
            }
        }


        writeFileSync(`${dirPath}${tsFileName}.ts`, outputContentArray.join('\n'));
        unlinkSync(fileName);
    })
};

export const parseOldImports = (fileName: string) =>
    readFile(fileName, 'utf8', (error, fileContent) => {
        if (error) {
            console.error(error);
            return;
        }

        const newFileContent = fileContent
            .replace(
                new RegExp(/import (.+) from '(.+).graphql';/g),
                (substring, variableName, filePath) => `import { ${variableName} } from '${filePath}';`
            )
            .replace(
                new RegExp(/((\/\/ tslint:disable:no-relative-imports)|(\/\/ tslint:enable:no-relative-imports))\n/g),
                ''
            );

        writeFileSync(fileName, newFileContent);
    });
