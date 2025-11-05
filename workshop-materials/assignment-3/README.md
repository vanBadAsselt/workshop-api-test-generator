# Assignment 3: Modular Architecture

## Intro: The Six-Layer Architecture

Now that we can extract real API calls, the question is: **How do we turn that into a reliable, reusable test system?**

In Assignments 1 & 2, we saw the problems with standalone tests:
- Hardcoded URLs and data
- No reusability across environments
- Difficult to scale to 50+ endpoints

The solution: **A modular six-layer architecture** that separates concerns and enables reusability.

### The 6 Layers

```
api-tests/<testset>/
├── 1️⃣ main.ts           Entry point - orchestrates the test
├── 2️⃣ steps/            Isolated API calls with assertions  
├── 3️⃣ queries/          GraphQL query definitions
├── 4️⃣ testdata/         Environment-specific test data
├── 5️⃣ config/           Performance configs & thresholds
└── 6️⃣ helpers/          Utilities and type definitions
```

---

## Assignment: Fill in the Architecture

### Step 1: Scaffold Your Test Structure

Run the scaffolding generator:

```bash
cd workshop-materials
npm run scaffold:generate <testset>
```

**Example:**
```bash
npm run scaffold:generate superpowers
```

This creates: `assignment-3/scaffolding/superpowers/` with all 6 layers set up!

### Step 2: Understand the Structure

Open `superpowers/` and look at the structure. Notice:
- ✅ **Structure is there** (folders, imports, placeholders)
- ❓ **Logic is missing** (queries, steps, assertions)

The structure:
```
superpowers/
├── main.ts              # Loads test data, calls test functions
├── tests/               # Test functions (empty)
├── steps/               # API call steps (empty)
├── queries/             # GraphQL queries (empty)
├── testdata/            # Environment-specific data
├── config/              # Performance configs
└── helpers/             # Types and utilities
```

**Quick discussion:** Given your JSON from Assignment 2:
- **Query** → `queries/` folder (as const export)
- **Variables/test data** → `testdata/`
- **API call** → `steps/` folder (function that makes the request)
- **Test** → `tests/` folder (function that calls the step)
- **Main** → Imports and runs the test function

### Step 3: Add One Test

We'll fill in 3 files to make one test work:

#### 1. Create Query File

**Ask AI:**
```
Create a TypeScript file that exports this GraphQL query as a string constant:

[paste query from GetCharacter-capture.json]

Export as: export const getCharacterQuery = `...query...`;
```

**Save to:** `superpowers/queries/getCharacter.query.ts`

#### 2. Create Step File

//TODO
Create a step function that:
- Imports the query from queries/getCharacter.query.ts
- Makes a POST request to the GraphQL URL
- Takes characterId as parameter
- Includes checks for status 200 and data existence

**Ask AI:**
```
Generate TypeScript code for a k6 API test step based on the GraphQL call in the attached JSON.

STRUCTURE REQUIREMENTS:
- Import the query from '../queries/<operationName>.query'
- Import graphQl helper from '../helpers/graphql'
- Import expectValidJson from '../helpers/utils'
- Import expect from 'https://jslib.k6.io/k6chaijs/4.3.4.3/index.js'
- Function signature: export function <operationName>Step(parameterName: string, accessToken?: string)

VARIABLES:
- Use variables from the JSON provided with correct nesting

ASSERTIONS (based on RESPONSE):
- Validate the type of EVERY field in the response
- For nested objects, create variables for each level
- For arrays: validate first element if present, handle empty arrays
- For null fields: assert null and skip nested properties
- Ensure __typename matches exactly
- Use camelCase naming
- Wrap in try/catch with error logging

RESPONSE FORMAT:
Return ONLY the TypeScript code, no JSON wrapper, no markdown, no explanations.

EXAMPLE:

import { graphQl } from '../helpers/graphql';
import { expectValidJson } from '../helpers/utils';
import { expect } from 'https://jslib.k6.io/k6chaijs/4.3.4.3/index.js';
import { getUserQuery } from '../queries/getUserQuery';

export function getUserStep(scenario: any) {
  const variables = { id: scenario.userId };
  const response = graphQl.query(getUserQuery, variables);
  const responseJson = expectValidJson(response);
  
  try {
    const { user } = responseJson.data;
    expect(user.id, 'User ID').to.be.a('string');
    expect(user.name, 'Name').to.be.a('string');
    expect(user.age, 'Age').to.be.a('number');
    expect(user.active, 'Active').to.be.a('boolean');
    
    const { address } = user;
    expect(address.city, 'City').to.be.a('string');
    
    expect(user.tags, 'Tags').to.be.an('array');
    if (user.tags.length > 0) {
      expect(user.tags[0], 'First Tag').to.be.a('string');
    }
  } catch (error) {
    console.error('Error in getUserStep:', error);
    console.error('Response JSON:', responseJson);
    throw error;
  }
}

NOW generate the step function based on the provided JSON. Return ONLY the TypeScript code.
```

**Save to:** `superpowers/steps/getCharacter.step.ts`

#### 3. Create Test File

**Ask AI:**
```
Generate TypeScript code for a k6 test function based on the GraphQL step function.

STRUCTURE REQUIREMENTS:
- Import describe from 'https://jslib.k6.io/k6chaijs/4.3.4.3/index.js'
- Import the step function from '../steps/<operationName>.step'
- Import TestScenario type from '../helpers/types'
- Function signature: export function <operationName>Test(scenario: TestScenario)
- Use describe() block with clear test description
- Call the step function inside the describe block

NAMING:
- Test function: <operationName>Test (e.g., getCharacterTest, getUserTest)
- Step function: <operationName>Step (e.g., getCharacterStep, getUserStep)
- Use camelCase

RESPONSE FORMAT:
Return ONLY the TypeScript code, no JSON wrapper, no markdown, no explanations.

EXAMPLE:

import { describe } from 'https://jslib.k6.io/k6chaijs/4.3.4.3/index.js';
import { getUserStep } from '../steps/getUserStep';

export function getUserTest(scenario: any) {
  describe('Should retrieve the correct user information', () => {
    getUserStep(scenario);
  });
}

NOW generate the test function. The step function takes parameters based on the GraphQL operation. Return ONLY the TypeScript code.
```

**Save to:** `superpowers/tests/getCharacter.test.ts`

#### 4. Update Main

**Ask AI:**
```
Update main.ts to:
- Import testGetCharacter from './tests/getCharacter.test'
- Call testGetCharacter(allData) in the default function
```

**Update:** `superpowers/main.ts`

#### 5. Run It

```bash
k6 run superpowers/main.ts
```

**Does it work?** 🎯

---

## Discussion

**Compare to Assignment 2:**
- What's easier to change? (environment, test data, queries)
- What's easier to reuse? (queries across tests)
- What's easier to scale? (adding 50 endpoints)

**Where would automation help?**
- Script: Create query files, update structure
- AI: Generate assertions, test logic

---

## What You've Learned

✅ **Modular architecture** = maintainable + scalable tests  
✅ **Separation of concerns** = change one thing, not everything  
✅ **Scripts** = structure, **AI** = logic  

**The complete picture:**
1. Extract API calls (Assignment 2)
2. Generate with scripts + AI (Assignment 2)  
3. Organize in scalable architecture (Assignment 3)

**You now have a system for production-ready, AI-assisted test generation!** 🎯
