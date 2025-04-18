import express from 'express';
import { createBooking } from '../services/ezlinksClient.js';
import { getClubById } from '../db/clubs.js';
import { saveBooking } from '../db/bookings.js';

export const bookingRouter = express.Router();

bookingRouter.post('/', async (req, res) => {
  try {
    const { club_id, date, time, players, player_names } = req.body;

    if (!club_id || !date || !time || !players || !player_names) {
      return res.status(400).json({
        error: 'Missing required fields'
      });
    }

    if (players < 1 || players > 4) {
      return res.status(400).json({
        error: 'Invalid players count'
      });
    }

    const club = await getClubById(club_id);
    if (!club) {
      return res.status(404).json({
        error: `Club not found: ${club_id}`
      });
    }

    const booking = await createBooking(club, {
      date,
      time,
      playerCount: players,
      playerNames: player_names
    });

    // Save booking to our database
    const savedBooking = await saveBooking({
      ...booking,
      courseInfo: club.courseInfo
    });

    res.status(201).json({
      booking_id: savedBooking.bookingId,
      courseInfo: club.courseInfo,
      ...savedBooking
    });
  } catch (error) {
    console.error('Booking error:', error);
    if (error.message.includes('Club not found')) {
      return res.status(404).json({
        error: error.message
      });
    }
    res.status(500).json({
      error: error.message
    });
  }
}); 