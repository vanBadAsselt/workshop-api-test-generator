// How to run:
// ts-node generate-k6-test-script.ts graphql-output.json k6-test-script.js

import * as fs from "fs";

interface GraphQLRequest {
  url: string;
  operationName: string;
  query: string;
  variables: Record<string, any>;
}

interface GraphQLResponse {
  [key: string]: any;
}

interface GraphQLCall {
  request: GraphQLRequest;
  response: GraphQLResponse;
}

const inputFile = process.argv[2];
const outputFile = process.argv[3] || "k6-test.js";

if (!inputFile) {
  console.error("Usage: ts-node generate-k6-test-smart.ts <inputJson> [outputFile]");
  process.exit(1);
}

const data: GraphQLCall = JSON.parse(fs.readFileSync(inputFile, "utf8"));
const { request, response } = data;

// --- Type inference logic ---
function inferType(value: any): string {
  if (value === null) return "null";
  if (Array.isArray(value)) {
    return value.length ? `array<${inferType(value[0])}>` : "array<any>";
  }
  if (typeof value === "number" && !Number.isNaN(value)) return "number";
  if (!isNaN(Number(value)) && typeof value === "string" && value.trim() !== "") return "string";
  return typeof value;
}

// --- Recursively build checks with full JSON path ---
function buildChecks(obj: any, path: string[]): string[] {
  const checks: string[] = [];

  for (const [key, value] of Object.entries(obj)) {
    const currentPath = [...path, key];
    const jsPath = currentPath.join("?.");
    const type = inferType(value);

    if (value && typeof value === "object" && !Array.isArray(value)) {
      checks.push(...buildChecks(value, currentPath));
    } else {
      const checkName = `${jsPath} is ${type}`;
      const checkExpr =
        type.startsWith("array") ?
          `(v) => Array.isArray(v.${jsPath})` :
          `(v) => typeof v.${jsPath} === '${type}'`;
      checks.push(`'${checkName}': ${checkExpr}`);
    }
  }

  return checks;
}

// --- Start from data root ---
const dataRoot = Object.keys(response.data || {})[0];
const inferredChecks = buildChecks(response.data[dataRoot], ["data", dataRoot]);

const queryString = request.query.replace(/`/g, "\\`");

// --- Generate k6 test ---
const k6Script = `import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 1,
  duration: '5s',
};

export default function () {
  const url = '${request.url}';
  const payload = JSON.stringify({
    query: \`${queryString}\`,
    operationName: '${request.operationName}',
    variables: ${JSON.stringify(request.variables, null, 2)}
  });

  const headers = { 'Content-Type': 'application/json' };
  const res = http.post(url, payload, { headers });

  check(res, { 'status is 200': (r) => r.status === 200 });

  const json = res.json();

  check(json, {
    'has data': (r) => r.data !== undefined,
    'has ${dataRoot}': (r) => r.data?.${dataRoot} !== undefined,
${inferredChecks.map(c => "    " + c).join(",\n")}
  });

  sleep(1);
}
`;

fs.writeFileSync(outputFile, k6Script);
console.log(`✅ Smart k6 test with correct nested contract checks written to ${outputFile}`);
