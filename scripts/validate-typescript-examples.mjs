import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const examplesDir = path.join(rootDir, 'examples/02-typescript');
const tscPath = path.join(rootDir, 'node_modules/.bin/tsc');

if (!existsSync(tscPath)) {
  console.error('Local TypeScript compiler was not found. Run npm install first.');
  process.exit(1);
}

function walkFiles(dir, predicate, result = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walkFiles(fullPath, predicate, result);
      continue;
    }

    if (predicate(fullPath)) {
      result.push(fullPath);
    }
  }

  return result;
}

const tsFiles = walkFiles(examplesDir, (file) => file.endsWith('.ts'));
const jsFiles = walkFiles(examplesDir, (file) => file.endsWith('.js'));

let diagnosticExamples = 0;

for (const file of tsFiles) {
  const source = readFileSync(file, 'utf8');
  const relativePath = path.relative(rootDir, file);
  const isDiagnostic = source.includes('INTENTIONAL TYPESCRIPT DIAGNOSTIC EXAMPLE');

  if (isDiagnostic) {
    diagnosticExamples += 1;

    if (!source.includes('@ts-expect-error')) {
      console.error(`${relativePath}: diagnostic example must use @ts-expect-error.`);
      process.exit(1);
    }
  }

  execFileSync(tscPath, [
    '--noEmit',
    '--strict',
    '--target',
    'ES2022',
    '--module',
    'ES2022',
    file,
  ], {
    cwd: rootDir,
    stdio: 'pipe',
  });
}

for (const file of jsFiles) {
  execFileSync(process.execPath, [file], {
    cwd: rootDir,
    stdio: 'pipe',
  });
}

console.log('TypeScript examples validation passed');
console.log(`- TypeScript examples checked: ${tsFiles.length}`);
console.log(`- JavaScript examples executed: ${jsFiles.length}`);
console.log(`- Intentional diagnostic examples checked: ${diagnosticExamples}`);
