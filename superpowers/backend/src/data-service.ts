import * as fs from 'fs';
import * as path from 'path';
import { Character, CharacterData } from './types';

class DataService {
  private characters: Character[] = [];
  private dataLoaded = false;

  constructor() {
    this.loadData();
  }

  private loadData(): void {
    try {
      const dataPath = path.join(__dirname, '../data/characters.json');
      const rawData = fs.readFileSync(dataPath, 'utf-8');
      const data: CharacterData = JSON.parse(rawData);
      this.characters = data.characters;
      this.dataLoaded = true;
      console.log(`✅ Loaded ${this.characters.length} characters from cache`);
    } catch (error) {
      console.error('❌ Failed to load character data:', error);
      this.characters = [];
    }
  }

  /**
   * Calculate total power for a character
   */
  private calculateTotalPower(character: Character): number {
    const stats = character.powerstats;
    const values = [
      parseInt(stats.intelligence) || 0,
      parseInt(stats.strength) || 0,
      parseInt(stats.speed) || 0,
      parseInt(stats.durability) || 0,
      parseInt(stats.power) || 0,
      parseInt(stats.combat) || 0,
    ];
    return values.reduce((sum, val) => sum + val, 0);
  }

  /**
   * Get all characters
   */
  getAllCharacters(): Character[] {
    return this.characters;
  }

  /**
   * Get character by ID
   */
  getCharacterById(id: string): Character | undefined {
    return this.characters.find((char) => char.id === id);
  }

  /**
   * Search characters with filters and pagination
   */
  searchCharacters(options: {
    searchTerm?: string;
    alignment?: string;
    sortBy?: string;
    limit?: number;
    offset?: number;
  }): { characters: Character[]; totalCount: number; hasMore: boolean } {
    let filtered = [...this.characters];

    // Filter by search term (name)
    if (options.searchTerm) {
      const term = options.searchTerm.toLowerCase();
      filtered = filtered.filter((char) =>
        char.name.toLowerCase().includes(term)
      );
    }

    // Filter by alignment
    if (options.alignment && options.alignment !== 'all') {
      filtered = filtered.filter(
        (char) => char.biography.alignment.toLowerCase() === options.alignment?.toLowerCase()
      );
    }

    // Sort
    if (options.sortBy) {
      filtered = this.sortCharacters(filtered, options.sortBy);
    }

    const totalCount = filtered.length;

    // Pagination
    const offset = options.offset || 0;
    const limit = options.limit || 12;
    const paginated = filtered.slice(offset, offset + limit);
    const hasMore = offset + limit < totalCount;

    return {
      characters: paginated,
      totalCount,
      hasMore,
    };
  }

  /**
   * Get characters by alignment
   */
  getCharactersByAlignment(alignment: string): Character[] {
    return this.characters.filter(
      (char) => char.biography.alignment.toLowerCase() === alignment.toLowerCase()
    );
  }

  /**
   * Get a random character
   */
  getRandomCharacter(): Character | undefined {
    if (this.characters.length === 0) return undefined;
    const randomIndex = Math.floor(Math.random() * this.characters.length);
    return this.characters[randomIndex];
  }

  /**
   * Sort characters
   */
  private sortCharacters(characters: Character[], sortBy: string): Character[] {
    const sorted = [...characters];

    switch (sortBy) {
      case 'NAME_ASC':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'NAME_DESC':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'POWER_ASC':
        sorted.sort((a, b) => this.calculateTotalPower(a) - this.calculateTotalPower(b));
        break;
      case 'POWER_DESC':
        sorted.sort((a, b) => this.calculateTotalPower(b) - this.calculateTotalPower(a));
        break;
      default:
        break;
    }

    return sorted;
  }

  /**
   * Get character with computed totalPower
   */
  getCharacterWithTotalPower(character: Character): Character & { totalPower: number } {
    return {
      ...character,
      totalPower: this.calculateTotalPower(character),
    };
  }

  /**
   * Compare two characters
   */
  compareCharacters(id1: string, id2: string) {
    const char1 = this.getCharacterById(id1);
    const char2 = this.getCharacterById(id2);

    if (!char1 || !char2) {
      return null;
    }

    const power1 = this.calculateTotalPower(char1);
    const power2 = this.calculateTotalPower(char2);

    const winner = power1 > power2 ? char1 : char2;
    const opponent = power1 > power2 ? char2 : char1;
    const winnerPower = Math.max(power1, power2);
    const opponentPower = Math.min(power1, power2);

    // Compare individual stats
    const breakdown = {
      intelligence: this.compareStats('intelligence', char1, char2),
      strength: this.compareStats('strength', char1, char2),
      speed: this.compareStats('speed', char1, char2),
      durability: this.compareStats('durability', char1, char2),
      power: this.compareStats('power', char1, char2),
      combat: this.compareStats('combat', char1, char2),
    };

    // Generate analysis
    const winsCount = Object.values(breakdown).filter(
      (stat) => stat.winner === winner.name
    ).length;
    const analysis = `${winner.name} dominates with superior power, winning in ${winsCount} out of 6 categories.`;

    return {
      winner: {
        id: winner.id,
        name: winner.name,
        totalPower: winnerPower,
      },
      opponent: {
        id: opponent.id,
        name: opponent.name,
        totalPower: opponentPower,
      },
      powerDifference: Math.abs(power1 - power2),
      winPercentage: Math.round((winnerPower / (winnerPower + opponentPower)) * 100 * 10) / 10,
      breakdown,
      analysis,
    };
  }

  /**
   * Compare individual stat
   */
  private compareStats(
    stat: keyof Character['powerstats'],
    char1: Character,
    char2: Character
  ) {
    const val1 = parseInt(char1.powerstats[stat]) || 0;
    const val2 = parseInt(char2.powerstats[stat]) || 0;

    return {
      winner: val1 > val2 ? char1.name : val1 < val2 ? char2.name : 'Tie',
      winnerScore: Math.max(val1, val2),
      opponentScore: Math.min(val1, val2),
      margin: Math.abs(val1 - val2),
    };
  }
}

// Singleton instance
export const dataService = new DataService();
