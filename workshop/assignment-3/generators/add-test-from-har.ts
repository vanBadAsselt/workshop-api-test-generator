#!/usr/bin/env tsx
/**
 * Script to add a test to an existing k6 test skeleton based on a HAR file
 * Usage: npx tsx generators/add-test-from-har.ts <testSetFolder> <harFilePath> [operationName] [--use-ai]
 *
 * Example: npx tsx generators/add-test-from-har.ts scaffolding/superpowers ./wonder-woman.har GetCharacter --use-ai
 */

import fs from 'fs';
import path from 'path';
import { generateStepWithAI } from './openai-service.js';

interface HarEntry {
  request: {
    method: string;
    url: string;
    postData?: {
      text: string;
    };
  };
  response: {
    content: {
      text?: string;
    };
  };
}

interface HarFile {
  log: {
    entries: HarEntry[];
  };
}

interface GraphQLQuery {
  operationName: string;
  variables: Record<string, any>;
  query: string;
  response: any;
}

// Extract GraphQL queries from HAR file
function extractGraphQLFromHar(harFilePath: string, operationName?: string): GraphQLQuery | null {
  const harContent = fs.readFileSync(harFilePath, 'utf-8');
  const har: HarFile = JSON.parse(harContent);

  for (const entry of har.log.entries) {
    if (
      entry.request.method === 'POST' &&
      entry.request.postData?.text
    ) {
      try {
        const postData = JSON.parse(entry.request.postData.text);

        // Check if this is a GraphQL request
        if (!postData.query || !postData.operationName) {
          continue;
        }

        // If operationName is specified, only return matching query
        if (operationName && postData.operationName !== operationName) {
          continue;
        }

        const response = entry.response.content.text
          ? JSON.parse(entry.response.content.text)
          : null;

        return {
          operationName: postData.operationName,
          variables: postData.variables || {},
          query: postData.query,
          response,
        };
      } catch (e) {
        // Not a JSON request, skip
        continue;
      }
    }
  }

  return null;
}

// Infer TypeScript type from value
function inferType(value: any): string {
  if (value === null || value === undefined) return 'any';
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'object') return 'object';
  return typeof value;
}

// Generate simple assertions based on response structure
function generateAssertions(obj: any, path: string = 'responseJson.data', indent: string = '  '): string[] {
  const assertions: string[] = [];

  if (!obj || typeof obj !== 'object') {
    return assertions;
  }

  for (const [key, value] of Object.entries(obj)) {
    const currentPath = `${path}.${key}`;
    const type = inferType(value);

    if (key === '__typename' && typeof value === 'string') {
      assertions.push(`${indent}expect(${currentPath}, "${key}").to.equal("${value}");`);
    } else if (type === 'string' || type === 'number' || type === 'boolean') {
      assertions.push(`${indent}expect(${currentPath}, "${key}").to.be.a("${type}");`);
    } else if (type === 'array' && Array.isArray(value)) {
      assertions.push(`${indent}expect(${currentPath}, "${key}").to.be.an("array");`);
      if (value.length > 0) {
        assertions.push(`${indent}if (${currentPath}.length > 0) {`);
        const itemType = inferType(value[0]);
        if (itemType === 'object') {
          const nestedAssertions = generateAssertions(value[0], `${currentPath}[0]`, indent + '  ');
          assertions.push(...nestedAssertions);
        } else {
          assertions.push(`${indent}  expect(${currentPath}[0], "First ${key}").to.be.a("${itemType}");`);
        }
        assertions.push(`${indent}}`);
      }
    } else if (type === 'object') {
      assertions.push('');
      assertions.push(`${indent}const ${key} = ${currentPath};`);
      const nestedAssertions = generateAssertions(value, key, indent);
      assertions.push(...nestedAssertions);
    }
  }

  return assertions;
}

// Generate query file
function generateQueryFile(operationName: string, query: string): string {
  const queryName = `${operationName.charAt(0).toLowerCase()}${operationName.slice(1)}Query`;

  return `export const ${queryName} = \`${query}\`;
`;
}

