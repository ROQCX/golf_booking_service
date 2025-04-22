import express from 'express';
import { createBooking } from '../services/ezlinksClient.js';
import { getClubById } from '../db/clubs.js';
import { saveBooking, getBooking, updateBooking } from '../db/bookings.js';

export const bookingRouter = express.Router();

// Create a new booking
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

// Get a specific booking
bookingRouter.get('/:bookingId', async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await getBooking(bookingId);
    
    if (!booking) {
      return res.status(404).json({
        error: `Booking not found: ${bookingId}`
      });
    }

    res.json(booking);
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

// Update a booking
bookingRouter.patch('/:bookingId', async (req, res) => {
  try {
    const { bookingId } = req.params;
    const updates = req.body;
    
    // Get existing booking
    const existingBooking = await getBooking(bookingId);
    if (!existingBooking) {
      return res.status(404).json({
        error: `Booking not found: ${bookingId}`
      });
    }

    // Validate updates
    if (updates.players && (updates.players < 1 || updates.players > 4)) {
      return res.status(400).json({
        error: 'Invalid players count'
      });
    }

    // Update booking
    const updatedBooking = await updateBooking(bookingId, updates);
    
    res.json(updatedBooking);
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({
      error: error.message
    });
  }
}); 