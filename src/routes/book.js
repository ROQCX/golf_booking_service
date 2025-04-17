import express from 'express';
import { getClubById } from '../db/clubs.js';
import { createBooking } from '../services/ezlinksClient.js';
import { saveBooking } from '../db/bookings.js';

const router = express.Router();

router.post('/book', async (req, res) => {
  try {
    const { club_id, user_phone, date, time, players } = req.body;

    // Validate required fields
    if (!club_id || !user_phone || !date || !time || !players) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['club_id', 'user_phone', 'date', 'time', 'players']
      });
    }

    // Validate players count
    if (players < 1 || players > 4) {
      return res.status(400).json({
        error: 'Invalid players count',
        message: 'Players must be between 1 and 4'
      });
    }

    const club = getClubById(club_id);
    
    // Create booking through EZLinks
    const booking = await createBooking(club, {
      date,
      time,
      players,
      userPhone: user_phone
    });

    // Save booking to our database
    await saveBooking({
      ...booking,
      club_id,
      date,
      time,
      players
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error('Booking error:', error);
    res.status(error.code === 'BOOKING_ERROR' ? 503 : 500).json({
      error: error.message
    });
  }
});

export default router; 