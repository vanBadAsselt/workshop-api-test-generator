# API Test Scaffolding Generator

A simple template-based generator for creating structured API test sets.

## Usage

```bash
cd solutions/scaffolding
npx tsx generate.ts <testName>
```

**Example:**
```bash
npx tsx generate.ts superpowers
```

This creates:
```
api-tests/superpowers/
├── main.ts                    # Main test file
├── config/
│   └── options.smoke.json     # k6 test configuration
├── testdata/
│   ├── testdata.ts           # Test data index
│   └── testdata.prd.ts       # Production environment data
├── helpers/
│   ├── types.ts              # TypeScript type definitions
│   └── utils.ts              # Utility functions
├── queries/                   # GraphQL queries (empty)
└── steps/                     # Reusable test steps (empty)
```

## Test Name Format

- Must be in **camelCase**
- Start with lowercase letter
- Examples: `superpowers`, `userLogin`, `checkout`

## Template Variables

Templates support these variables:
- `{{name}}` - Test name in lowercase (e.g., `superpowers`)
- `{{Name}}` - Test name capitalized (e.g., `Superpowers`)

## Generated Structure

### `main.ts`
Main test entry point with k6 configuration and test logic placeholder.

### `config/options.smoke.json`
k6 test options (VUs, iterations, thresholds).

### `testdata/`
Test data organized by environment (prd, tst, etc.).

### `helpers/`
Shared utilities and type definitions.

### `queries/` & `steps/`
Empty directories for organizing GraphQL queries and reusable test steps.

## Workshop Usage

For **Assignment 3**, participants will:
1. Use this generator to scaffold a new test
2. Use AI to generate GraphQL queries and test logic
3. Fill in the generated structure with their tests

## Running Generated Tests

```bash
k6 run api-tests/superpowers/main.ts
```

With environment variables:
```bash
TEST_TYPE=smoke ENV=prd k6 run api-tests/superpowers/main.ts
```

