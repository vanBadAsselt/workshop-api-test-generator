#!/usr/bin/env tsx
// Simple API test scaffolding generator
import * as fs from 'fs';
import * as path from 'path';

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
    path.join(templatesDir, 'config', 'options.smoke.json.template'),
    path.join(destDir, 'config', 'options.smoke.json'),
    testName
  );

  // Create .gitkeep files for empty directories
  fs.writeFileSync(path.join(destDir, 'tests', '.gitkeep'), '');
  fs.writeFileSync(path.join(destDir, 'queries', '.gitkeep'), '');
  fs.writeFileSync(path.join(destDir, 'steps', '.gitkeep'), '');

  console.log(`✓ Created API test structure at: ${destDir}`);
  console.log('\nGenerated files:');
  console.log(`  - ${testName}/main.ts`);
  console.log(`  - ${testName}/tests/`);
  console.log(`  - ${testName}/testdata/`);
  console.log(`  - ${testName}/helpers/`);
  console.log(`  - ${testName}/config/`);
  console.log(`  - ${testName}/queries/ (empty)`);
  console.log(`  - ${testName}/steps/ (empty)`);
  console.log('\nNext steps:');
  console.log(`  1. Add your GraphQL queries to queries/`);
  console.log(`  2. Create test files in tests/`);
  console.log(`  3. Create step files in steps/`);
  console.log(`  4. Run: k6 run ${testName}/main.ts`);
}

main();