// Generate step file with rule-based assertions
function generateStepFile(operationName: string, variables: Record<string, any>, response: any): string {
  const functionName = `${operationName.charAt(0).toLowerCase()}${operationName.slice(1)}Step`;
  const queryName = `${operationName.charAt(0).toLowerCase()}${operationName.slice(1)}Query`;

  // Extract the root query field name from response
  const rootField = response?.data ? Object.keys(response.data)[0] : operationName;

  // Generate variable assignments from scenario
  const varAssignments = Object.keys(variables).map(varName => {
    return `${varName}: scenario.${varName}`;
  }).join(', ');

  const assertions = response?.data?.[rootField]
    ? generateAssertions(response.data[rootField], `${rootField}`, '    ')
    : ['    expect(responseJson.data, "Response data").to.exist;'];

  return `import { graphQl } from "../helpers/graphql.js";
import { expectValidJson } from "../helpers/utils.js";
import { expect } from "https://jslib.k6.io/k6chaijs/4.3.4.3/index.js";
import { ${queryName} } from "../queries/${queryName}.js";

export function ${functionName}(scenario: any) {
  const variables = { ${varAssignments} };
  const response = graphQl.query(${queryName}, variables);
  const responseJson = expectValidJson(response);

  try {
    const { ${rootField} } = responseJson.data;
${assertions.join('\n')}
  } catch (error) {
    console.error("Error in ${functionName}:", error);
    console.error("Response JSON:", responseJson);
    throw error;
  }
}
`;
}

// Generate step file with AI
async function generateStepFileWithAI(
  operationName: string,
  query: string,
  variables: Record<string, any>,
  response: any
): Promise<string> {
  console.log('  Using AI to generate smart assertions...');

  try {
    const aiGeneratedCode = await generateStepWithAI({
      operationName,
      query,
      variables,
      response,
    });

    return aiGeneratedCode;
  } catch (error) {
    console.error('  ⚠ AI generation failed, falling back to rule-based generation');
    console.error('  Error:', error instanceof Error ? error.message : error);
    return generateStepFile(operationName, variables, response);
  }
}

// Generate test file
function generateTestFile(operationName: string): string {
  const testName = `${operationName.charAt(0).toLowerCase()}${operationName.slice(1)}Test`;
  const stepName = `${operationName.charAt(0).toLowerCase()}${operationName.slice(1)}Step`;

  return `import { describe } from "https://jslib.k6.io/k6chaijs/4.3.4.3/index.js";
import { ${stepName} } from "../steps/${stepName}.js";

export function ${testName}(scenario: any) {
  describe("${operationName} test", () => {
    ${stepName}(scenario);
  });
}
`;
}

// Add scenario to main.ts
function addScenarioToMain(testSetPath: string, operationName: string): void {
  const mainPath = path.join(testSetPath, 'main.ts');
  let mainContent = fs.readFileSync(mainPath, 'utf-8');

  const testName = `${operationName.charAt(0).toLowerCase()}${operationName.slice(1)}Test`;
  const scenarioName = `${operationName.charAt(0).toLowerCase()}${operationName.slice(1)}TestScenario`;
  const testDataName = `${operationName.charAt(0).toLowerCase()}${operationName.slice(1)}TestData`;

  // Check if import already exists
  const importStatement = `import { ${testName} } from './tests/${testName}.js';`;
  if (mainContent.includes(importStatement)) {
    console.log(`⚠ Import for ${testName} already exists in main.ts, skipping import`);
  }

  // Check if scenario already exists
  if (mainContent.includes(`export function ${scenarioName}()`)) {
    console.log(`⚠ Scenario ${scenarioName} already exists in main.ts, skipping scenario`);
    return;
  }

  // Remove example scenario if this is the first real test
  if (mainContent.includes('exampleTestScenario')) {
    // Remove the entire exampleTestScenario function
    const exampleScenarioRegex = /export function exampleTestScenario\(\) \{[\s\S]*?\n\}/;
    mainContent = mainContent.replace(exampleScenarioRegex, '').trim();
  }

  let updatedContent = mainContent;

  // Add import if not already present
  if (!mainContent.includes(importStatement)) {
    const lastImportIndex = mainContent.lastIndexOf('import ');
    const endOfLastImport = mainContent.indexOf('\n', lastImportIndex);
    updatedContent =
      mainContent.slice(0, endOfLastImport + 1) +
      importStatement + '\n' +
      mainContent.slice(endOfLastImport + 1);
  }

  // Add scenario function at the end
  const scenarioFunction = `
export function ${scenarioName}() {
  const scenario = getScenarioData(
    allData,
    '${testDataName}'
  );
  ${testName}(scenario);
}
`;

  updatedContent += scenarioFunction;

  fs.writeFileSync(mainPath, updatedContent);
  console.log(`✓ Added scenario to main.ts`);
}

