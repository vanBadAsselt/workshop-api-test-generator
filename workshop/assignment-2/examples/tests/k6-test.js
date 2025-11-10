import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 1,
  duration: '5s',
};

export default function () {
  const url = 'http://localhost:4000/';
  const payload = JSON.stringify({
    query: `query GetCharacter($id: ID!) {
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
}`,
    operationName: 'GetCharacter',
    variables: {
  "id": "1002"
}
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
    'operation returns expected key': (r) => r.data?.getCharacter !== undefined,
  });

  sleep(1);
}
