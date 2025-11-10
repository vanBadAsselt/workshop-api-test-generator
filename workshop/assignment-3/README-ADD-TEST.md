# Add Test from HAR Script

This script automatically adds a test to an existing k6 test skeleton by extracting GraphQL queries from a HAR (HTTP Archive) file.

## Overview

The `add-test-from-har.ts` script analyzes HAR files to find GraphQL queries and automatically generates:
- Query file (in `queries/` directory)
- Step file with assertions (in `steps/` directory) - with **🤖 AI-powered** or 📝 rule-based generation
- Test file (in `tests/` directory)
- Test scenario in `main.ts`
- Test data in `testdata/testdata.dev.ts`

## 🤖 AI-Powered Assertions

The script supports **AI-generated assertions** using OpenAI's GPT-4o model! This creates smarter, more contextual test assertions that understand your API structure.

## Quick Start

From `workshop/assignment-3` directory:

```bash
npm run scaffold superpowersTest    # 1. Generate test skeleton
npm run generate                    # 2. Add tests from HAR (AI)
npm run test                        # 3. Run tests
```

## Prerequisites

- A k6 test skeleton generated using the scaffolding script (see [scaffolding/README.md](./scaffolding/README.md))
- A HAR file containing GraphQL API calls
- (Optional) OpenAI API key for AI-powered assertions

## Setup

### Install Dependencies

```bash
cd workshop/assignment-3
npm install
```

### Configure OpenAI (Optional - for AI-powered assertions)

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Add your OpenAI API key to `.env`:
   ```
   OPENAI_API_KEY=sk-your-api-key-here
   ```

3. Get an API key from [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)

> **Note**: The script works without an OpenAI key using rule-based assertion generation. AI mode is optional but recommended for better test quality!

## Usage

### Quick Start (Simplified Commands)

```bash
# From workshop/assignment-3 directory
npm run scaffold <testName>    # Generate test skeleton
npm run generate               # Add tests from HAR (AI)
npm run test                   # Build and run tests
```

> **Note**: `npm run generate` is configured for `superpowersTest`. Edit `package.json` to customize.

### Advanced Usage (Full Command)

For more control or to generate tests for different APIs:

```bash
npx tsx generators/add-test-from-har.ts <testSetFolder> <harFilePath> [operationName] [--use-ai]
```

#### Parameters

- `testSetFolder`: Path to your k6 test skeleton directory
- `harFilePath`: Path to the HAR file containing GraphQL queries
- `operationName` (optional): Specific GraphQL operation to extract. If not provided, extracts the first GraphQL query found
- `--use-ai` (optional): Use AI to generate smart assertions (requires OPENAI_API_KEY)

### Examples

#### Rule-based generation (default - no API key needed)

```bash
# From workshop/assignment-3 directory
npx tsx generators/add-test-from-har.ts scaffolding/wonderwoman ../wonder-woman.har GetCharacter
```

#### AI-powered generation (smarter assertions)

```bash
# From workshop/assignment-3 directory
npx tsx generators/add-test-from-har.ts scaffolding/wonderwoman ../wonder-woman.har GetCharacter --use-ai
```

#### Extract the first query found

```bash
# From workshop/assignment-3 directory
npx tsx generators/add-test-from-har.ts scaffolding/wonderwoman ../wonder-woman.har
```

#### Inside scaffolding directory

```bash
# From scaffolding directory (after generating test with: npx tsx generate.ts mytest)
cd scaffolding
npx tsx ../generators/add-test-from-har.ts mytest ../my-capture.har GetMyQuery
```

## How It Works

1. **Extract GraphQL Query**: Parses the HAR file to find POST requests containing GraphQL query data
2. **Generate Query File**: Creates a TypeScript file exporting the GraphQL query string
3. **Generate Step File** (with AI or rule-based):

   **🤖 AI Mode (`--use-ai`)**:
   - Uses GPT-4o to analyze the GraphQL query and response
   - Generates contextually appropriate assertions
   - Understands business logic and data relationships
   - Creates more sophisticated validation
   - Falls back to rule-based if API call fails

   **📝 Rule-Based Mode (default)**:
   - Type assertions for primitive values (string, number, boolean)
   - Array validation with optional first element checks
   - Nested object traversal
   - `__typename` equality checks for GraphQL types

4. **Generate Test File**: Creates a k6 test that uses the k6chaijs describe/expect pattern
5. **Update main.ts**: Adds import and scenario function (skips if already exists)
6. **Update testdata**: Adds test data with variables from the HAR query

## Generated Files

For a query named `GetCharacter`, the script generates:

```
testSetFolder/
├── queries/
│   └── getCharacterQuery.ts       # GraphQL query string
├── steps/
│   └── getCharacterStep.ts        # Step implementation with assertions
├── tests/
│   └── getCharacterTest.ts        # Test function
├── testdata/
│   └── testdata.dev.ts            # Updated with test data
└── main.ts                        # Updated with new scenario
```