// Add scenario to config files
function addScenarioToConfig(testSetPath: string, operationName: string): void {
  const scenarioName = `${operationName.charAt(0).toLowerCase()}${operationName.slice(1)}TestScenario`;

  // Update all config files
  const configDir = path.join(testSetPath, 'config');
  const configFiles = fs.readdirSync(configDir).filter(f => f.startsWith('options.') && f.endsWith('.json'));

  for (const configFile of configFiles) {
    const configPath = path.join(configDir, configFile);
    const configContent = fs.readFileSync(configPath, 'utf-8');
    const config = JSON.parse(configContent);

    // Check if scenario already exists
    if (config.scenarios && config.scenarios[scenarioName]) {
      console.log(`  ⚠ Scenario ${scenarioName} already exists in ${configFile}, skipping`);
      continue;
    }

    // Initialize scenarios object if it doesn't exist
    if (!config.scenarios) {
      config.scenarios = {};
    }

    // Add scenario configuration
    config.scenarios[scenarioName] = {
      executor: "per-vu-iterations",
      tags: {
        run_type: configFile.includes('smoke') ? 'Smoke' : 'Load',
        scenario: scenarioName
      },
      exec: scenarioName,
      vus: 1,
      iterations: 1,
      maxDuration: "5m"
    };

    // Write back with pretty formatting
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n');
    console.log(`  ✓ Added scenario to ${configFile}`);
  }
}

// Add test data to testdata files
function addTestData(testSetPath: string, operationName: string, variables: Record<string, any>): void {
  const testdataPath = path.join(testSetPath, 'testdata', 'testdata.dev.ts');
  let testdataContent = fs.readFileSync(testdataPath, 'utf-8');

  const testDataName = `${operationName.charAt(0).toLowerCase()}${operationName.slice(1)}TestData`;

  // Remove example test data if this is the first real test
  if (testdataContent.includes('exampleTestData')) {
    // Remove the example scenario and any TODO comments
    testdataContent = testdataContent.replace(/\/\/ TODO:.*\n/, '');
    testdataContent = testdataContent.replace(/\/\/ Example:.*\n/, '');
    testdataContent = testdataContent.replace(/\{ name: 'exampleTestData',.*?\}[,\s]*/s, '');
  }

  // Create test data object from variables
  const testDataObj = {
    name: testDataName,
    description: `${operationName} test data`,
    ...variables,
  };

  // Find the scenarios array and add new test data
  const scenariosMatch = testdataContent.match(/scenarios:\s*\[([\s\S]*?)\]/);
  if (scenariosMatch) {
    const existingScenarios = scenariosMatch[1].trim();
    const newScenario = `    ${JSON.stringify(testDataObj, null, 2).replace(/\n/g, '\n    ')}`;

    // Check if there are existing non-empty scenarios
    const hasExistingScenarios = existingScenarios && existingScenarios.length > 0 && !existingScenarios.includes('exampleTestData');

    const updatedContent = testdataContent.replace(
      /scenarios:\s*\[([\s\S]*?)\]/,
      `scenarios: [\n${hasExistingScenarios ? existingScenarios + ',\n' : ''}${newScenario}\n  ]`
    );

    fs.writeFileSync(testdataPath, updatedContent);
    console.log(`✓ Added test data to testdata.dev.ts`);
  }
}

