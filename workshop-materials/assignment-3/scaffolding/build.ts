import * as esbuild from 'esbuild';
import glob from 'tiny-glob';
import * as fs from 'fs-extra';
import * as path from 'path';

/**
 * Build script for k6 test suites
 * Compiles TypeScript to JavaScript for k6 execution
 */
async function build() {
  const testSetName = process.argv[2];
  
  if (!testSetName) {
    console.error('Usage: tsx build.ts <testSetName>');
    console.error('Example: tsx build.ts superpowers');
    process.exit(1);
  }
  
  const projectDir = path.join(__dirname, testSetName);
  
  if (!fs.existsSync(projectDir)) {
    console.error(`Error: Test set "${testSetName}" not found at ${projectDir}`);
    process.exit(1);
  }
  
  console.log(`🚀 Building k6 test suite: ${testSetName} 🚀`);
  
  // Find all TypeScript entry points
  const entryPoints = await glob(`${projectDir}/**/*.ts`);
  
  if (entryPoints.length === 0) {
    console.error(`No TypeScript files found in ${projectDir}`);
    process.exit(1);
  }
  
  const distDir = path.join(projectDir, 'dist');
  
  // Clean dist directory
  if (fs.existsSync(distDir)) {
    await fs.remove(distDir);
  }
  
  // Build with esbuild
  await esbuild
    .build({
      entryPoints,
      bundle: true,
      minify: false,
      keepNames: true,
      outdir: distDir,
      outbase: projectDir,
      platform: 'node',
      format: 'esm',
      target: 'es2020',
      external: [
        'k6',
        'k6/*',
        'https://jslib.k6.io/*'
      ],
      loader: {
        '.ts': 'ts',
      },
    })
    .then(() => console.log('⚡ JavaScript build complete! ⚡'))
    .catch((err) => {
      console.error('Build failed:', err);
      process.exit(1);
    });
  
  // Copy JSON config files
  const jsonFiles = await glob(`${projectDir}/**/*.json`);
  for (const file of jsonFiles) {
    const relativePath = path.relative(projectDir, file);
    const destination = path.join(distDir, relativePath);
    await fs.ensureDir(path.dirname(destination));
    await fs.copy(file, destination);
    console.log(`📄 Copied: ${relativePath}`);
  }
  
  console.log(`✅ Build complete: ${testSetName}/dist`);
  console.log(`\nRun with: k6 run ${testSetName}/dist/main.js`);
}

build().catch((error) => {
  console.error('Build error:', error);
  process.exit(1);
});

