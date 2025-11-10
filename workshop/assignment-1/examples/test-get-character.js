
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend } from 'k6/metrics';

export const options = {
  vus: 1,
  iterations: 1,
  thresholds: {
    http_req_duration: ['p(95)<800'],
    'graphql_getCharacter_time': ['p(95)<800'],
    checks: ['rate>0.99'],
  },
};

const gqlEndpoint = __ENV.GQL_ENDPOINT || 'http://localhost:4000/';
const gqlQuery = `query GetCharacter($id: ID!) {
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
}`;

const gqlVariables = {
  "id": "1002"
};

const graphqlTrend = new Trend('graphql_getCharacter_time');

export default function () {
  const payload = JSON.stringify({
    operationName: 'GetCharacter',
    query: gqlQuery,
    variables: gqlVariables,
  });

  const headers = {
    'Content-Type': 'application/json',
    // Add auth if needed:
    // 'Authorization': `Bearer ${__ENV.TOKEN}`,
  };

  const res = http.post(gqlEndpoint, payload, { headers });
  graphqlTrend.add(res.timings.duration);

  const ok = check(res, {
    'status is 200': (r) => r.status === 200,
    'no GraphQL errors': (r) => !r.json().errors,
    'has data.getCharacter': (r) =>
      r.json().data && r.json().data.getCharacter && r.json().data.getCharacter.id === gqlVariables.id,
  });

  if (!ok) {
    console.error('Response:', res.status, res.body.substring(0, 500));
  }

  sleep(0.5);
}
