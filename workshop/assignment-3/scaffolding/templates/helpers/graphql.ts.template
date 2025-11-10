import http from 'k6/http';
import exec from 'k6/execution';

/**
 * Extract the operation name from a GraphQL query/mutation
 */
export function getQueryOrMutationName(graphqlText: string): string | null {
  const match = graphqlText.match(/(query|mutation)\s+(\w+)/);
  return match ? match[2] : null;
}

/**
 * Executes a GraphQL query with K6
 * @param query The GraphQL query to execute
 * @param variables The variables to use in the query
 * @param accessToken Optional access token for authorization
 * @return The response from the query
 */
function query(
  query: string,
  variables: any,
  accessToken?: string
) {
  const scenarioName = exec.scenario.name;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }
  
  const response = http.post(
    __ENV.GRAPHQL_URL || 'http://localhost:4000/',
    JSON.stringify({ query, variables }),
    { headers }
  );

  const gqlRequestName = getQueryOrMutationName(query);
  console.log(
    `${scenarioName} - GQL request: ${gqlRequestName}\n------------------------`
  );
  
  return response;
}

export const graphQl = {
  query
};

