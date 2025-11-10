export const getCharacterQuery = `
  query GetCharacter($id: ID!) {
    getCharacter(id: $id) {
      __typename
      id
      name
      slug
      totalPower
      image {
        url
        __typename
      }
      powerstats {
        __typename
        intelligence
        strength
        speed
        durability
        power
        combat
      }
      biography {
        __typename
        fullName
        aliases
        placeOfBirth
        alignment
        publisher
        firstAppearance
      }
      appearance {
        __typename
        gender
        race
        height
        weight
      }
      work {
        __typename
        occupation
        base
      }
    }
  }
`;
