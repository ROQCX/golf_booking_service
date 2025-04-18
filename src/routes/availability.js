import express from 'express';
import { getAvailability } from '../services/ezlinksClient.js';
import { getClubById } from '../db/clubs.js';

export const availabilityRouter = express.Router();

availabilityRouter.get('/', async (req, res) => {
  try {
    const { club_id, date } = req.query;

    if (!club_id || !date) {
      return res.status(400).json({
        error: 'Missing required fields'
      });
    }

    const club = await getClubById(club_id);
    if (!club) {
      return res.status(404).json({
        error: `Club not found: ${club_id}`
      });
    }

    const availability = await getAvailability(club, date);
    res.json({
      ...availability,
      courseInfo: club.courseInfo
    });
  } catch (error) {
    if (error.message.includes('Club not found')) {
      return res.status(404).json({
        error: error.message
      });
    }
    throw error;
  }
}); 