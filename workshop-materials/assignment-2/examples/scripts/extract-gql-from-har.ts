// Extract GetCharacter GraphQL operation from HAR file
import * as fs from 'fs';
import * as path from 'path';

function parseJSON(text?: string): any {
  if (!text) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

function decodeResponse(content?: { text?: string; encoding?: string }): string | undefined {
  if (!content?.text) return undefined;
  if (content.encoding === 'base64') {
    return Buffer.from(content.text, 'base64').toString('utf-8');
  }
  return content.text;
}

function main() {
  const [, , harPath, operationName, outputPath] = process.argv;
  
  if (!harPath || !operationName) {
    console.error('Usage: tsx extract-gql-from-har.ts <input.har> <operationName> [output.json]');
    process.exit(1);
  }

  if (!fs.existsSync(harPath)) {
    console.error(`File not found: ${harPath}`);
    process.exit(1);
  }

  const har = parseJSON(fs.readFileSync(harPath, 'utf-8'));
  const entries = har?.log?.entries || [];

  // Find the specified operation
  for (const entry of entries) {
    if (entry.request?.method !== 'POST') continue;

    const body = parseJSON(entry.request.postData?.text);
    if (body?.operationName === operationName) {
      const responseText = decodeResponse(entry.response?.content);
      
      const result = {
        request: {
          url: entry.request.url,
          operationName: body.operationName,
          variables: body.variables || {},
          query: body.query || '',
        },
        response: parseJSON(responseText) || responseText || null,
      };

      const outPath = outputPath || path.join(path.dirname(harPath), `${operationName}-capture.json`);
      fs.writeFileSync(outPath, JSON.stringify(result, null, 2), 'utf-8');
      console.log(`Saved to: ${outPath}`);
      return;
    }
  }

  console.error(`Operation "${operationName}" not found`);
  process.exit(1);
}

main();

