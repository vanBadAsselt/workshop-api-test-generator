export const getCharacterQuery = `query GetCharacter($id: ID!) {
  getCharacter(id: $id) {
    id
    name
    slug
    totalPower
    image {
      url
      __typename
    }
  }
`;
