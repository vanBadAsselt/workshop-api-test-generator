// How to run:
// ts-node generate-k6-test.ts graphql-output.json k6-test.js

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
  console.error("Usage: ts-node generate-k6-test.ts <inputJson> [outputFile]");
  process.exit(1);
}

// Load the extracted GraphQL JSON
const data: GraphQLCall = JSON.parse(fs.readFileSync(inputFile, "utf8"));
const { request, response } = data;

// Escape quotes and format query safely for JavaScript
const queryString = request.query.replace(/`/g, "\\`");

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

  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  // Optional: verify response matches expected structure
  const json = res.json();
  check(json, {
    'has data': (r) => r.data !== undefined,
    'operation returns expected key': (r) => r.data?.${Object.keys(response.data || {})[0]} !== undefined,
  });

  sleep(1);
}
`;

fs.writeFileSync(outputFile, k6Script);
console.log(`✅ k6 test generated: ${outputFile}`);
