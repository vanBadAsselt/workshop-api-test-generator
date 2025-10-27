#!/usr/bin/env ts-node

/**
 * Generate a k6 test script from a JSON file containing a GraphQL request/response.
 *
 * Input JSON shape (example):
 * {
 *   "request": {
 *     "method": "POST",
 *     "url": "http://localhost:4000/graphql",
 *     "operationName": "GetCharacter",
 *     "variables": { "id": "1002" },
 *     "query": "query GetCharacter($id: ID!) { ... }"
 *   },
 *   "response": { "data": { "getCharacter": { "id": "1002", "name": "Wonder Woman" } } }
 * }
 *
 * Usage:
 *   ts-node generate-k6-from-json.ts <input.json> [--out getCharacter.k6.js] [--vus 1] [--iterations 1]
 *   # Default: prints the k6 script to stdout
 */

import * as fs from 'fs';
import * as path from 'path';

type InputShape = {
  request: {
    url: string;
    operationName?: string;
    variables?: Record<string, any>;
    query: string;
  };
  response?: any;
};

function parseArgs(argv: string[]) {
  const positionals: string[] = [];
  const args: Record<string, string | boolean> = {};
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const [k, vCandidate] = a.split('=');
      const key = k.replace(/^--/, '');
      const next = argv[i+1];
      if (typeof vCandidate !== 'undefined' && vCandidate !== k) {
        args[key] = vCandidate;
      } else if (next && !next.startsWith('--')) {
        args[key] = next;
        i++;
      } else {
        args[key] = true;
      }
    } else {
      positionals.push(a);
    }
  }
  return { positionals, args };
}

function getFirstDataRoot(obj: any): { rootKey?: string, value?: any } {
  if (!obj || typeof obj !== 'object') return {};
  const data = obj.data;
  if (data && typeof data === 'object') {
    const keys = Object.keys(data);
    if (keys.length > 0) {
      const rootKey = keys[0];
      return { rootKey, value: (data as any)[rootKey] };
    }
  }
  return {};
}

function jsStringLiteral(s: string): string {
  // Escape backticks and ${ for template literals
  return s.replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
}

function generateChecks(operationName?: string, variables?: Record<string, any>, respExample?: any): string {
  const checks: string[] = [];
  checks.push(`'status is 200': (r) => r.status === 200`);

  // Basic GraphQL shape checks
  checks.push(`'has data': () => !!body && !!body.data`);

  // Try to infer root key from response example
  const { rootKey, value } = getFirstDataRoot(respExample);
  if (rootKey) {
    checks.push(`'has data.${rootKey}': () => !!body?.data?.${rootKey}`);
  }

  // If variables contain an id, verify it matches
  if (variables && typeof variables['id'] !== 'undefined' && rootKey) {
    checks.push(`'id matches requested': () => String(body?.data?.${rootKey}?.id) === String(variables.id)`);
  }

  // Add existence checks for a few scalar fields from example
  if (value && typeof value === 'object') {
    const scalars: string[] = [];
    for (const [k, v] of Object.entries(value)) {
      if (['string', 'number', 'boolean'].includes(typeof v)) {
        scalars.push(k);
      }
      // limit number of extra checks to keep script lean
      if (scalars.length >= 6) break;
    }
    scalars.forEach(k => {
      checks.push(`'has ${k}': () => body?.data?.${rootKey}?.${k} !== undefined && body?.data?.${rootKey}?.${k} !== null`);
    });
  }

  return checks.join(',\n    ');
}

function main() {
  const { positionals, args } = parseArgs(process.argv);
  if (positionals.length < 1) {
    console.error('Usage: ts-node generate-k6-from-json.ts <input.json> [--out file.k6.js] [--vus 1] [--iterations 1]');
    process.exit(1);
  }

  const inputPath = positionals[0];
  if (!fs.existsSync(inputPath)) {
    console.error(`Input file not found: ${inputPath}`);
    process.exit(1);
  }

  let input: InputShape;
  try {
    input = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));
  } catch (e) {
    console.error('Failed to parse input JSON:', (e as Error).message);
    process.exit(1);
  }

  const vus = Number(args['vus'] ?? 1);
  const iterations = Number((args['iterations'] ?? 1));
  const out = typeof args['out'] === 'string' ? String(args['out']) : undefined;

  const url = input.request?.url || 'http://localhost:4000/graphql';
  const operationName = input.request?.operationName || undefined;
  const variables = input.request?.variables || {};
  const query = input.request?.query || '';

  const checksBlock = generateChecks(operationName, variables, input.response);

  const script = `import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: ${isFinite(vus) ? vus : 1},
  iterations: ${isFinite(iterations) ? iterations : 1},
  thresholds: {
    checks: ['rate>0.95'],
    http_req_duration: ['p(95)<800'],
  },
};

const url = __ENV.GRAPHQL_URL || '${url}';
const operationName = '${operationName ?? ''}';
const variables = ${JSON.stringify(variables, null, 2)};
const query = \`${jsStringLiteral(query)}\`;

export default function () {
  const payload = JSON.stringify({
    operationName: operationName || undefined,
    query,
    variables,
  });

  const res = http.post(url, payload, {
    headers: { 'Content-Type': 'application/json' },
    tags: { name: operationName || 'GraphQLOperation' },
  });

  const body = res.json();

  check(res, {
    ${checksBlock}
  });

  sleep(0.2);
}
`;

  if (out) {
    fs.writeFileSync(out, script, 'utf-8');
    console.log(`Wrote k6 script -> ${path.resolve(out)}`);
  } else {
    process.stdout.write(script);
  }
}

if (require.main === module) {
  main();
}
