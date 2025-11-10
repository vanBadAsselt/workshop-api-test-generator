import OpenAI from 'openai';

const SYSTEM_PROMPT = `You are an expert at writing k6 performance tests for GraphQL APIs using TypeScript.

Your task is to generate a k6 test step function that:
1. Uses the k6chaijs library for assertions (expect from https://jslib.k6.io/k6chaijs/4.3.4.3/index.js)
2. Validates the GraphQL response structure and types
3. Checks __typename fields match expected values
4. Validates nested objects and arrays appropriately
5. Includes proper error handling with try-catch
6. References variables from the scenario object (e.g., scenario.id, scenario.searchTerm)

IMPORTANT RULES:
- Import graphQl from "../helpers/graphql.js" (with .js extension)
- Import expectValidJson from "../helpers/utils.js" (with .js extension)
- Import expect from "https://jslib.k6.io/k6chaijs/4.3.4.3/index.js"
- Import the query from the queries folder (with .js extension)
- Use scenario object for variables (e.g., const variables = { id: scenario.id })
- Extract the root query field from responseJson.data
- Use expect() assertions with descriptive labels
- For __typename fields, use .to.equal("TypeName")
- For primitives, use .to.be.a("string"|"number"|"boolean")
- For arrays, check .to.be.an("array") and validate first element if length > 0
- For nested objects, extract them and validate their properties
- Wrap all assertions in try-catch with error logging

Example structure:
\`\`\`typescript
import { graphQl } from "../helpers/graphql.js";
import { expectValidJson } from "../helpers/utils.js";
import { expect } from "https://jslib.k6.io/k6chaijs/4.3.4.3/index.js";
import { getCharacterQuery } from "../queries/getCharacterQuery.js";

export function getCharacterStep(scenario: any) {
  const variables = { id: scenario.characterId };
  const response = graphQl.query(getCharacterQuery, variables);
  const responseJson = expectValidJson(response);

  try {
    const { getCharacter } = responseJson.data;
    expect(getCharacter.__typename, "Typename").to.equal("Character");
    expect(getCharacter.id, "Character ID").to.be.a("string");
    // ... more assertions
  } catch (error) {
    console.error("Error in getCharacterStep:", error);
    console.error("Response JSON:", responseJson);
    throw error;
  }
}
\`\`\`

Return ONLY the complete function code, no explanations.`;

interface GenerateStepOptions {
  operationName: string;
  query: string;
  variables: Record<string, any>;
  response: any;
}

export async function generateStepWithAI(options: GenerateStepOptions): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set. Please set it to use AI-generated assertions.');
  }

  const openai = new OpenAI({ apiKey });

  const userPrompt = `Generate a k6 test step function for this GraphQL operation:

Operation Name: ${options.operationName}

GraphQL Query:
\`\`\`graphql
${options.query}
\`\`\`

Variables:
\`\`\`json
${JSON.stringify(options.variables, null, 2)}
\`\`\`

Example Response:
\`\`\`json
${JSON.stringify(options.response, null, 2)}
\`\`\`

Generate the complete step function with proper assertions based on the response structure.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.25,
      max_tokens: 2000,
    });

    const generatedCode = completion.choices[0]?.message?.content || '';

    // Extract code from markdown if present
    let code = generatedCode;
    const codeBlockMatch = generatedCode.match(/```(?:typescript|ts)?\n([\s\S]*?)```/);
    if (codeBlockMatch) {
      code = codeBlockMatch[1];
    }

    return code.trim();
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw new Error(`Failed to generate test with AI: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
