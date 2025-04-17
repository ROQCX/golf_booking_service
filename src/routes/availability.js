import express from 'express';
import { getClubById } from '../db/clubs.js';
import { getAvailability } from '../services/ezlinksClient.js';

const router = express.Router();

router.get('/availability', async (req, res) => {
  try {
    const { club_id, date } = req.query;

    // Validate required fields
    if (!club_id || !date) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['club_id', 'date']
      });
    }

    const club = getClubById(club_id);
    
    // Get availability through EZLinks
    const availability = await getAvailability(club, date);

    // Add courseInfo to response
    res.json({
      ...availability,
      courseInfo: club.courseInfo
    });
  } catch (error) {
    console.error('Availability error:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

export default router; 