// Main function
async function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error('Usage: tsx add-test-from-har.ts <testSetFolder> <harFilePath> [operationName] [--use-ai]');
    console.error('Example: tsx add-test-from-har.ts superpowers ./wonder-woman.har GetCharacter --use-ai');
    process.exit(1);
  }

  // Parse arguments
  const useAI = args.includes('--use-ai');
  const filteredArgs = args.filter(arg => arg !== '--use-ai');
  const [testSetFolder, harFilePath, operationName] = filteredArgs;

  // Resolve paths
  const testSetPath = path.resolve(process.cwd(), testSetFolder);
  const harPath = path.resolve(process.cwd(), harFilePath);

  // Validate paths
  if (!fs.existsSync(testSetPath)) {
    console.error(`Error: Test set folder not found: ${testSetPath}`);
    process.exit(1);
  }

  if (!fs.existsSync(harPath)) {
    console.error(`Error: HAR file not found: ${harPath}`);
    process.exit(1);
  }

  console.log(`Extracting GraphQL query from HAR file...`);
  const gqlQuery = extractGraphQLFromHar(harPath, operationName);

  if (!gqlQuery) {
    console.error(`Error: No GraphQL query found in HAR file${operationName ? ` with operation name: ${operationName}` : ''}`);
    process.exit(1);
  }

  console.log(`✓ Found query: ${gqlQuery.operationName}`);

  if (useAI) {
    console.log(`✨ AI mode enabled - will generate smart assertions`);
  } else {
    console.log(`📝 Using rule-based assertion generation (use --use-ai for smarter tests)`);
  }

  // Generate file names
  const queryFileName = `${gqlQuery.operationName.charAt(0).toLowerCase()}${gqlQuery.operationName.slice(1)}Query`;
  const stepFileName = `${gqlQuery.operationName.charAt(0).toLowerCase()}${gqlQuery.operationName.slice(1)}Step`;
  const testFileName = `${gqlQuery.operationName.charAt(0).toLowerCase()}${gqlQuery.operationName.slice(1)}Test`;

  // Create directories if they don't exist
  const queriesDir = path.join(testSetPath, 'queries');
  const stepsDir = path.join(testSetPath, 'steps');
  const testsDir = path.join(testSetPath, 'tests');

  fs.mkdirSync(queriesDir, { recursive: true });
  fs.mkdirSync(stepsDir, { recursive: true });
  fs.mkdirSync(testsDir, { recursive: true });

  // Generate and write files
  console.log('Generating test files...');

  const queryContent = generateQueryFile(gqlQuery.operationName, gqlQuery.query);
  fs.writeFileSync(path.join(queriesDir, `${queryFileName}.ts`), queryContent);
  console.log(`✓ Created queries/${queryFileName}.ts`);

  // Generate step file with AI or rule-based
  let stepContent: string;
  if (useAI) {
    stepContent = await generateStepFileWithAI(
      gqlQuery.operationName,
      gqlQuery.query,
      gqlQuery.variables,
      gqlQuery.response
    );
  } else {
    stepContent = generateStepFile(gqlQuery.operationName, gqlQuery.variables, gqlQuery.response);
  }
  fs.writeFileSync(path.join(stepsDir, `${stepFileName}.ts`), stepContent);
  console.log(`✓ Created steps/${stepFileName}.ts`);

  const testContent = generateTestFile(gqlQuery.operationName);
  fs.writeFileSync(path.join(testsDir, `${testFileName}.ts`), testContent);
  console.log(`✓ Created tests/${testFileName}.ts`);

  // Add scenario to main.ts
  addScenarioToMain(testSetPath, gqlQuery.operationName);

  // Add scenario to config files
  console.log('Updating config files...');
  addScenarioToConfig(testSetPath, gqlQuery.operationName);

  // Add test data
  addTestData(testSetPath, gqlQuery.operationName, gqlQuery.variables);

  console.log('\n✨ Test successfully added to skeleton!');
  console.log(`\nNext steps:`);
  console.log(`1. Review the generated test files in ${testSetFolder}`);
  console.log(`2. Update testdata files with appropriate test values`);
  console.log(`3. Run the test with: npm run test:smoke`);
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