## Example Output

### Query File (queries/getCharacterQuery.ts)

```typescript
export const getCharacterQuery = `
  query GetCharacter($id: ID!) {
    getCharacter(id: $id) {
      id
      name
      ...
    }
  }
`;
```

### Step File (steps/getCharacterStep.ts)

```typescript
import { graphQl } from "../helpers/graphql";
import { expectValidJson } from "../helpers/utils";
import { expect } from "https://jslib.k6.io/k6chaijs/4.3.4.3/index.js";
import { getCharacterQuery } from "../queries/getCharacterQuery";

export function getCharacterStep(scenario: any) {
  const variables = { id: scenario.id };
  const response = graphQl.query(getCharacterQuery, variables);
  const responseJson = expectValidJson(response);

  try {
    const { getCharacter } = responseJson.data;
    expect(getCharacter.__typename, "__typename").to.equal("Character");
    expect(getCharacter.id, "id").to.be.a("string");
    expect(getCharacter.name, "name").to.be.a("string");
    // ... more assertions
  } catch (error) {
    console.error("Error in getCharacterStep:", error);
    console.error("Response JSON:", responseJson);
    throw error;
  }
}
```

### Test File (tests/getCharacterTest.ts)

```typescript
import { describe } from "https://jslib.k6.io/k6chaijs/4.3.4.3/index.js";
import { getCharacterStep } from "../steps/getCharacterStep";

export function getCharacterTest(scenario: any) {
  describe("GetCharacter test", () => {
    getCharacterStep(scenario);
  });
}
```

### Updated main.ts

```typescript
// Import added at top
import { getCharacterTest } from './tests/getCharacterTest';

// Scenario function added at bottom
export function getCharacterTestScenario() {
  const scenario = getScenarioData(
    allData,
    'getCharacterTestData'
  );
  getCharacterTest(scenario);
}
```

### Updated testdata/testdata.dev.ts

```typescript
export const dev: TestData = {
  baseUrl: "http://localhost:4000/",
  scenarios: [
    {
      name: "getCharacterTestData",
      description: "GetCharacter test data",
      id: "1002",  // Variables from HAR file
    },
  ],
};
```

## Capturing HAR Files

To capture a HAR file with GraphQL queries:

1. Open your browser's Developer Tools (F12)
2. Go to the Network tab
3. Navigate your application and perform the API calls you want to test
4. Right-click in the Network tab and select "Save all as HAR with content"
5. Save the file and use it with this script

## Next Steps After Generation

1. **Review the generated files**: Check that assertions match your expectations
2. **Update test data**: Modify `testdata/testdata.dev.ts` with appropriate test values
3. **Add to config**: Update `config/options.*.json` files to include the new scenario in your test execution plan
4. **Run the test**:
   ```bash
   # From workshop/assignment-3 directory (simplified)
   npm run test

   # OR from the test directory directly
   cd superpowersTest
   npm run test:smoke
   ```

## Features

- 🤖 **AI-powered assertion generation** (optional) using OpenAI GPT-4o
- 📝 **Rule-based assertion generation** as fallback or default
- Automatic extraction of GraphQL queries from HAR files
- Support for nested objects and arrays
- Type checking for all fields
- GraphQL `__typename` validation
- Try-catch error handling with detailed logging
- Preserves existing tests when adding new ones
- Duplicate detection - won't create the same test twice

## Comparison: AI vs Rule-Based

| Feature | AI Mode (`--use-ai`) | Rule-Based Mode (default) |
|---------|---------------------|---------------------------|
| **Setup** | Requires OpenAI API key | No setup needed |
| **Cost** | ~$0.01-0.05 per test | Free |
| **Assertions** | Smart, contextual | Basic type checks |
| **Quality** | Understands business logic | Mechanical |
| **Speed** | ~3-5 seconds | Instant |
| **Consistency** | May vary slightly | Always consistent |
| **Best For** | Production tests, complex APIs | Quick scaffolding, workshops |

## Limitations

- Currently supports only GraphQL queries (not mutations or subscriptions)
- Rule-based mode generates basic type assertions only
- Variables are mapped directly by name - manual adjustment may be needed if variable names differ between HAR and test data
- AI mode requires OpenAI API key and internet connection
- AI mode costs money (though very little per test)

## Tips

- Use descriptive operation names in your GraphQL queries for better test file naming
- Capture HAR files with realistic test data to generate more accurate assertions
- Review and customize the generated assertions to match your specific testing needs
- Consider capturing multiple similar queries to ensure your test covers edge cases
- Use `--use-ai` for complex APIs where you want smarter validation
- Use rule-based mode for quick iterations during development
