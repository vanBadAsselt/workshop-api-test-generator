# API Test Scaffolding Generator

Generates a modular k6 test structure with 6 layers for maintainable, scalable API testing.

## Setup

From the workshop-materials root:

```bash
npm install
```

## Usage

### 1. Generate Test Structure

```bash
npm run scaffold:generate <testSetName>
```

**Example:**
```bash
npm run scaffold:generate superpowers
```

### 2. Build Tests (Compile TypeScript to JavaScript)

After creating your test files, build them for k6:

```bash
npm run scaffold:build <testSetName>
```

**Example:**
```bash
npm run scaffold:build superpowers
```

This compiles all TypeScript files to JavaScript in `assignment-3/scaffolding/<testSetName>/dist/`

### 3. Run Tests with k6

```bash
cd assignment-3/scaffolding
k6 run <testSetName>/dist/main.js
```

**With environment variables:**
```bash
ENV=prd TEST_TYPE=smoke k6 run superpowers/dist/main.js
```

## Generated Structure

```
<testSetName>/
├── main.ts              # Entry point - loads data, runs tests
├── tests/               # Test functions (orchestration layer)
├── steps/               # API call functions (execution layer)
├── queries/             # GraphQL query definitions
├── testdata/            # Environment-specific test data
│   ├── testdata.ts      # Index file
│   └── testdata.prd.ts  # Production data
├── config/              # k6 performance configurations
│   └── options.smoke.json
└── helpers/             # Utilities and type definitions
    ├── types.ts
    └── utils.ts
```

## The 6 Layers Explained

### 1. Main (Entry Point)
- Loads k6 options based on `TEST_TYPE` env variable
- Loads test data based on `ENV` env variable
- Calls test functions

### 2. Tests (Orchestration)
- Test functions that coordinate multiple steps
- Pass test data to steps
- Example: `testGetCharacter(data: TestData)`

### 3. Steps (API Calls)
- Individual API call functions
- Import queries from queries/
- Make HTTP requests
- Include assertions
- Example: `getCharacter(characterId: string)`

### 4. Queries (GraphQL Definitions)
- GraphQL query strings as constants
- Reusable across multiple tests
- Example: `export const getCharacterQuery = \`...\``

### 5. Testdata (Environment Data)
- Environment-specific variables
- Switch with `ENV=prd` or `ENV=tst`

### 6. Config (Performance Settings)
- k6 options for different test types
- Switch with `TEST_TYPE=smoke` or `TEST_TYPE=load`

## Example: Adding a Test

### 1. Create Query
```typescript
// queries/getCharacter.query.ts
export const getCharacterQuery = `
  query GetCharacter($id: ID!) {
    getCharacter(id: $id) { id name }
  }
`;
```

### 2. Create Step
```typescript
// steps/getCharacter.step.ts
import http from 'k6/http';
import { check } from 'k6';
import { getCharacterQuery } from '../queries/getCharacter.query';

export function getCharacter(characterId: string) {
  const url = __ENV.GRAPHQL_URL || 'http://localhost:4000/';
  const payload = JSON.stringify({
    query: getCharacterQuery,
    variables: { id: characterId }
  });
  
  const res = http.post(url, payload, {
    headers: { 'Content-Type': 'application/json' }
  });
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'has character': (r) => r.json().data?.getCharacter !== undefined
  });
  
  return res;
}
```

### 3. Create Test
```typescript
// tests/getCharacter.test.ts
import { TestData } from '../helpers/types';
import { getCharacter } from '../steps/getCharacter.step';

export function testGetCharacter(data: TestData) {
  const characterId = data.characterId || '1001';
  getCharacter(characterId);
}
```

### 4. Update Main
```typescript
// main.ts
import { testGetCharacter } from './tests/getCharacter.test';

export default function () {
  testGetCharacter(allData);
}
```

### 5. Run
```bash
k6 run superpowers/main.ts
```

## Environment Variables

- `ENV` - Environment (prd, tst) - determines which testdata to use
- `TEST_TYPE` - Test type (smoke, load, stress) - determines which config to use
- `GRAPHQL_URL` - GraphQL endpoint URL (optional, defaults to localhost:4000)

## Benefits

✅ **Reusable** - Queries shared across tests  
✅ **Maintainable** - Change query once, updates everywhere  
✅ **Flexible** - Switch environments and test types with env vars  
✅ **Scalable** - Clean structure for 50+ endpoints  
✅ **Clear separation** - Each layer has one job
