# Util that help to migrate to gql template literal tag

 >>>If you want to migrate all your project `*.graphql` files into JS files with the standard GraphQL AST using [graphql-tag](https://www.npmjs.com/package/graphql-tag), this utils will help you with routine.
 
---

 Usage:
```typescript
migrateToGqlTemplateLiteralTag('/path/to/root/folder/');
parseFileWithGqlTemplateLiteralTag('/path/to/specific/file.ts');

cleanGqlImports('/path/to/root/folder/');
parseOldImports('/path/to/specific/file.ts');
```

---

Examples: 

Such `user.query.graphql`:
```graphql
#import "./fragment/user.fragment"

query user($id: ID!) {
    user(id: $id) {
        ...userFragment
    }
}
```
will be parsed into `user.query.ts`:
```typescript
import gql from 'graphql-tag';

import { userFragment } from './fragment/user.fragment';

export const userQuery = gql`
    query user($id: ID!) {
        user(id: $id) {
            ...userFragment
        }
        ${userFragment}
    }
`;
```

---

Also, you can fix your imports
```typescript
import userQuery from '../gql/user.query.graphql';
```
will be parsed into:
```typescript
import { userQuery } from '../gql/user.query';
```
