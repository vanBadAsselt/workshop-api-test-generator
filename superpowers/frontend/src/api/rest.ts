const REST_API_BASE = 'http://localhost:4001/api';

export interface CompareResult {
  comparison: {
    winner: {
      id: string;
      name: string;
      totalPower: number;
    };
    opponent: {
      id: string;
      name: string;
      totalPower: number;
    };
    powerDifference: number;
    winPercentage: number;
    breakdown: {
      [key: string]: {
        winner: string;
        winnerScore: number;
        opponentScore: number;
        margin: number;
      };
    };
    analysis: string;
  };
}

export interface CharacterStats {
  id: string;
  name: string;
  alignment: string;
  powerstats: {
    intelligence: number;
    strength: number;
    speed: number;
    durability: number;
    power: number;
    combat: number;
  };
  totalPower: number;
}

/**
 * Compare two characters
 */
export async function compareCharacters(
  characterIds: [string, string]
): Promise<CompareResult> {
  const response = await fetch(`${REST_API_BASE}/compare`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ characterIds }),
  });

  if (!response.ok) {
    throw new Error('Failed to compare characters');
  }

  return response.json();
}

/**
 * Get character stats
 */
export async function getCharacterStats(id: string): Promise<CharacterStats> {
  const response = await fetch(`${REST_API_BASE}/characters/${id}/stats`);

  if (!response.ok) {
    throw new Error('Failed to fetch character stats');
  }

  return response.json();
}

/**
 * Get random character
 */
export async function getRandomCharacter(): Promise<any> {
  const response = await fetch(`${REST_API_BASE}/random`);

  if (!response.ok) {
    throw new Error('Failed to fetch random character');
  }

  return response.json();
}
