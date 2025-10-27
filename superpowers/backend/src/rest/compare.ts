import { Request, Response } from 'express';
import { dataService } from '../data-service';

/**
 * POST /api/compare
 * Compare two characters and return who would win
 */
export const compareCharacters = (req: Request, res: Response) => {
  try {
    const { characterIds } = req.body;

    // Validate input
    if (!characterIds || !Array.isArray(characterIds) || characterIds.length !== 2) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Must provide exactly 2 character IDs in the characterIds array',
      });
    }

    const [id1, id2] = characterIds;

    // Compare characters
    const comparison = dataService.compareCharacters(id1, id2);

    if (!comparison) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'One or both characters not found',
      });
    }

    // Return comparison result
    return res.json({
      comparison,
    });
  } catch (error) {
    console.error('Error comparing characters:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to compare characters',
    });
  }
};
