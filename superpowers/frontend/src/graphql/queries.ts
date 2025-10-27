import { gql } from '@apollo/client';

export const SEARCH_CHARACTERS = gql`
  query SearchCharacters(
    $searchTerm: String
    $alignment: String
    $sortBy: SortOption
    $limit: Int
    $offset: Int
  ) {
    searchCharacters(
      searchTerm: $searchTerm
      alignment: $alignment
      sortBy: $sortBy
      limit: $limit
      offset: $offset
    ) {
      characters {
        id
        name
        slug
        totalPower
        image {
          url
        }
        biography {
          alignment
          publisher
        }
        appearance {
          gender
        }
        powerstats {
          intelligence
          strength
          speed
          durability
          power
          combat
        }
      }
      totalCount
      hasMore
    }
  }
`;

export const GET_CHARACTER = gql`
  query GetCharacter($id: ID!) {
    getCharacter(id: $id) {
      id
      name
      slug
      totalPower
      image {
        url
      }
      powerstats {
        intelligence
        strength
        speed
        durability
        power
        combat
      }
      biography {
        fullName
        aliases
        placeOfBirth
        alignment
        publisher
        firstAppearance
      }
      appearance {
        gender
        race
        height
        weight
      }
      work {
        occupation
        base
      }
    }
  }
`;

export const GET_RANDOM_CHARACTER = gql`
  query GetRandomCharacter {
    getRandomCharacter {
      id
      name
      slug
      totalPower
      image {
        url
      }
      biography {
        alignment
        publisher
      }
    }
  }
`;
