const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const kebabCaseFileNameToVariableName = (kebabCaseName: string) => {
    const kebabCaseArray = kebabCaseName.split('.');
    const [firstEntry, ...rest] = ([] as string[]).concat(...kebabCaseArray.map(name => name.split('-')));

    return [firstEntry, ...rest.map(capitalizeFirstLetter)].join('');
}

export const gqlFilePathToTsFilePath = (gqlFilePath: string): [string, string, string] => {
    const [, dirPath, kebabCaseName] = gqlFilePath.match(new RegExp('(.+\\/)*(.+)\\.(.+)')) ?? [];
    const variableName = kebabCaseFileNameToVariableName(kebabCaseName);

    return [dirPath, kebabCaseName, variableName];
}
