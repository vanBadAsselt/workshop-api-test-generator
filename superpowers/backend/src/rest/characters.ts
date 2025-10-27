import { Request, Response } from 'express';
import { dataService } from '../data-service';

/**
 * GET /api/characters/:id/stats
 * Get simplified character stats for comparison
 */
export const getCharacterStats = (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const character = dataService.getCharacterById(id);

    if (!character) {
      return res.status(404).json({
        error: 'Not Found',
        message: `Character with ID ${id} not found`,
      });
    }

    // Calculate total power
    const totalPower = [
      parseInt(character.powerstats.intelligence) || 0,
      parseInt(character.powerstats.strength) || 0,
      parseInt(character.powerstats.speed) || 0,
      parseInt(character.powerstats.durability) || 0,
      parseInt(character.powerstats.power) || 0,
      parseInt(character.powerstats.combat) || 0,
    ].reduce((sum, val) => sum + val, 0);

    // Return simplified stats
    return res.json({
      id: character.id,
      name: character.name,
      alignment: character.biography.alignment,
      powerstats: {
        intelligence: parseInt(character.powerstats.intelligence) || 0,
        strength: parseInt(character.powerstats.strength) || 0,
        speed: parseInt(character.powerstats.speed) || 0,
        durability: parseInt(character.powerstats.durability) || 0,
        power: parseInt(character.powerstats.power) || 0,
        combat: parseInt(character.powerstats.combat) || 0,
      },
      totalPower,
    });
  } catch (error) {
    console.error('Error fetching character stats:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch character stats',
    });
  }
};

/**
 * GET /api/random
 * Get a random character
 */
export const getRandomCharacter = (_req: Request, res: Response) => {
  try {
    const character = dataService.getRandomCharacter();

    if (!character) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'No characters available',
      });
    }

    return res.json(character);
  } catch (error) {
    console.error('Error fetching random character:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch random character',
    });
  }
};
