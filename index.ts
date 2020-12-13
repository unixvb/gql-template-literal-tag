import { parseFileWithGqlTemplateLiteralTag, parseOldImports } from './utils/parse.util';
import { loopThroughFolder } from './utils/loop.util';

const gqlExtensions = ['.graphql', '.gql'];
const servicesExtensions = ['.ts'];

const migrateToGqlTemplateLiteralTag = (folderPath: string) => loopThroughFolder(
    folderPath,
    (filePath: string) =>
        gqlExtensions.some(gqlExtension => filePath.endsWith(gqlExtension)) &&
        parseFileWithGqlTemplateLiteralTag(filePath)
);
const cleanGqlImports = (folderPath: string) => loopThroughFolder(
    folderPath,
    (filePath: string) => {
        servicesExtensions.some(serviceExtension => filePath.endsWith(serviceExtension)) &&
        parseOldImports(filePath)
    }
);


// migrateToGqlTemplateLiteralTag('/path/to/root/folder/');
// parseFileWithGqlTemplateLiteralTag('/path/to/specific/file.ts');
// cleanGqlImports('/path/to/root/folder/');
// parseOldImports('/path/to/specific/file.ts');
