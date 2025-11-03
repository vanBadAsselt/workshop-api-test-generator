import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');

// Test configuration
export const options = {
  stages: [
    { duration: '30s', target: 10 },  // Ramp-up to 10 users
    { duration: '1m', target: 10 },   // Stay at 10 users
    { duration: '30s', target: 0 },   // Ramp-down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
    http_req_failed: ['rate<0.01'],   // Error rate must be less than 1%
    errors: ['rate<0.1'],              // Custom error rate threshold
  },
};

// GraphQL endpoint - UPDATE THIS WITH YOUR ACTUAL ENDPOINT
const GRAPHQL_ENDPOINT = 'http://localhost:4000';

// GraphQL query
const GET_CHARACTER_QUERY = `
  query GetCharacter($id: ID!) {
    getCharacter(id: $id) {
      id
      name
      slug
      totalPower
      image {
        url
        __typename
      }
      powerstats {
        intelligence
        strength
        speed
        durability
        power
        combat
        __typename
      }
      biography {
        fullName
        aliases
        placeOfBirth
        alignment
        publisher
        firstAppearance
        __typename
      }
      appearance {
        gender
        race
        height
        weight
        __typename
      }
      work {
        occupation
        base
        __typename
      }
      __typename
    }
  }
`;

// Test data - character IDs to test
const CHARACTER_IDS = ['1002', '1001', '1003', '1004', '1005'];

export default function () {
  // Select a random character ID from the test data
  const characterId = CHARACTER_IDS[Math.floor(Math.random() * CHARACTER_IDS.length)];

  // Prepare the GraphQL request payload
  const payload = JSON.stringify({
    operationName: 'GetCharacter',
    variables: {
      id: characterId,
    },
    query: GET_CHARACTER_QUERY,
  });

  // Set request headers
  const params = {
    headers: {
      'Content-Type': 'application/json',
      // Add authentication headers if needed
      // 'Authorization': 'Bearer YOUR_TOKEN',
    },
    tags: {
      name: 'GetCharacter',
    },
  };

  // Execute the GraphQL request
  const response = http.post(GRAPHQL_ENDPOINT, payload, params);

  // Validate response
  const checkResult = check(response, {
    'status is 200': (r) => r.status === 200,
    'response has data': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.data && body.data.getCharacter;
      } catch (e) {
        return false;
      }
    },
    'character has id': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.data.getCharacter.id === characterId;
      } catch (e) {
        return false;
      }
    },
    'character has name': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.data.getCharacter.name && body.data.getCharacter.name.length > 0;
      } catch (e) {
        return false;
      }
    },
    'powerstats are present': (r) => {
      try {
        const body = JSON.parse(r.body);
        const ps = body.data.getCharacter.powerstats;
        return ps && ps.intelligence && ps.strength && ps.speed;
      } catch (e) {
        return false;
      }
    },
    'biography is present': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.data.getCharacter.biography && body.data.getCharacter.biography.fullName;
      } catch (e) {
        return false;
      }
    },
    'no GraphQL errors': (r) => {
      try {
        const body = JSON.parse(r.body);
        return !body.errors;
      } catch (e) {
        return false;
      }
    },
  });

  // Track errors
  errorRate.add(!checkResult);

  // Optional: Log response for debugging (disable in production tests)
  // console.log(`Character ID: ${characterId}, Status: ${response.status}`);

  // Think time between requests
  sleep(1);
}

// Setup function (runs once at start)
export function setup() {
  console.log('Starting GetCharacter GraphQL load test...');
  console.log(`Endpoint: ${GRAPHQL_ENDPOINT}`);
  console.log(`Test character IDs: ${CHARACTER_IDS.join(', ')}`);
}

// Teardown function (runs once at end)
export function teardown(data) {
  console.log('Test completed!');
}