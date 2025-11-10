// extract-graphql.ts
// npm install -g tsx
// tsx extract-graphql.ts wonder-woman.har GetCharacter

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

interface ExtractedGraphQL {
  request: GraphQLRequest;
  response: GraphQLResponse;
}

const harFile = process.argv[2];
const operationName = process.argv[3];
const outputFile = process.argv[4] || "graphql-output.json";

if (!harFile || !operationName) {
  console.error("Usage: ts-node extract-graphql.ts <harFile> <operationName> [outputFile]");
  process.exit(1);
}

const harData = JSON.parse(fs.readFileSync(harFile, "utf8"));
const entries = harData.log?.entries || [];

let result: ExtractedGraphQL | null = null;

for (const entry of entries) {
  const request = entry.request;
  const postData = request?.postData?.text;

  if (!postData) continue;

  try {
    const body = JSON.parse(postData);
    if (body.operationName === operationName) {
      result = {
        request: {
          url: request.url,
          operationName: body.operationName,
          query: body.query,
          variables: body.variables,
        },
        response: JSON.parse(entry.response?.content?.text || "{}"),
      };
      break;
    }
  } catch {
    continue;
  }
}

if (!result) {
  console.error(`Operation "${operationName}" not found in HAR file.`);
  process.exit(1);
}

fs.writeFileSync(outputFile, JSON.stringify(result, null, 2));
console.log(`✅ Extracted operation "${operationName}" written to ${outputFile}`);
