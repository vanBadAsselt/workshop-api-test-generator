#!/usr/bin/env tsx
// Simple API test scaffolding generator
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function usage() {
  console.error('Usage: tsx generate.ts <testName>');
  console.error('Example: tsx generate.ts superpowers');
  process.exit(1);
}

function replaceTemplateVariables(content: string, testName: string): string {
  return content
    .replace(/\{\{name\}\}/g, testName)
    .replace(/\{\{Name\}\}/g, testName.charAt(0).toUpperCase() + testName.slice(1));
}

function copyTemplate(srcPath: string, destPath: string, testName: string) {
  const content = fs.readFileSync(srcPath, 'utf-8');
  const processed = replaceTemplateVariables(content, testName);
  fs.writeFileSync(destPath, processed, 'utf-8');
}

function createDirectory(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function main() {
  const testName = process.argv[2];
  
  if (!testName) {
    usage();
  }

  // Validate test name (camelCase)
  if (!/^[a-z][a-zA-Z0-9]*$/.test(testName)) {
    console.error('Error: Test name must be in camelCase (e.g., "superpowers", "myTest")');
    process.exit(1);
  }

  const templatesDir = path.join(__dirname, 'templates');
  const destDir = path.join(process.cwd(), testName);

  // Check if test already exists
  if (fs.existsSync(destDir)) {
    console.error(`Error: Test "${testName}" already exists at ${destDir}`);
    process.exit(1);
  }

  console.log(`Creating API test: ${testName}`);

  // Create directory structure
  createDirectory(destDir);
  createDirectory(path.join(destDir, 'tests'));
  createDirectory(path.join(destDir, 'testdata'));
  createDirectory(path.join(destDir, 'helpers'));
  createDirectory(path.join(destDir, 'config'));
  createDirectory(path.join(destDir, 'queries'));
  createDirectory(path.join(destDir, 'steps'));
  createDirectory(path.join(destDir, 'types'));

  // Copy and process templates
  copyTemplate(
    path.join(templatesDir, 'main.ts.template'),
    path.join(destDir, 'main.ts'),
    testName
  );

  copyTemplate(
    path.join(templatesDir, 'testdata', 'testdata.ts.template'),
    path.join(destDir, 'testdata', 'testdata.ts'),
    testName
  );

  copyTemplate(
    path.join(templatesDir, 'testdata', 'testdata.dev.ts.template'),
    path.join(destDir, 'testdata', 'testdata.dev.ts'),
    testName
  );

  copyTemplate(
    path.join(templatesDir, 'testdata', 'testdata.prd.ts.template'),
    path.join(destDir, 'testdata', 'testdata.prd.ts'),
    testName
  );

  copyTemplate(
    path.join(templatesDir, 'helpers', 'types.ts.template'),
    path.join(destDir, 'helpers', 'types.ts'),
    testName
  );

  copyTemplate(
    path.join(templatesDir, 'helpers', 'utils.ts.template'),
    path.join(destDir, 'helpers', 'utils.ts'),
    testName
  );

  copyTemplate(
    path.join(templatesDir, 'helpers', 'graphql.ts.template'),
    path.join(destDir, 'helpers', 'graphql.ts'),
    testName
  );

  copyTemplate(
    path.join(templatesDir, 'config', 'options.smoke.json.template'),
    path.join(destDir, 'config', 'options.smoke.json'),
    testName
  );

  // Copy package.json and tsconfig.json
  copyTemplate(
    path.join(templatesDir, 'package.json.template'),
    path.join(destDir, 'package.json'),
    testName
  );

  copyTemplate(
    path.join(templatesDir, 'tsconfig.json.template'),
    path.join(destDir, 'tsconfig.json'),
    testName
  );

  // Copy type declarations
  copyTemplate(
    path.join(templatesDir, 'types', 'k6chaijs.d.ts.template'),
    path.join(destDir, 'types', 'k6chaijs.d.ts'),
    testName
  );

  copyTemplate(
    path.join(templatesDir, 'types', 'globals.d.ts.template'),
    path.join(destDir, 'types', 'globals.d.ts'),
    testName
  );

  // Create .gitkeep files for empty directories
  fs.writeFileSync(path.join(destDir, 'tests', '.gitkeep'), '');
  fs.writeFileSync(path.join(destDir, 'queries', '.gitkeep'), '');
  fs.writeFileSync(path.join(destDir, 'steps', '.gitkeep'), '');

  console.log(`✓ Created API test structure at: ${destDir}`);
  console.log('\nGenerated files:');
  console.log(`  - ${testName}/main.ts`);
  console.log(`  - ${testName}/package.json`);
  console.log(`  - ${testName}/tsconfig.json`);
  console.log(`  - ${testName}/tests/`);
  console.log(`  - ${testName}/testdata/`);
  console.log(`  - ${testName}/helpers/`);
  console.log(`  - ${testName}/config/`);
  console.log(`  - ${testName}/queries/ (empty)`);
  console.log(`  - ${testName}/steps/ (empty)`);
  console.log('\nNext steps:');
  console.log(`  1. cd ${testName} && npm install`);
  console.log(`  2. Add tests using: npx tsx ../generators/add-test-from-har.ts . <harFile> <operationName>`);
  console.log(`  3. Build and run: npm run test:smoke`);
  console.log('\nSee RUN-TESTS.md for detailed instructions.');
}

main();

