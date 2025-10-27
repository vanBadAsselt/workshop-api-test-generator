import { dataService } from '../data-service';
import { Character } from '../types';

export const resolvers = {
  Query: {
    searchCharacters: (
      _parent: unknown,
      args: {
        searchTerm?: string;
        alignment?: string;
        sortBy?: string;
        limit?: number;
        offset?: number;
      }
    ) => {
      const result = dataService.searchCharacters(args);
      return result;
    },

    getCharacter: (_parent: unknown, args: { id: string }) => {
      const character = dataService.getCharacterById(args.id);
      return character || null;
    },

    getCharactersByAlignment: (_parent: unknown, args: { alignment: string }) => {
      return dataService.getCharactersByAlignment(args.alignment);
    },

    getRandomCharacter: () => {
      return dataService.getRandomCharacter();
    },
  },

  Mutation: {
    rateCharacter: (
      _parent: unknown,
      args: { id: string; rating: number }
    ) => {
      // Mock mutation - doesn't persist
      const character = dataService.getCharacterById(args.id);

      if (!character) {
        throw new Error(`Character with ID ${args.id} not found`);
      }

      // Return mock response
      return {
        id: args.id,
        rating: args.rating,
        totalRatings: Math.floor(Math.random() * 1000) + 100,
        message: `Successfully rated ${character.name} with ${args.rating} stars!`,
      };
    },
  },

  Character: {
    totalPower: (parent: Character) => {
      const stats = parent.powerstats;
      const values = [
        parseInt(stats.intelligence) || 0,
        parseInt(stats.strength) || 0,
        parseInt(stats.speed) || 0,
        parseInt(stats.durability) || 0,
        parseInt(stats.power) || 0,
        parseInt(stats.combat) || 0,
      ];
      return values.reduce((sum, val) => sum + val, 0);
    },
  },
};
