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

  check(res, { 'status is 200': (r) => r.status === 200 });

  const json = res.json();

  check(json, {
    'has data': (r) => r.data !== undefined,
    'has getCharacter': (r) => r.data?.getCharacter !== undefined,
    'data?.getCharacter?.id is string': (v) => typeof v.data?.getCharacter?.id === 'string',
    'data?.getCharacter?.name is string': (v) => typeof v.data?.getCharacter?.name === 'string',
    'data?.getCharacter?.slug is string': (v) => typeof v.data?.getCharacter?.slug === 'string',
    'data?.getCharacter?.totalPower is number': (v) => typeof v.data?.getCharacter?.totalPower === 'number',
    'data?.getCharacter?.image?.url is string': (v) => typeof v.data?.getCharacter?.image?.url === 'string',
    'data?.getCharacter?.image?.__typename is string': (v) => typeof v.data?.getCharacter?.image?.__typename === 'string',
    'data?.getCharacter?.powerstats?.intelligence is string': (v) => typeof v.data?.getCharacter?.powerstats?.intelligence === 'string',
    'data?.getCharacter?.powerstats?.strength is string': (v) => typeof v.data?.getCharacter?.powerstats?.strength === 'string',
    'data?.getCharacter?.powerstats?.speed is string': (v) => typeof v.data?.getCharacter?.powerstats?.speed === 'string',
    'data?.getCharacter?.powerstats?.durability is string': (v) => typeof v.data?.getCharacter?.powerstats?.durability === 'string',
    'data?.getCharacter?.powerstats?.power is string': (v) => typeof v.data?.getCharacter?.powerstats?.power === 'string',
    'data?.getCharacter?.powerstats?.combat is string': (v) => typeof v.data?.getCharacter?.powerstats?.combat === 'string',
    'data?.getCharacter?.powerstats?.__typename is string': (v) => typeof v.data?.getCharacter?.powerstats?.__typename === 'string',
    'data?.getCharacter?.biography?.fullName is string': (v) => typeof v.data?.getCharacter?.biography?.fullName === 'string',
    'data?.getCharacter?.biography?.aliases is array<string>': (v) => Array.isArray(v.data?.getCharacter?.biography?.aliases),
    'data?.getCharacter?.biography?.placeOfBirth is string': (v) => typeof v.data?.getCharacter?.biography?.placeOfBirth === 'string',
    'data?.getCharacter?.biography?.alignment is string': (v) => typeof v.data?.getCharacter?.biography?.alignment === 'string',
    'data?.getCharacter?.biography?.publisher is string': (v) => typeof v.data?.getCharacter?.biography?.publisher === 'string',
    'data?.getCharacter?.biography?.firstAppearance is string': (v) => typeof v.data?.getCharacter?.biography?.firstAppearance === 'string',
    'data?.getCharacter?.biography?.__typename is string': (v) => typeof v.data?.getCharacter?.biography?.__typename === 'string',
    'data?.getCharacter?.appearance?.gender is string': (v) => typeof v.data?.getCharacter?.appearance?.gender === 'string',
    'data?.getCharacter?.appearance?.race is string': (v) => typeof v.data?.getCharacter?.appearance?.race === 'string',
    'data?.getCharacter?.appearance?.height is array<string>': (v) => Array.isArray(v.data?.getCharacter?.appearance?.height),
    'data?.getCharacter?.appearance?.weight is array<string>': (v) => Array.isArray(v.data?.getCharacter?.appearance?.weight),
    'data?.getCharacter?.appearance?.__typename is string': (v) => typeof v.data?.getCharacter?.appearance?.__typename === 'string',
    'data?.getCharacter?.work?.occupation is string': (v) => typeof v.data?.getCharacter?.work?.occupation === 'string',
    'data?.getCharacter?.work?.base is string': (v) => typeof v.data?.getCharacter?.work?.base === 'string',
    'data?.getCharacter?.work?.__typename is string': (v) => typeof v.data?.getCharacter?.work?.__typename === 'string',
    'data?.getCharacter?.__typename is string': (v) => typeof v.data?.getCharacter?.__typename === 'string'
  });

  sleep(1);
}
